import React, { useState, useEffect, CSSProperties } from "react";
import { Editor, EditorState } from "draft-js";

const styles: { [key: string]: CSSProperties } = {
    editor: { border: "1px solid black", minHeight: "6em", cursor: "text" },
};

const VerticalEditor = () => {
    const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
    const editor = React.useRef(null);
    const focusEditor = () => editor.current.focus();

    useEffect(() => {
        focusEditor();
    }, []);

    return (
        <div style={styles.editor} onClick={focusEditor}>
            <Editor ref={editor} editorState={editorState} onChange={setEditorState} placeholder="Write something!" />
        </div>
    );
};

export default VerticalEditor;
