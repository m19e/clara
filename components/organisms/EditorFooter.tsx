import { useEffect } from "react";
import { updateFormat } from "lib/firebase/initFirebase";
import { useIsMincho, useFontSize, useLineWords, useIsDisabled } from "store/editor";
import { useProfile } from "store/user";

type Props = {
    loading: boolean;
};

// TODO: Chevron mogule
const Footer = ({ loading }: Props) => {
    const [isMincho, toggleFont] = useIsMincho();
    const [fontSize, incFontSize, decFontSize] = useFontSize();
    const [lineWords, incLineWords, decLineWords] = useLineWords();
    const [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW] = useIsDisabled();
    const [userProfile] = useProfile();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (userProfile) {
                updateFormat(userProfile.uid, isMincho, fontSize, lineWords);
            }
        }, 10000);
        return () => clearTimeout(timer);
    }, [isMincho, fontSize, lineWords]);

    return (
        <div className="fixed bottom-0 w-full shadow-2xl editor-bg">
            <div className="flex-center" style={{ minHeight: "96px" }}>
                <div className="my-2 flex-center">
                    <div className="group flex flex-col">
                        <span className="h-6"></span>
                        {loading ? (
                            <div className="animate-pulse h-3 w-14 mt-1.5 mb-2 mx-0.5 bg-gray-300 rounded"></div>
                        ) : (
                            <span className="w-full text-center opacity-75">{isMincho ? "明朝" : "ゴシック"}</span>
                        )}
                        <button
                            onClick={() => toggleFont()}
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-75"
                        >
                            <span className="opacity-50 hover:opacity-100">{!isMincho ? "明朝" : "ゴシック"}</span>
                        </button>
                    </div>
                </div>
                <span className={"opacity-25 " + (isMincho && !loading ? "mr-3" : "mx-3")}>・</span>
                <div className="my-2 flex-center">
                    <div className="flex flex-col group">
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-75"
                            onClick={() => incFontSize()}
                            disabled={isDisabledIncFS}
                        >
                            <span className="w-full flex-center opacity-50 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#2A2E3B">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    />
                                </svg>
                            </span>
                        </button>
                        {loading ? (
                            <div className="animate-pulse h-3 w-14 mt-1.5 mb-2 mx-0.5  bg-gray-300 rounded"></div>
                        ) : (
                            <p className="opacity-75">大きさ {fontSize}</p>
                        )}
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-75"
                            onClick={() => decFontSize()}
                            disabled={isDisabledDecFS}
                        >
                            <span className="w-full flex-center opacity-50 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#2A2E3B">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
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
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-75"
                            onClick={() => incLineWords()}
                            disabled={isDisabledIncLW}
                        >
                            <span className="w-full flex-center opacity-50 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#2A2E3B">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                                    />
                                </svg>
                            </span>
                        </button>
                        {loading ? (
                            <div className="animate-pulse h-3 w-14 mt-1.5 mb-2 mx-0.5 bg-gray-300 rounded"></div>
                        ) : (
                            <p className="opacity-75">字数 {lineWords}</p>
                        )}
                        <button
                            className="outline-none focus:outline-none transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-75"
                            onClick={() => decLineWords()}
                            disabled={isDisabledDecLW}
                        >
                            <span className="w-full flex-center opacity-50 hover:opacity-100">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="#2A2E3B">
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;
