import Head from "next/head";
import { useRouter } from "next/router";
import fb from "firebase";
import React, { useState, useRef, useEffect, createRef } from "react";
import { Provider, atom, useAtom } from "jotai";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import { auth, createDraftData, readDraftData, updateDraftData, getEdittingDraftData, setEdittingDraftData } from "../lib/firebase/initFirebase";

const fontSizeAtom = atom(24);
const lineCharsAtom = atom(30);
const wrapperHeightAtom = atom(480);
const editorHeightAtom = atom((get) => get(fontSizeAtom) * get(lineCharsAtom));
const isDisabledFSAtom = atom((get) => (get(fontSizeAtom) + 4) * get(lineCharsAtom) > get(wrapperHeightAtom));
const isDisabledLCAtom = atom((get) => get(fontSizeAtom) * (get(lineCharsAtom) + 1) > get(wrapperHeightAtom));

type FooterProps = {
    did: string;
    create: () => void;
    update: () => void;
};

const Footer = ({ did, create, update }: FooterProps) => {
    const [fontSize, setFontSize] = useAtom(fontSizeAtom);
    const [lineChars, setlineChars] = useAtom(lineCharsAtom);
    const [isDisabledFS] = useAtom(isDisabledFSAtom);
    const [isDisabledLC] = useAtom(isDisabledLCAtom);

    return (
        <div className="bg-gray-300 flex-center transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100" style={{ minHeight: "120px" }}>
            <div className="bg-white w-24 h-24 m-2 flex-center">
                <div className="flex flex-col">
                    <button onClick={() => create()}>Create</button>
                    <p>{did}</p>
                    <button onClick={() => update()}>Update</button>
                </div>
            </div>
            <div className="bg-white w-24 h-24 m-2 flex-center">
                <div className="flex flex-col">
                    <button onClick={() => setFontSize((prev) => prev + 4)} disabled={fontSize >= 48 || isDisabledFS}>
                        ↑
                    </button>
                    <p>fontsize:{fontSize}</p>
                    <button onClick={() => setFontSize((prev) => prev - 4)} disabled={fontSize <= 16}>
                        ↓
                    </button>
                </div>
            </div>
            <div className="bg-white w-24 h-24 m-2 flex-center">
                <div className="flex flex-col">
                    <button onClick={() => setlineChars((prev) => prev + 1)} disabled={lineChars >= 40 || isDisabledLC}>
                        ↑
                    </button>
                    <p>linechars:{lineChars}</p>
                    <button onClick={() => setlineChars((prev) => prev - 1)} disabled={lineChars <= 20}>
                        ↓
                    </button>
                </div>
            </div>
        </div>
    );
};

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
    const editor = useRef(null);
    const wrapperRef: React.RefObject<HTMLDivElement> = createRef();
    const ps = useRef<HTMLElement>();

    const [_, setWrapperHeight] = useAtom(wrapperHeightAtom);
    const [fs] = useAtom(fontSizeAtom);
    const [eh] = useAtom(editorHeightAtom);

    const focusEditor = () => editor.current.focus();

    useEffect(() => {
        focusEditor();

        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            setWrapperHeight(height);
        });
        wrapperRef.current && resizeObs.observe(wrapperRef.current);

        return () => {
            resizeObs.disconnect();
        };
    }, []);

    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<null | User>(null);
    const [draftID, setDraftID] = useState<string>("no editting");

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            user ? handleEdittingDraft(user) : router.push("/auth");
            // user ? setCurrentUser(user) : router.push("/auth");
        });
    }, []);

    const handleEdittingDraft = async (user: fb.User) => {
        setCurrentUser(user);
        const ed = await getEdittingDraftData(user.uid);
        const { did, content } = ed;
        console.log(did, content);
        const es = convertEditorStateFromJSON(content);
        setDraftID(did);
        setEditorState(es);
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
    };

    const onMouseWheelPS = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            if (ps.current === undefined) return;
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    return (
        <>
            <Head>
                <style>{`* { margin: 0px; overflow: hidden; }`}</style>
            </Head>
            <div className={"min-h-screen flex flex-col"}>
                <div className={"flex-1 flex flex-col flex-grow bg-yellow-100"} onClick={focusEditor}>
                    <div className={"flex-1 flex-center"} ref={wrapperRef}>
                        <Scrollbar
                            containerRef={(ref) => (ps.current = ref)}
                            onWheel={onMouseWheelPS}
                            className="border border-dashed border-gray-400 pb-2"
                            style={{ maxHeight: "95%", maxWidth: "95%", height: `${eh}px` }}
                        >
                            <div
                                className="writing-v-rl text-justify bg-white max-h-full"
                                style={{ minHeight: "20em", minWidth: "5em", fontSize: `${fs}px`, height: `${eh}px` }}
                            >
                                <Editor editorKey="editor" ref={editor} editorState={editorState} onChange={setEditorState} />
                            </div>
                        </Scrollbar>
                    </div>
                </div>
                <Footer did={draftID} create={() => createDraft(editorState)} update={() => updateDraft(editorState)} />
            </div>
        </>
    );
};

export default function VerticalEditorProvider() {
    return (
        <Provider>
            <VerticalEditor />
        </Provider>
    );
}