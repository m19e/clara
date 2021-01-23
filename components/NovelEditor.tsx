import { useRouter } from "next/router";
import { useState, useEffect, createRef, RefObject, useCallback } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import NovelViewerConfig from "./NovelViewerConfig";
import TitleEditModal from "./NovelTitleEditModal";
import ConfirmableModal from "./ConfirmableModal";
import { updateNovel, deleteNovel } from "../lib/firebase/initFirebase";

const useFontSize = (fs: "base" | "xl" | "2xl", rfs: 16 | 20 | 24): ["base" | "xl" | "2xl", 16 | 20 | 24, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const [realFontSize, setRealFontSize] = useState(rfs);
    const setFontBase = useCallback(() => {
        setFontSize("base");
        setRealFontSize(16);
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("xl");
        setRealFontSize(20);
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("2xl");
        setRealFontSize(24);
    }, []);

    return [fontSize, realFontSize, setFontBase, setFontXl, setFont2xl];
};

const useFont = (f: "mincho" | "gothic"): ["mincho" | "gothic", () => void, () => void] => {
    const [font, setFont] = useState(f);
    const setMincho = useCallback(() => {
        setFont("mincho");
    }, []);
    const setGothic = useCallback(() => {
        setFont("gothic");
    }, []);

    return [font, setMincho, setGothic];
};

export default function NovelEditor({ id, title, content }: { id: string; title: string; content: string }) {
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(content)));
    const editorRef: RefObject<HTMLDivElement> = createRef();
    const [editorHeight, setEditorHeight] = useState(480);
    const [rootTitle, setRootTitle] = useState(title);

    const [fontSize, realFontSize, setFontBase, setFontXl, setFont2xl] = useFontSize("xl", 20);
    const [font, setMincho, setGothic] = useFont("mincho");
    const viewerConfig = {
        fontSize,
        toggleFontSmall: setFontBase,
        toggleFontMedium: setFontXl,
        toggleFontLarge: setFont2xl,
        font,
        setMincho,
        setGothic,
    };

    const router = useRouter();

    useEffect(() => {
        const resizeObs = new ResizeObserver((entries: ReadonlyArray<ResizeObserverEntry>) => {
            const height = entries[0].contentRect.height;
            const heightTQ = Math.floor(height * 0.75);
            setEditorHeight(heightTQ - (heightTQ % realFontSize));
        });
        editorRef.current && resizeObs.observe(editorRef.current);

        return () => {
            resizeObs.disconnect();
        };
    }, [realFontSize]);

    const confirmUpdate = async () => {
        const text = editorState.getCurrentContent().getPlainText();
        await updateNovel(id, rootTitle, text);
        router.push(`/novel/${id}`);
    };

    const confirmDelete = async () => {
        await deleteNovel(id);
        router.push("/");
    };

    return (
        <div ref={editorRef} className="w-full h-screen flex justify-end editor-bg">
            <Scrollbar>
                <div className="h-full flex items-center">
                    <div className="writing-v-rl" style={{ height: `${editorHeight}px`, maxHeight: "720px", minHeight: "480px" }}>
                        <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                            <div className="flex items-center flex-wrap">
                                <span className="text-4xl font-bold whitespace-pre-wrap opacity-75">{rootTitle}</span>
                                <span className="mt-2 w-8 h-8 border border-solid border-gray-300 rounded-full shadow flex-center cursor-pointer">
                                    <TitleEditModal title={rootTitle} setTitle={setRootTitle} />
                                </span>
                            </div>
                        </div>
                        <div className={"leading-relaxed text-justify pl-16 " + font + " text-" + fontSize}>
                            <Editor editorState={editorState} onChange={setEditorState} />
                        </div>
                    </div>
                </div>
            </Scrollbar>
            <div className={"fixed bottom-0 w-12 mb-4 editor-bg border border-r-0 border-solid border-gray-300 rounded-l-lg novelView-header__show"}>
                <div className="flex-col flex-center w-full my-2">
                    <ConfirmableModal
                        popperText="保存"
                        d="M5 13l4 4L19 7"
                        message="編集内容を保存しますか？"
                        confirmText="保存する"
                        cancelText="閉じる"
                        confirmFunc={confirmUpdate}
                    />
                    <ConfirmableModal
                        popperText="取消"
                        d="M6 18L18 6M6 6l12 12"
                        message="小説ページに戻りますか？"
                        confirmText="戻る"
                        cancelText="閉じる"
                        back
                        novelID={id}
                    />
                    <NovelViewerConfig viewerConfig={viewerConfig} />
                    <div className="mt-8">
                        <ConfirmableModal
                            popperText="削除"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            message="この小説を削除しますか？"
                            confirmText="削除する"
                            cancelText="閉じる"
                            confirmFunc={confirmDelete}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
