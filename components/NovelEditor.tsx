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
                            <div className="flex items-center flex-wrap">
                                <span className="text-4xl font-bold opacity-75">{title}</span>
                                <span className="mt-2 w-8 h-8 border border-solid border-gray-600 rounded-full flex-center transition-opacity opacity-50 hover:opacity-60">
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                        />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div className="leading-relaxed text-justify pl-16 mincho" style={{ fontSize: "24px" }}>
                            <Editor editorState={editorState} onChange={setEditorState} />
                        </div>
                    </div>
                </div>
            </Scrollbar>
            <div className={"fixed bottom-0 w-12 mb-4 editor-bg border border-r-0 border-solid border-gray-300 rounded-l-lg novelView-header__show"}>
                <div className="flex-col flex-center w-full my-3">
                    <svg
                        className="w-full h-8 transition opacity-50 hover:opacity-70 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <svg
                        className="w-full h-8 transition opacity-50 hover:opacity-70 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    <svg
                        className="w-full h-8 transition opacity-50 hover:opacity-70 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
