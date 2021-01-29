import Head from "next/head";
import { useRouter } from "next/router";
import fb from "firebase";
import React, { useState, useRef, useEffect, createRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Editor, EditorState, ContentState, getDefaultKeyBinding, SelectionState } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import { auth, getUserDataByUID, readDraftData, updateDraftData } from "../lib/firebase/initFirebase";
import { isMinchoState, realFontSizeState, wrapperHeightState, editorHeightState, useFormat, useLineWords } from "../store/editor";
import { useProfile } from "../store/user";
import { useDraftID, useTitle, useContent } from "../store/draft";
import Frame from "./EditorFrame";
import Loader from "./Loader";

type SelectionRangeOverride = {
    anchorOffset: number;
    focusOffset?: number;
    anchorKey?: string;
    focusKey?: string;
    isBackward?: boolean;
};

const createEditorStateWithText = (text: string): EditorState => EditorState.createWithContent(ContentState.createFromText(text));

const createTextWithEditorState = (es: EditorState): string => es.getCurrentContent().getPlainText();

export default function VerticalEditor() {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editorRef = useRef(null);
    const wrapperRef: React.RefObject<HTMLDivElement> = createRef();
    const ps = useRef<HTMLElement>();
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(true);

    const router = useRouter();

    const setWrapperHeight = useSetRecoilState(wrapperHeightState);
    const fs = useRecoilValue(realFontSizeState);
    const eh = useRecoilValue(editorHeightState);
    const isMincho = useRecoilValue(isMinchoState);
    const [userProfile, setUserProfile] = useProfile();
    const setFormatAll = useFormat();
    const [draftID, setDraftID] = useDraftID();
    const [, setTitle] = useTitle();
    const [, setContent] = useContent();
    const [lineWords] = useLineWords();

    const focusEditor = () => editorRef.current.focus();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            user ? initEditor(user) : router.push("/");
        });

        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            setWrapperHeight(height);
        });
        wrapperRef.current && resizeObs.observe(wrapperRef.current);

        return () => {
            resizeObs.disconnect();
        };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isSaved) updateDraft(userProfile.uid, draftID, editorState);
        }, 5000);
        return () => clearTimeout(timer);
    }, [editorState]);

    const initEditor = async (user: fb.User) => {
        const { uid, displayName, photoURL } = user;
        const userData = await getUserDataByUID(uid);
        const im = userData.isMincho;
        const { userID, recent, fontSize, lineWords } = userData;
        const profile = { uid, displayName, photoURL, userID };

        setFormatAll({ isMincho: im, fontSize, lineWords });
        setUserProfile(profile);
        setDraftID(recent);
        await readDraft(uid, recent);
        setLoading(false);
        // focusEditor();
    };

    const readDraft = async (uid, did: string) => {
        const { title, content } = await readDraftData(uid, did);
        const es = createEditorStateWithText(content);
        setTitle(title);
        handleEditorStateChange(es);
    };

    const updateDraft = async (uid, did: string, es: EditorState) => {
        const content = createTextWithEditorState(es);
        await updateDraftData(did, uid, content);
        setIsSaved(true);
    };

    const handleWheel = (e: React.WheelEvent<HTMLElement>) => {
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
                    if (ps.current) {
                        ps.current.scrollLeft += fs * 1.5;
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
                    if (ps.current) {
                        ps.current.scrollLeft -= fs * 1.5;
                    }
                    break;
            }
            return null;
        }

        return getDefaultKeyBinding(e);
    };

    const handleEditorStateChange = (es: EditorState) => {
        setIsSaved(false);
        setEditorState(es);
        setContent(createTextWithEditorState(es));
    };

    return (
        <>
            <Head>
                <style>{`* { margin: 0px; overflow: hidden; }`}</style>
            </Head>
            {loading ? (
                <div className="min-h-screen flex-center editor-bg">
                    <Loader />
                </div>
            ) : (
                <>
                    <div className="min-h-screen flex flex-col editor-bg">
                        <div className={"flex-1 flex flex-col flex-grow"}>
                            <div className={"flex-1 flex-center"} ref={wrapperRef}>
                                <Scrollbar
                                    containerRef={(ref) => (ps.current = ref)}
                                    onWheel={handleWheel}
                                    className="pb-4 w-full"
                                    style={{ maxHeight: "95%", height: `${eh + 16}px` }}
                                >
                                    <div
                                        className={"writing-v-rl text-justify max-h-full px-6 m-auto" + (isMincho ? " mincho" : " gothic")}
                                        style={{ minWidth: "5em", fontSize: `${fs}px`, height: `${eh}px` }}
                                    >
                                        <Editor
                                            editorKey="editor"
                                            ref={editorRef}
                                            editorState={editorState}
                                            onChange={handleEditorStateChange}
                                            keyBindingFn={handleKeyBinding}
                                        />
                                    </div>
                                </Scrollbar>
                            </div>
                        </div>
                    </div>
                    <Frame />
                </>
            )}
        </>
    );
}

type CharCounterProps = {
    editorState: EditorState;
};

const CharCounter = ({ editorState }: CharCounterProps) => {
    const getCharCount = (es: EditorState): number => {
        const plainText = es.getCurrentContent().getPlainText("");
        const regex = /(?:\r\n|\r|\n)/g;
        const cleanString = plainText.replace(regex, "").trim();
        return Array.from(cleanString).length;
    };

    const count = getCharCount(editorState);

    return (
        <div className="w-full flex-center">
            <div className="m-1">
                <span className="mincho opacity-50">{count}字</span>
            </div>
        </div>
    );
};
