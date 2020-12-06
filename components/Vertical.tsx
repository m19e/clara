import Head from "next/head";
import React, { useState, useRef, useEffect, createRef, CSSProperties } from "react";
import { Scrollbars } from "react-custom-scrollbars";
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
        flexGrow: 1,
        flexDirection: "column",
        backgroundColor: "navajowhite",
    },
    scroll: {
        border: "1px dashed gray",
        minWidth: "640px",
        minHeight: "480px",
        maxWidth: "95%",
        maxHeight: "90%",
        height: "728px",
        backgroundColor: "white",
    },
    editor: {
        writingMode: "vertical-rl",
        fontSize: "24px",
        backgroundColor: "white",
        maxHeight: "100%",
        height: "720px",
        minHeight: "20em",
        minWidth: "6em",
    },
};

const VerticalEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editor = useRef(null);
    const focusEditor = () => editor.current.focus();
    const scrollbars: React.RefObject<Scrollbars> = createRef();

    useEffect(() => {
        focusEditor();
    }, []);

    const onMouseWheel = (e: React.WheelEvent<Scrollbars>) => {
        const currentScrollDelta = scrollbars.current?.getScrollLeft() || 0;
        scrollbars.current.scrollLeft(currentScrollDelta - Math.floor(e.deltaY / 2));
    };

    return (
        <>
            <Head>
                <style>{`* { margin: 0px; overflow: hidden; }`}</style>
            </Head>
            <div style={styles.root}>
                <div style={styles.container} onClick={focusEditor}>
                    <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Scrollbars ref={scrollbars} onWheel={onMouseWheel} autoHide autoHideTimeout={1000} autoHideDuration={500} style={styles.scroll}>
                            <div style={styles.editor}>
                                <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                            </div>
                        </Scrollbars>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default VerticalEditor;
