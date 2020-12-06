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
    wrapper: {
        border: "1px solid black",
        minWidth: "6em",
        cursor: "text",
        flexGrow: 1,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    editor: {
        border: "1px solid black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "24px",
        writingMode: "vertical-rl",
        // padding: "auto",
        width: "98%",
        height: "100%",
        overflowX: "auto",
        overflowY: "hidden",
        whiteSpace: "nowrap",
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
            <div style={styles.root}>
                <div style={styles.container}>
                    <div style={styles.wrapper}>
                        <div style={styles.editor} onClick={focusEditor}>
                            <div style={{ border: "1px solid black" }}>
                                <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        </>
    );
};

export default VerticalEditor;
