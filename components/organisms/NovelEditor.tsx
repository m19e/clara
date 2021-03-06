import { useRouter } from "next/router";
import { useState, useEffect, createRef, useRef, RefObject, WheelEvent, KeyboardEvent } from "react";
import { Editor, EditorState, ContentState, SelectionState, getDefaultKeyBinding } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { INovelProp, SelectionRangeOverride } from "types";
import { updateNovel, deleteNovel, setUsedTags } from "lib/firebase/initFirebase";
import { getRootNovelInfos, setRootNovelInfos } from "lib/firebase/novel";
import { unifyUsedTags } from "lib/novel/tools";
import { useSuggests } from "store/novel";
import { useFont, useFormat } from "hooks/novel";
import Header from "foundations/ClaraHeader";
import TitleEdit from "components/molecules/Modal/NovelTitleEdit";
import TagsEdit from "components/molecules/Modal/NovelTagsEdit";
import NovelConfig from "components/molecules/Modal/NovelConfig";
import EditableTagList from "components/molecules/TagList/Editable";
import Confirmable from "components/molecules/Modal/Confirmable";

type Props = {
    novel: INovelProp;
    usedTags: {
        name: string;
        count: number;
    }[];
};

const NovelEditor = ({ novel, usedTags }: Props) => {
    const editorRef: RefObject<HTMLDivElement> = createRef();
    const ps = useRef<HTMLElement>();

    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(novel.content)));
    const [showScrollbar, setShowScrollbar] = useState(false);
    const [editorHeight, setEditorHeight] = useState(480);
    const [lineWords, setLineWords] = useState(0);
    const [rootTitle, setRootTitle] = useState(novel.title);
    const [tags, setTags] = useState(novel.tags);
    const [r18, setR18] = useState(novel.r18);

    const [fontSize, realFontSize, setFontBase, setFontXl, setFont2xl] = useFormat("text-xl", 20);
    const [font, setMincho, setGothic] = useFont(false);
    const [suggests, setSuggests] = useSuggests();

    const router = useRouter();

    const viewerConfig = {
        fontSize,
        setFontBase,
        setFontXl,
        setFont2xl,
        font,
        setMincho,
        setGothic,
    };

    useEffect(() => {
        setSuggests(usedTags);
    }, []);

    useEffect(() => {
        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            const heightTQ = Math.floor(height * 0.75);
            const eh = ((h: number, rfs: number) => {
                if (h > 720) return 720;
                if (h < 480) return 480;
                return h - (h % rfs);
            })(heightTQ, realFontSize);
            setEditorHeight(eh);
            setLineWords(eh / realFontSize);
        });
        editorRef.current && resizeObs.observe(editorRef.current);

        if (ps.current) {
            ps.current.scrollLeft += ps.current.scrollWidth;
            setShowScrollbar(true);
        }

        return () => {
            resizeObs.disconnect();
        };
    }, [realFontSize]);

    const confirmUpdate = async () => {
        const text = editorState.getCurrentContent().getPlainText();
        await updateNovel(novel.id, rootTitle, text, tags, r18);
        const newUsedTags = unifyUsedTags(suggests, novel.tags, tags);
        await setUsedTags(novel.author_uid, newUsedTags);
        // update novel info
        const infos = await getRootNovelInfos();
        const targetIndex = infos.findIndex((info) => info.id === novel.id);
        if (targetIndex !== -1 && JSON.stringify(tags) !== JSON.stringify(infos[targetIndex].tags)) {
            const udpated = [].concat(infos.slice(0, targetIndex), [Object.assign(infos[targetIndex], { tags })], infos.slice(targetIndex + 1));
            await setRootNovelInfos(udpated);
        }
        router.push(`/novel/${novel.id}`);
    };

    const confirmDelete = async () => {
        await deleteNovel(novel.id);
        const newUsedTags = unifyUsedTags(suggests, novel.tags, []);
        await setUsedTags(novel.author_uid, newUsedTags);
        // delete novel info
        const infos = await getRootNovelInfos();
        const targetIndex = infos.findIndex((info) => info.id === novel.id);
        if (targetIndex !== -1) {
            const deleted = [].concat(infos.slice(0, targetIndex), infos.slice(targetIndex + 1));
            await setRootNovelInfos(deleted);
        }
        router.push("/");
    };

    const handleWheel = (e: WheelEvent<HTMLElement>) => {
        if (ps.current) {
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    const setSelectionCaret = (selection: SelectionState, offset: number, key: string) => {
        const override: SelectionRangeOverride = {
            anchorOffset: offset,
            focusOffset: offset,
            anchorKey: key,
            focusKey: key,
        };
        setSelectionRange(selection, override);
    };

    const setSelectionRange = (selection: SelectionState, override: SelectionRangeOverride) => {
        const newSelection = selection.merge(override);
        const newEditor = EditorState.forceSelection(editorState, newSelection);
        setEditorState(newEditor);
    };

    const handleKeyBinding = (e: KeyboardEvent) => {
        if (e.key === "Tab") {
            e.preventDefault();
            return null;
        }
        if (e.key.includes("Arrow")) {
            e.preventDefault();

            const selection = editorState.getSelection();
            const content = editorState.getCurrentContent();
            const offset = selection.getAnchorOffset();
            const key = selection.getAnchorKey();
            const blockLen = content.getBlockForKey(key).getLength();

            switch (e.key) {
                case "ArrowUp":
                    if (offset === 0) {
                        const beforeKey = content.getKeyBefore(key);
                        if (!beforeKey) break;
                        const beforeLen = content.getBlockForKey(beforeKey).getLength();
                        if (e.shiftKey) {
                            const isBackward = key === selection.getFocusKey() && offset === selection.getFocusOffset() ? false : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: beforeLen, anchorKey: beforeKey, isBackward });
                        } else {
                            setSelectionCaret(selection, beforeLen, beforeKey);
                        }
                    } else {
                        if (e.shiftKey) {
                            const isBackward = key === selection.getFocusKey() && offset === selection.getFocusOffset() ? false : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: offset - 1, isBackward });
                        } else {
                            setSelectionCaret(selection, offset - 1, key);
                        }
                    }
                    break;

                case "ArrowDown":
                    if (offset === blockLen) {
                        const afterKey = content.getKeyAfter(key);
                        if (!afterKey) break;
                        if (e.shiftKey) {
                            const isBackward = key === selection.getFocusKey() && offset === selection.getFocusOffset() ? true : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: 0, anchorKey: afterKey, isBackward });
                        } else {
                            setSelectionCaret(selection, 0, afterKey);
                        }
                    } else {
                        if (e.shiftKey) {
                            const isBackward = key === selection.getFocusKey() && offset === selection.getFocusOffset() ? true : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: offset + 1, isBackward });
                        } else {
                            setSelectionCaret(selection, offset + 1, key);
                        }
                    }
                    break;

                case "ArrowRight":
                    if (offset > lineWords) {
                        e.shiftKey ? setSelectionRange(selection, { anchorOffset: offset - lineWords }) : setSelectionCaret(selection, offset - lineWords, key);
                    } else {
                        const beforeKey = content.getKeyBefore(key);
                        if (!beforeKey) {
                            if (e.shiftKey) {
                                setSelectionRange(selection, { anchorOffset: 0 });
                                break;
                            }
                            return "move-selection-to-start-of-block";
                        }
                        const beforeLen = content.getBlockForKey(beforeKey).getLength();
                        if (beforeLen === lineWords) {
                            setSelectionCaret(selection, offset, beforeKey);
                            break;
                        }
                        const beforeTargetLine = Math.floor(beforeLen / lineWords) * lineWords;
                        const beforeOffset = beforeTargetLine + Math.min(offset % lineWords, beforeLen % lineWords);
                        if (e.shiftKey) {
                            const isBackward =
                                key === selection.getFocusKey() && offset - lineWords <= selection.getFocusOffset() ? false : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: beforeOffset, anchorKey: beforeKey, isBackward });
                        } else {
                            setSelectionCaret(selection, beforeOffset, beforeKey);
                        }
                    }
                    ps.current.scrollLeft += realFontSize * 1.5 + 2;
                    break;

                case "ArrowLeft":
                    if (blockLen > lineWords) {
                        if (blockLen >= offset + lineWords) {
                            e.shiftKey
                                ? setSelectionRange(selection, { anchorOffset: offset + lineWords })
                                : setSelectionCaret(selection, offset + lineWords, key);
                        } else {
                            const afterKey = content.getKeyAfter(key);
                            if (!afterKey || offset % lineWords > blockLen % lineWords) {
                                if (e.shiftKey) {
                                    setSelectionRange(selection, { anchorOffset: blockLen });
                                    break;
                                }
                                return "move-selection-to-end-of-block";
                            }
                            const afterLen = content.getBlockForKey(afterKey).getLength();
                            if (e.shiftKey) {
                                const isBackward =
                                    key === selection.getFocusKey() && offset + lineWords >= selection.getFocusOffset() ? true : selection.getIsBackward();
                                setSelectionRange(selection, { anchorOffset: Math.min(offset % lineWords, afterLen), anchorKey: afterKey, isBackward });
                            } else {
                                setSelectionCaret(selection, Math.min(offset % lineWords, afterLen), afterKey);
                            }
                        }
                    } else {
                        const afterKey = content.getKeyAfter(key);
                        if (!afterKey) {
                            if (e.shiftKey) {
                                setSelectionRange(selection, { anchorOffset: blockLen });
                                break;
                            }
                            return "move-selection-to-end-of-block";
                        }
                        const afterLen = content.getBlockForKey(afterKey).getLength();
                        const afterOffset = afterLen < offset ? afterLen : offset;
                        if (e.shiftKey) {
                            const isBackward =
                                key === selection.getFocusKey() && offset + lineWords >= selection.getFocusOffset() ? true : selection.getIsBackward();
                            setSelectionRange(selection, { anchorOffset: afterOffset, anchorKey: afterKey, isBackward });
                        } else {
                            setSelectionCaret(selection, afterOffset, afterKey);
                        }
                    }
                    ps.current.scrollLeft -= realFontSize * 1.5 + 2;
                    break;
            }
            return null;
        }

        return getDefaultKeyBinding(e);
    };

    const handleEditorChange = (es: EditorState) => {
        setEditorState(es);
    };

    return (
        <div ref={editorRef} className="w-full h-screen flex justify-end editor-bg">
            <Header
                title={"小説を編集 | Clara"}
                description={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogTitle={"Clara"}
                ogDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twTitle={"Clara"}
                twDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL}
                twCard="summary"
            />
            <Scrollbar
                containerRef={(ref) => (ps.current = ref)}
                onWheel={handleWheel}
                className={showScrollbar ? "transition-opacity opacity-100" : " opacity-0"}
            >
                <div className="h-full flex items-center">
                    <div className="writing-v-rl" style={{ height: `${editorHeight}px`, maxHeight: "720px", minHeight: "480px" }}>
                        <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                            <div className="flex items-center flex-wrap">
                                <span className="text-4xl font-bold whitespace-pre-wrap opacity-75">{rootTitle}</span>
                                <span className="mt-2 w-8 h-8 rounded-full shadow-md flex-center cursor-pointer">
                                    <TitleEdit title={rootTitle} setTitle={setRootTitle} />
                                </span>
                            </div>
                            <div className="flex items-center flex-wrap mr-1.5">
                                <EditableTagList r18={r18} tags={tags} />
                                <TagsEdit tags={tags} setTags={setTags} r18={r18} setR18={setR18} />
                            </div>
                        </div>
                        <div className={"leading-relaxed text-justify pl-16 " + font + " " + fontSize}>
                            <Editor editorState={editorState} onChange={handleEditorChange} keyBindingFn={handleKeyBinding} />
                        </div>
                    </div>
                </div>
            </Scrollbar>
            <div className="fixed bottom-0 w-12 mb-4 mr-2 novelView-header__show">
                <div className="flex-col flex-center w-full">
                    <Confirmable
                        popperText="保存"
                        d="M5 13l4 4L19 7"
                        message="編集内容を保存しますか？"
                        confirmText="保存する"
                        cancelText="閉じる"
                        onConfirm={confirmUpdate}
                    />
                    <Confirmable
                        popperText="戻る"
                        d="M6 18L18 6M6 6l12 12"
                        message="小説ページに戻りますか？"
                        confirmText="戻る"
                        cancelText="閉じる"
                        link
                        novelID={novel.id}
                    />
                    <NovelConfig viewerConfig={viewerConfig} />
                    <div className="mt-8">
                        <Confirmable
                            popperText="削除"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            message="この小説を削除しますか？"
                            confirmText="削除する"
                            cancelText="閉じる"
                            onConfirm={confirmDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NovelEditor;
