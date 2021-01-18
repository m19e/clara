import { useState, useEffect, createRef, RefObject } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

export default function NovelEditor({ title, content }: { title: string; content: string }) {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(content)));
    const editorRef: RefObject<HTMLDivElement> = createRef();
    const [editorHeight, setEditorHeight] = useState(480);

    useEffect(() => {
        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            const heightTQ = Math.floor(height * 0.75);
            setEditorHeight(heightTQ - (heightTQ % 20));
        });
        editorRef.current && resizeObs.observe(editorRef.current);

        return () => {
            resizeObs.disconnect();
        };
    }, []);

    return (
        <div ref={editorRef} className="w-full h-screen editor-bg">
            <Scrollbar className="w-full h-full">
                <div className="writing-v-rl h-full flex flex-col items-center">
                    <div style={{ height: `${editorHeight}px`, maxHeight: "720px", minHeight: "480px" }}>
                        <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                            <p className="text-4xl font-bold opacity-75">{title}</p>
                        </div>
                        <div className="leading-relaxed text-justify pl-16 mincho" style={{ fontSize: "24px" }}>
                            <Editor editorState={editorState} onChange={setEditorState} />
                        </div>
                    </div>
                </div>
            </Scrollbar>
        </div>
    );
}
