import Head from "next/head";
import { useRouter } from "next/router";
import fb from "firebase";
import React, { useState, useRef, useEffect, createRef } from "react";
import { RecoilRoot, useRecoilValue, useSetRecoilState } from "recoil";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import { auth, getUserID, createDraftData, readDraftData, updateDraftData, getEdittingDraftData, setEdittingDraftData } from "../lib/firebase/initFirebase";
import { isMinchoState, realFontSizeState, wrapperHeightState, editorHeightState } from "../store/editor";
import Footer from "./Footer";
import Loader from "./Loader";

type User = {
    uid: string;
    displayName: string;
    photoURL: string;
    userID?: string;
};

const convertEditorStateFromJSON = (json: string): EditorState => {
    return EditorState.createWithContent(convertFromRaw(JSON.parse(json)));
};

const convertEditorStateToJSON = (es: EditorState): string => {
    return JSON.stringify(convertToRaw(es.getCurrentContent()));
};

const VerticalEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editorRef = useRef(null);
    const wrapperRef: React.RefObject<HTMLDivElement> = createRef();
    const ps = useRef<HTMLElement>();
    const [currentUser, setCurrentUser] = useState<null | User>(null);
    const [draftID, setDraftID] = useState("");
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(true);
    const [title, setTitle] = useState("");

    const router = useRouter();

    const setWrapperHeight = useSetRecoilState(wrapperHeightState);
    const fs = useRecoilValue(realFontSizeState);
    const eh = useRecoilValue(editorHeightState);
    const isMincho = useRecoilValue(isMinchoState);

    const focusEditor = () => editorRef.current.focus();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            user ? handleEdittingDraft(user) : router.push("/auth");
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
            if (!isSaved) updateDraft(editorState);
        }, 5000);
        return () => clearTimeout(timer);
    }, [editorState]);

    const handleEdittingDraft = async (user: fb.User) => {
        const userID = await getUserID(user.uid);
        setCurrentUser({ ...user, userID });
        const ed = await getEdittingDraftData(user.uid);
        const { did, content } = ed;
        const es = convertEditorStateFromJSON(content);
        setDraftID(did);
        handleEditorStateChange(es);
        setLoading(false);
        // focusEditor();
    };

    const setEdittingDraft = async (did, uid: string, es: EditorState) => {
        const draft = convertEditorStateToJSON(es);
        await setEdittingDraftData(did, uid, draft);
    };

    const createDraft = async (es: EditorState) => {
        const data = convertEditorStateToJSON(es);
        const dID = await createDraftData(currentUser.uid, data);
        setDraftID(dID);
        await setEdittingDraft(dID, currentUser.uid, es);
    };

    const readDraft = async () => {
        const data = await readDraftData(currentUser.uid, draftID);
        const es = JSON.parse(data);
        setEditorState(es);
    };

    const updateDraft = async (es: EditorState) => {
        const data = convertEditorStateToJSON(es);
        await updateDraftData(draftID, currentUser.uid, data);
        await setEdittingDraftData(draftID, currentUser.uid, data);
        setIsSaved(true);
    };

    const onMouseWheelPS = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    const handleEditorStateChange = (es: EditorState) => {
        const firstBlockText = es.getCurrentContent().getBlockMap().first().getText().trim();
        const formatTitle = firstBlockText.length < 20 ? firstBlockText : firstBlockText.slice(0, 20) + "…";
        setTitle(formatTitle);
        setIsSaved(false);
        setEditorState(es);
    };

    return (
        <>
            <Head>
                <style>{`* { margin: 0px; overflow: hidden; }`}</style>
            </Head>
            <div className={"fixed top-0 w-full" + (isMincho ? " mincho" : " gothic")}>
                <div className="flex justify-between items-center">
                    <div className="w-20"></div>
                    <p className="text-black opacity-50 py-5 flex-grow-0">{title}</p>
                    <div className="w-20">
                        <div className="flex justify-end items-center">
                            <span className="px-4 opacity-50">
                                <svg className="w-8 h-8" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                    <g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="m5.029 10.429h10" />
                                        <path d="m10.029 15.429v-10.001" />
                                    </g>
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="min-h-screen flex flex-col editor-bg">
                <div className={"flex-1 flex flex-col flex-grow"}>
                    {/* <div className={"flex-1 flex flex-col flex-grow bg-yellow-100"} onClick={focusEditor}> */}
                    <div className={"flex-1 flex-center"} ref={wrapperRef}>
                        {loading ? (
                            <Loader />
                        ) : (
                            <Scrollbar
                                containerRef={(ref) => (ps.current = ref)}
                                onWheel={onMouseWheelPS}
                                // className="border border-dashed border-gray-400 pb-2"
                                className="pb-2"
                                style={{ maxHeight: "95%", maxWidth: "95%", height: `${eh + 8}px` }}
                            >
                                <div
                                    className={"writing-v-rl text-justify max-h-full" + (isMincho ? " mincho" : " gothic")}
                                    style={{ minWidth: "5em", fontSize: `${fs}px`, height: `${eh}px` }}
                                >
                                    <Editor editorKey="editor" ref={editorRef} editorState={editorState} onChange={handleEditorStateChange} />
                                </div>
                            </Scrollbar>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default function VerticalEditorProvider() {
    return (
        <RecoilRoot>
            <VerticalEditor />
        </RecoilRoot>
    );
}
