import { useState } from "react";

type FontSizeState = "base" | "xl" | "2xl";

type ViewerConfigProps = {
    fontSize: FontSizeState;
    toggleFontSmall: () => void;
    toggleFontMedium: () => void;
    toggleFontLarge: () => void;
};

export default function NovelViewConfig({ fontSize, toggleFontSmall, toggleFontMedium, toggleFontLarge }: ViewerConfigProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <svg
                className="w-full h-8 transition opacity-50 hover:opacity-70"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => setShowModal(true)}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
            </svg>
            {showModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div className="writing-v-rl border-0 rounded-lg shadow-lg relative flex flex-col w-full p-6 bg-white outline-none focus:outline-none">
                                <div className="flex justify-start">
                                    <span className="gothic text-xl">書式設定</span>
                                </div>
                                <div className="pr-2">
                                    <span className="gothic">文字の大きさ</span>
                                    <div className="h-56 w-10 border border-solid rounded flex-center justify-around">
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
                                        <div className="h-28 w-10 flex-grow flex-center cursor-pointer">
                                            <span className="mincho">明朝</span>
                                        </div>
                                        <div className="h-28 w-10 flex-grow flex-center border-t cursor-pointer">
                                            <span className="gothic">ゴシック</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end pr-4">
                                    <span className="gothic text-lg cursor-pointer" onClick={() => setShowModal(false)}>
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
