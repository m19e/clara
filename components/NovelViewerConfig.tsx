import { useState } from "react";
import Tooltip from "./Tooltip";

type FontSizeState = "base" | "xl" | "2xl";

type ViewerConfigProps = {
    fontSize: FontSizeState;
    toggleFontSmall: () => void;
    toggleFontMedium: () => void;
    toggleFontLarge: () => void;
    font: "mincho" | "gothic";
    setMincho: () => void;
    setGothic: () => void;
};

export default function NovelViewConfig({ viewerConfig }: { viewerConfig: ViewerConfigProps }) {
    const [showModal, setShowModal] = useState(false);
    const { fontSize, toggleFontSmall, toggleFontMedium, toggleFontLarge, font, setMincho, setGothic } = viewerConfig;

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
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div className="writing-v-rl border-0 rounded shadow-lg relative flex flex-col w-full p-6 bg-white outline-none focus:outline-none">
                                <div className="flex justify-start">
                                    <span className="gothic text-xl">書式設定</span>
                                </div>
                                <div className="mr-4">
                                    <span className="gothic">文字の大きさ</span>
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
                                    <span className="gothic">書体</span>
                                    <div className="h-56 w-10 text-lg border border-solid rounded flex-center justify-around">
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center cursor-pointer" +
                                                (font === "mincho" ? " text-white bg-gray-400 rounded-t" : "")
                                            }
                                            onClick={() => setMincho()}
                                        >
                                            <span className="mincho">明朝</span>
                                        </div>
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (font === "gothic" ? " text-white bg-gray-400 rounded-b" : "")
                                            }
                                            onClick={() => setGothic()}
                                        >
                                            <span className="gothic">ゴシック</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end opacity-80 mr-4">
                                    <span
                                        className="h-14 gothic text-lg font-semibold opacity-75 text-center border-l border-gray-400 cursor-pointer"
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
