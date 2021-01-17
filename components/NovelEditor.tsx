import { useState } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function NovelEditor({ title, content }: { title: string; content: string }) {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(content)));

    return (
        <div className="h-screen w-full flex-center editor-bg">
            <Scrollbar className="h-full w-full flex items-center">
                <div className="px-6 writing-v-rl text-justify mincho" style={{ height: "672px", maxHeight: "75vh", minHeight: "504px", fontSize: "21px" }}>
                    <Editor editorState={editorState} onChange={(_) => null} readOnly />
                </div>
            </Scrollbar>
        </div>
    );
}
