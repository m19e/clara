import { useRouter } from "next/router";
import { useState, useEffect, createRef, useRef, RefObject, useCallback } from "react";
import { Editor, EditorState, ContentState, SelectionState, getDefaultKeyBinding } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import NovelViewerConfig from "./NovelViewerConfig";
import TitleEditModal from "./NovelTitleEditModal";
import ConfirmableModal from "./ConfirmableModal";
import { updateNovel, deleteNovel } from "../lib/firebase/initFirebase";

type SelectionRangeOverride = {
    anchorOffset: number;
    focusOffset?: number;
    anchorKey?: string;
    focusKey?: string;
    isBackward?: boolean;
};

const useFontSize = (
    fs: "base" | "xl" | "2xl",
    rfs: 16 | 20 | 24,
    lh: 1.5 | 1.75 | 2.0
): ["base" | "xl" | "2xl", 16 | 20 | 24, 1.5 | 1.75 | 2.0, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const [realFontSize, setRealFontSize] = useState(rfs);
    const [lineHeight, setLineHeight] = useState(lh);
    const setFontBase = useCallback(() => {
        setFontSize("base");
        setRealFontSize(16);
        setLineHeight(1.5);
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("xl");
        setRealFontSize(20);
        setLineHeight(1.75);
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("2xl");
        setRealFontSize(24);
        setLineHeight(2.0);
    }, []);

    return [fontSize, realFontSize, lineHeight, setFontBase, setFontXl, setFont2xl];
};

const useFont = (f: "mincho" | "gothic"): ["mincho" | "gothic", () => void, () => void] => {
    const [font, setFont] = useState(f);
    const setMincho = useCallback(() => {
        setFont("mincho");
    }, []);
    const setGothic = useCallback(() => {
        setFont("gothic");
    }, []);

    return [font, setMincho, setGothic];
};

export default function NovelEditor({ id, title, content }: { id: string; title: string; content: string }) {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(content)));
    const editorRef: RefObject<HTMLDivElement> = createRef();
    const ps = useRef<HTMLElement>();
    const [showScrollbar, setShowScrollbar] = useState(false);
    const [editorHeight, setEditorHeight] = useState(480);
    const [lineWords, setLineWords] = useState(0);
    const [rootTitle, setRootTitle] = useState(title);

    const [fontSize, realFontSize, lineHeight, setFontBase, setFontXl, setFont2xl] = useFontSize("xl", 20, 1.75);
    const [font, setMincho, setGothic] = useFont("mincho");
    const viewerConfig = {
        fontSize,
        toggleFontSmall: setFontBase,
        toggleFontMedium: setFontXl,
        toggleFontLarge: setFont2xl,
        font,
        setMincho,
        setGothic,
    };

    const router = useRouter();

    useEffect(() => {
        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            const heightTQ = Math.floor(height * 0.75);
            const eh = heightTQ - (heightTQ % realFontSize);
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
        await updateNovel(id, rootTitle, text);
        router.push(`/novel/${id}`);
    };

    const confirmDelete = async () => {
        await deleteNovel(id);
        router.push("/");
    };

    const onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
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

    const handleKeyBinding = (e: React.KeyboardEvent) => {
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
                    break;
            }
            return null;
        }

        return getDefaultKeyBinding(e);
    };

    return (
        <div ref={editorRef} className="w-full h-screen flex justify-end editor-bg">
            <Scrollbar
                containerRef={(ref) => (ps.current = ref)}
                onWheel={onMouseWheel}
                className={showScrollbar ? "transition-opacity opacity-100" : " opacity-0"}
            >
                <div className="h-full flex items-center">
                    <div className="writing-v-rl" style={{ height: `${editorHeight}px`, maxHeight: "720px", minHeight: "480px" }}>
                        <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                            <div className="flex items-center flex-wrap">
                                <span className="text-4xl font-bold whitespace-pre-wrap opacity-75">{rootTitle}</span>
                                <span className="mt-2 w-8 h-8 rounded-full shadow-md flex-center cursor-pointer">
                                    <TitleEditModal title={rootTitle} setTitle={setRootTitle} />
                                </span>
                            </div>
                        </div>
                        <div className={"leading-relaxed text-justify pl-16 " + font + " text-" + fontSize}>
                            <Editor editorState={editorState} onChange={setEditorState} keyBindingFn={handleKeyBinding} />
                        </div>
                    </div>
                </div>
            </Scrollbar>
            <div className={"fixed bottom-0 w-12 mb-4 mr-2 novelView-header__show"}>
                <div className="flex-col flex-center w-full">
                    <ConfirmableModal
                        popperText="保存"
                        d="M5 13l4 4L19 7"
                        message="編集内容を保存しますか？"
                        confirmText="保存する"
                        cancelText="閉じる"
                        confirmFunc={confirmUpdate}
                    />
                    <ConfirmableModal
                        popperText="戻る"
                        d="M6 18L18 6M6 6l12 12"
                        message="小説ページに戻りますか？"
                        confirmText="戻る"
                        cancelText="閉じる"
                        back
                        novelID={id}
                    />
                    <NovelViewerConfig viewerConfig={viewerConfig} />
                    <div className="mt-8">
                        <ConfirmableModal
                            popperText="削除"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            message="この小説を削除しますか？"
                            confirmText="削除する"
                            cancelText="閉じる"
                            confirmFunc={confirmDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
