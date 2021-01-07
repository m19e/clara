import Head from "next/head";
import { useRouter } from "next/router";
import fb from "firebase";
import React, { useState, useRef, useEffect, createRef } from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { Editor, EditorState, ContentState, getDefaultKeyBinding } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import { auth, getUserData, createDraftData, readDraftData, updateDraftData, setRecentDraftID } from "../lib/firebase/initFirebase";
import { isMinchoState, realFontSizeState, wrapperHeightState, editorHeightState, useFormat, useLineWords } from "../store/editor";
import { useProfile } from "../store/user";
import { useDraftID, useTitle } from "../store/draft";
import Frame from "./EditorFrame";
import Loader from "./Loader";

const createEditorStateWithText = (text: string): EditorState => EditorState.createWithContent(ContentState.createFromText(text));

const createTextWithEditorState = (es: EditorState): string => es.getCurrentContent().getPlainText();

const VerticalEditor = () => {
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
    const [lineWords] = useLineWords();

    const focusEditor = () => editorRef.current.focus();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            user ? initEditor(user) : router.push("/auth");
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
            if (!isSaved) updateDraft(userProfile.userID, draftID, editorState);
        }, 5000);
        return () => clearTimeout(timer);
    }, [editorState]);

    const initEditor = async (user: fb.User) => {
        const { uid, displayName, photoURL } = user;
        const userData = await getUserData(uid);
        const im = userData.isMincho;
        const { userID, recent, fontSize, lineWords } = userData;
        const profile = { uid, displayName, photoURL, userID };

        setFormatAll({ isMincho: im, fontSize, lineWords });
        setUserProfile(profile);
        setDraftID(recent);
        await readDraft(userID, recent);
        setLoading(false);
        // focusEditor();
    };

    const setEdittingDraft = async (did, id: string) => {
        await setRecentDraftID(did, id);
    };

    const createDraft = async (es: EditorState) => {
        const content = createTextWithEditorState(es);
        const did = await createDraftData(userProfile.userID, content);
        setDraftID(did);
        await setEdittingDraft(did, userProfile.userID);
    };

    const readDraft = async (userID, did: string) => {
        const { title, content } = await readDraftData(userID, did);
        const es = createEditorStateWithText(content);
        setTitle(title);
        handleEditorStateChange(es);
    };

    const updateDraft = async (userID, did: string, es: EditorState) => {
        const content = createTextWithEditorState(es);
        await updateDraftData(did, userID, content);
        setIsSaved(true);
    };

    const onMouseWheelPS = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    const setSelectionCaret = (d: number, k: string = editorState.getSelection().getAnchorKey()) => {
        const selection = editorState.getSelection();
        let { anchorOffset, focusOffset, anchorKey, focusKey } = JSON.parse(JSON.stringify(selection));
        anchorOffset = d;
        focusOffset = d;
        anchorKey = k;
        focusKey = k;
        const newSelection = selection.merge({
            anchorOffset,
            focusOffset,
            anchorKey,
            focusKey,
        });
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
                        setSelectionCaret(beforeLen, beforeKey);
                    } else {
                        setSelectionCaret(offset - 1);
                    }
                    break;

                case "ArrowDown":
                    if (offset === blockLen) {
                        const afterKey = content.getKeyAfter(key);
                        if (!afterKey) break;
                        setSelectionCaret(0, afterKey);
                    } else {
                        setSelectionCaret(offset + 1);
                    }
                    break;

                case "ArrowRight":
                    if (offset > lineWords) {
                        setSelectionCaret(offset - lineWords);
                    } else {
                        const beforeKey = content.getKeyBefore(key);
                        if (!beforeKey) return "move-selection-to-start-of-block";
                        const beforeLen = content.getBlockForKey(beforeKey).getLength();
                        if (beforeLen === lineWords) {
                            setSelectionCaret(offset, beforeKey);
                            break;
                        }
                        const beforeTargetLine = Math.floor(beforeLen / lineWords) * lineWords;
                        const beforeOffset = beforeTargetLine + Math.min(offset % lineWords, beforeLen % lineWords);
                        setSelectionCaret(beforeOffset, beforeKey);
                    }
                    break;

                case "ArrowLeft":
                    if (blockLen > lineWords) {
                        if (blockLen >= offset + lineWords) {
                            setSelectionCaret(offset + lineWords);
                        } else {
                            const afterKey = content.getKeyAfter(key);
                            if (!afterKey || offset % lineWords > blockLen % lineWords) return "move-selection-to-end-of-block";
                            const afterLen = content.getBlockForKey(afterKey).getLength();
                            setSelectionCaret(Math.min(offset % lineWords, afterLen), afterKey);
                        }
                    } else {
                        const afterKey = content.getKeyAfter(key);
                        if (!afterKey) return "move-selection-to-end-of-block";
                        const afterLen = content.getBlockForKey(afterKey).getLength();
                        const afterOffset = afterLen < offset ? afterLen : offset;
                        setSelectionCaret(afterOffset, afterKey);
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
                            {/* <div className={"flex-1 flex flex-col flex-grow bg-yellow-100"} onClick={focusEditor}> */}
                            <div className={"flex-1 flex-center"} ref={wrapperRef}>
                                <Scrollbar
                                    containerRef={(ref) => (ps.current = ref)}
                                    onWheel={onMouseWheelPS}
                                    // className="border border-dashed border-gray-400 pb-2"
                                    className="pb-4 max-w-full"
                                    style={{ maxHeight: "95%", height: `${eh + 16}px` }}
                                >
                                    <div
                                        className={"writing-v-rl text-justify max-h-full px-6" + (isMincho ? " mincho" : " gothic")}
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
                            <CharCounter editorState={editorState} />
                        </div>
                    </div>
                    <Frame />
                </>
            )}
        </>
    );
};

type CharCounterProps = {
    editorState: EditorState;
};

const CharCounter = ({ editorState }: CharCounterProps) => {
    const getCharCount = (es: EditorState): number => {
        const plainText = es.getCurrentContent().getPlainText("");
        const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
        const cleanString = plainText.replace(regex, "").trim(); // replace above characters w/ nothing
        return Array.from(cleanString).length;
    };

    const count = getCharCount(editorState);

    return (
        <div className="w-full flex-center">
            <div className="m-1">
                <span className="mincho opacity-50">
                    {count}
                    {/* {`(+${count})`} */}字
                </span>
            </div>
        </div>
    );
};

export default function VerticalEditorProvider() {
    return (
        <RecoilRoot>
            <VerticalEditor />
        </RecoilRoot>
    );
}
