import Head from "next/head";
import React, { useState, useRef, useEffect, CSSProperties } from "react";
import { Editor, EditorState } from "draft-js";
import Footer from "./Footer";

const styles: { [key: string]: CSSProperties } = {
    root: {
        height: "100vh",
    },
    container: {
        height: "100%",
        // border: "1px solid lightgrey",
        // padding: "8px",
        display: "flex",
        flexDirection: "column",
    },
    editor: {
        border: "1px solid black",
        minHeight: "6em",
        cursor: "text",
        flexGrow: 1,
    },
    tate: {
        flex: 1,
        // textAlign: justify,
        fontSize: "24px",
        margin: "auto",
        writingMode: "vertical-rl",
        // maxHeight: "100%",
        cursor: "text",
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
                <style>{`* { margin: 0px; padding: 0px;}`}</style>
            </Head>
            <div style={styles.container}>
                <div style={styles.editor} onClick={focusEditor}>
                    <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                </div>
                <Footer />
            </div>
        </>
    );
};

export default VerticalEditor;
