import Head from "next/head";
import React, { useState, useRef, useEffect, createRef, CSSProperties } from "react";
import { Provider, atom, useAtom } from "jotai";
import { Editor, EditorState } from "draft-js";

import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

const fontSizeAtom = atom(24);
const lineCharsAtom = atom(30);
const wrapperHeightAtom = atom(480);
const editorHeightAtom = atom((get) => get(fontSizeAtom) * get(lineCharsAtom));
const isDisabledFSAtom = atom((get) => (get(fontSizeAtom) + 4) * get(lineCharsAtom) > get(wrapperHeightAtom));
const isDisabledLCAtom = atom((get) => get(fontSizeAtom) * (get(lineCharsAtom) + 1) > get(wrapperHeightAtom));

const Footer = () => {
    const [fontSize, setFontSize] = useAtom(fontSizeAtom);
    const [lineChars, setlineChars] = useAtom(lineCharsAtom);
    const [isDisabledFS] = useAtom(isDisabledFSAtom);
    const [isDisabledLC] = useAtom(isDisabledLCAtom);

    return (
        <div className="bg-gray-300 flex-center" style={{ minHeight: "120px" }}>
            <div className="bg-white w-24 h-24 m-2 flex-center">
                <p>control</p>
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
                                <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                            </div>
                        </Scrollbar>
                    </div>
                </div>
                <Footer />
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
