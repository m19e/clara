import { useState } from "react";
import { FontSize, FontType } from "hooks/novel";
import Tooltip from "components/molecules/Tooltip";

type Props = {
    fontSize: FontSize;
    setFontBase: () => void;
    setFontXl: () => void;
    setFont2xl: () => void;
    font: FontType;
    setMincho: () => void;
    setGothic: () => void;
    isMobile?: boolean;
};

const NovelConfig = ({ viewerConfig }: { viewerConfig: Props }) => {
    const [showModal, setShowModal] = useState(false);
    const { fontSize, setFontBase, setFontXl, setFont2xl, font, setMincho, setGothic, isMobile } = viewerConfig;

    return (
        <>
            <div onClick={() => setShowModal(true)}>
                <Tooltip text="書式設定">
                    <svg
                        className="w-8 h-8 transition-opacity opacity-50 hover:opacity-70 cursor-pointer"
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
                </Tooltip>
            </div>
            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div
                                className={
                                    (isMobile ? "mobile-sans" : "gothic") +
                                    " writing-v-rl border-0 rounded shadow-lg relative flex flex-col w-full p-6 bg-white outline-none focus:outline-none"
                                }
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex justify-start">
                                    <span className="text-xl text-gray-800">書式設定</span>
                                </div>
                                <div className="mr-4">
                                    <span className="text-gray-800">文字の大きさ</span>
                                    <div className={"h-56 w-10 border border-solid rounded overflow-hidden flex-center justify-around" + " " + font}>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center cursor-pointer" + (fontSize === "text-base" ? " text-white bg-gray-400" : "")
                                            }
                                            onClick={() => setFontBase()}
                                        >
                                            <span className="text-base">小</span>
                                        </div>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (fontSize === "text-xl" ? " text-white bg-gray-400" : "")
                                            }
                                            onClick={() => setFontXl()}
                                        >
                                            <span className="text-xl">中</span>
                                        </div>
                                        <div
                                            className={
                                                "h-16 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (fontSize === "text-2xl" ? " text-white bg-gray-400" : "")
                                            }
                                            onClick={() => setFont2xl()}
                                        >
                                            <span className="text-2xl">大</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="pr-2">
                                    <span className="text-gray-800">書体</span>
                                    <div className="h-56 w-10 text-lg border border-solid rounded overflow-hidden flex-center justify-around">
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center cursor-pointer" +
                                                (font === "mincho" || font === "mobile-serif" ? " text-white bg-gray-400" : "")
                                            }
                                            onClick={() => setMincho()}
                                        >
                                            <span className={isMobile ? "mobile-serif" : "mincho"}>明朝</span>
                                        </div>
                                        <div
                                            className={
                                                "h-28 w-10 flex-grow flex-center border-t cursor-pointer" +
                                                (font === "gothic" || font === "mobile-sans" ? " text-white bg-gray-400" : "")
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
};

export default NovelConfig;
