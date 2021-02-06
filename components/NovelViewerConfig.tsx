import { useState } from "react";
import Tooltip from "./Tooltip";

type FontSizeState = "base" | "xl" | "2xl";

type ViewerConfigProps = {
    fontSize: FontSizeState;
    toggleFontSmall: () => void;
    toggleFontMedium: () => void;
    toggleFontLarge: () => void;
    font: "mincho" | "gothic" | "mobile-serif" | "mobile-sans";
    setMincho: () => void;
    setGothic: () => void;
    isMobile: boolean;
};

export default function NovelViewConfig({ viewerConfig }: { viewerConfig: ViewerConfigProps }) {
    const [showModal, setShowModal] = useState(false);
    const { fontSize, toggleFontSmall, toggleFontMedium, toggleFontLarge, font, setMincho, setGothic, isMobile } = viewerConfig;

    return (
        <>
            <div onClick={() => setShowModal(true)}>
                <Tooltip
                    text="書式設定"
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
            </div>
            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div
                                className="writing-v-rl gothic border-0 rounded shadow-lg relative flex flex-col w-full p-6 bg-white outline-none focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-start">
                                    <span className="text-xl text-gray-800">書式設定</span>
                                </div>
                                <div className="mr-4">
                                    <span className="text-gray-800">文字の大きさ</span>
                                    <div className={"h-56 w-10 border border-solid rounded flex-center justify-around" + " " + font}>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center cursor-pointer" +
                                                (fontSize === "base" ? " text-white bg-gray-400 rounded-t" : "")
                                            }
                                            onClick={() => toggleFontSmall()}
                                        >
                                            <span className="text-base">小</span>
                                        </div>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center border-t cursor-pointer" + (fontSize === "xl" ? " text-white bg-gray-400" : "")
                                            }
                                            onClick={() => toggleFontMedium()}
                                        >
                                            <span className="text-xl">中</span>
                                        </div>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (fontSize === "2xl" ? " text-white bg-gray-400 rounded-b" : "")
                                            }
                                            onClick={() => toggleFontLarge()}
                                        >
                                            <span className="text-2xl">大</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2">
                                    <span className="text-gray-800">書体</span>
                                    <div className="h-56 w-10 text-lg border border-solid rounded flex-center justify-around">
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center cursor-pointer" +
                                                (font === "mincho" || font === "mobile-serif" ? " text-white bg-gray-400 rounded-t" : "")
                                            }
                                            onClick={() => setMincho()}
                                        >
                                            <span className={isMobile ? "mobile-serif" : "mincho"}>明朝</span>
                                        </div>
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (font === "gothic" || font === "mobile-sans" ? " text-white bg-gray-400 rounded-b" : "")
                                            }
                                            onClick={() => setGothic()}
                                        >
                                            <span className={isMobile ? "mobile-sans" : "gothic"}>ゴシック</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end mr-6">
                                    <span
                                        className="py-2 text-lg text-gray-600 text-center border-r border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                        onClick={() => setShowModal(false)}
                                    >
                                        完了
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
}
