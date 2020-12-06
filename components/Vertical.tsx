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
        flexDirection: "column",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "navajowhite",
    },
    scroll: {
        border: "1px dashed gray",
        writingMode: "vertical-rl",
        flex: 1,
        paddingBottom: "8px",
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
                <style>{`* { margin: 0px; padding: 0px; overflow: hidden; }`}</style>
            </Head>
            <div style={styles.root}>
                <div style={styles.container} onClick={focusEditor}>
                    <Scrollbars ref={scrollbars} onWheel={onMouseWheel} autoHide autoHideTimeout={1000} autoHideDuration={500} style={styles.scroll}>
                        <div style={styles.editor}>
                            <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
                        </div>
                    </Scrollbars>
                </div>
                <Footer />
            </div>
        </>
    );
};

export default VerticalEditor;
