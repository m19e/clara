import Head from "next/head";
import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { Editor, EditorState } from "draft-js";
import Footer from "./Footer";

const styles: { [key: string]: CSSProperties } = {
    root: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "navajowhite",
    },
    scroll: {
        border: "1px dashed gray",
        writingMode: "vertical-rl",
        width: "720px",
        height: "720px",
        overflowX: "auto",
    },
    editor: {
        fontSize: "24px",
        backgroundColor: "white",
        // width: "98%",
        // overflowX: "auto",
        // overflowY: "hidden",
        // whiteSpace: "nowrap",
    },
};

const VerticalEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editor = useRef(null);
    const focusEditor = () => editor.current.focus();

    useEffect(() => {
        focusEditor();
    }, []);

    return (
        <>
            <Head>
                <style>{`* { margin: 0px; padding: 0px; overflow: hidden; }`}</style>
            </Head>
            <div style={styles.root}>
                <div style={styles.container} onClick={focusEditor}>
                    <div style={styles.scroll}>
                        <div style={styles.editor}>
                            <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default VerticalEditor;
