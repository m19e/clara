import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { useIsMincho, useFontSize, useLineWords, useIsDisabled } from "../store/editor";
import { userProfileState } from "../store/user";
import { updateFormat } from "../lib/firebase/initFirebase";

export default function Footer() {
    const [isMincho, toggleFont] = useIsMincho();
    const [fontSize, incFontSize, decFontSize] = useFontSize();
    const [lineWords, incLineWords, decLineWords] = useLineWords();
    const [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW] = useIsDisabled();
    const userProfile = useRecoilValue(userProfileState);

    useEffect(() => {
        const timer = setTimeout(() => {
            updateFormat(userProfile.userID, isMincho, fontSize, lineWords);
            // console.log("update:", userProfile.userID, isMincho, fontSize, lineWords);
        }, 10000);
        return () => clearTimeout(timer);
    }, [isMincho, fontSize, lineWords]);

    return (
        <div className="fixed bottom-0 w-full elevation4 editor-bg">
            <div className="flex-center" style={{ minHeight: "80px" }}>
                <div className="my-2 flex-center">
                    <div className="group flex flex-col">
                        <span className="h-6"></span>
                        <span className="w-full text-center border-t border-b border-solid border-black border-opacity-20">
                            {isMincho ? "明朝体" : "ゴシック体"}
                        </span>
                        <button
                            onClick={() => toggleFont()}
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100"
                        >
                            <span className="opacity-50 hover:opacity-100">{!isMincho ? "明朝体" : "ゴシック体"}</span>
                        </button>
                    </div>
                </div>
                <span className="mx-3 opacity-25">・</span>
                <div className="my-2 flex-center">
                    <div className="flex flex-col group">
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100"
                            onClick={() => incFontSize()}
                            disabled={isDisabledIncFS}
                        >
                            <span className="w-full flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                    <polyline
                                        fill="none"
                                        stroke="#2A2E3B"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="7.328 1.672 7.328 7.328 1.672 7.328"
                                        transform="rotate(-135 9.157 7.258)"
                                    />
                                </svg>
                            </span>
                        </button>
                        <p className="border-t border-b border-solid border-black border-opacity-20">大きさ{fontSize}</p>
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100"
                            onClick={() => decFontSize()}
                            disabled={isDisabledDecFS}
                        >
                            <span className="w-full flex-center">
                                <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m8.5.5-4 4-4-4"
                                        fill="none"
                                        stroke="#2a2e3b"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        transform="translate(6 8)"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <span className="mx-3 opacity-25">・</span>
                <div className="my-2 flex-center">
                    <div className="flex flex-col group">
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100"
                            onClick={() => incLineWords()}
                            disabled={isDisabledIncLW}
                        >
                            <span className="w-full flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                    <polyline
                                        fill="none"
                                        stroke="#2A2E3B"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        points="7.328 1.672 7.328 7.328 1.672 7.328"
                                        transform="rotate(-135 9.157 7.258)"
                                    />
                                </svg>
                            </span>
                        </button>
                        <p className="border-t border-b border-solid border-black border-opacity-20">字数 {lineWords}</p>
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100"
                            onClick={() => decLineWords()}
                            disabled={isDisabledDecLW}
                        >
                            <span className="w-full flex-center">
                                <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m8.5.5-4 4-4-4"
                                        fill="none"
                                        stroke="#2a2e3b"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        transform="translate(6 8)"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
