import { useIsMincho, useFontSize, useLineWords, useIsDisabled } from "../store/editor";

export default function Footer() {
    const [isMincho, toggleFont] = useIsMincho();
    const [fontSize, incFontSize, decFontSize] = useFontSize();
    const [lineWords, incLineWords, decLineWords] = useLineWords();
    const [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW] = useIsDisabled();

    return (
        <div className="fixed bottom-0 w-full elevation4 editor-bg transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100">
            <div className={"flex-center" + (isMincho ? " mincho" : " gothic")} style={{ minHeight: "120px" }}>
                <div className="w-24 h-24 m-2 flex-center">
                    <div className="group flex flex-col">
                        <span className="h-6"></span>
                        <span className="w-full text-center">{isMincho ? "明朝体" : "ゴシック体"}</span>
                        <button
                            onClick={() => toggleFont()}
                            className={"transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100" + (!isMincho ? " mincho" : " gothic")}
                        >
                            {!isMincho ? "明朝体" : "ゴシック体"}
                        </button>
                    </div>
                </div>
                <div className="w-24 h-24 m-2 flex-center">
                    <div className="flex flex-col">
                        <button onClick={() => incFontSize()} disabled={isDisabledIncFS}>
                            <span className="w-full flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                    <polyline
                                        fill="none"
                                        stroke="#2A2E3B"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        points="7.328 1.672 7.328 7.328 1.672 7.328"
                                        transform="rotate(-135 9.157 7.258)"
                                    />
                                </svg>
                            </span>
                        </button>
                        <p>大きさ {fontSize}</p>
                        <button onClick={() => decFontSize()} disabled={isDisabledDecFS}>
                            <span className="w-full flex-center">
                                <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m8.5.5-4 4-4-4"
                                        fill="none"
                                        stroke="#2a2e3b"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        transform="translate(6 8)"
                                    />
                                </svg>
                            </span>
                        </button>
                    </div>
                </div>
                <div className="w-24 h-24 m-2 flex-center">
                    <div className="flex flex-col">
                        <button onClick={() => incLineWords()} disabled={isDisabledIncLW}>
                            <span className="w-full flex-center">
                                <svg xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21">
                                    <polyline
                                        fill="none"
                                        stroke="#2A2E3B"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        points="7.328 1.672 7.328 7.328 1.672 7.328"
                                        transform="rotate(-135 9.157 7.258)"
                                    />
                                </svg>
                            </span>
                        </button>
                        <p>字数 {lineWords}</p>
                        <button onClick={() => decLineWords()} disabled={isDisabledDecLW}>
                            <span className="w-full flex-center">
                                <svg height="21" viewBox="0 0 21 21" width="21" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="m8.5.5-4 4-4-4"
                                        fill="none"
                                        stroke="#2a2e3b"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
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
