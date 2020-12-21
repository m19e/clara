import { useIsMincho, useFontSize, useLineWords, useIsDisabled } from "../store/editor";

export default function Footer() {
    const [isMincho, toggleFont] = useIsMincho();
    const [fontSize, incFontSize, decFontSize] = useFontSize();
    const [lineWords, incLineWords, decLineWords] = useLineWords();
    const [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW] = useIsDisabled();

    return (
        <div className="fixed bottom-0 w-full">
            <div className="bg-gray-300 flex-center transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100" style={{ minHeight: "120px" }}>
                <div className="bg-white w-24 h-24 m-2 flex-center">
                    <div className="flex flex-col">
                        <p>span</p>
                        <div className="group">
                            <p className={isMincho ? "mincho" : "gothic"}>{isMincho ? "明朝体" : "ゴシック体"}</p>
                            <button
                                onClick={() => toggleFont()}
                                className={"transition-opacity duration-1000 ease-out opacity-0 group-hover:opacity-100" + (!isMincho ? " mincho" : " gothic")}
                            >
                                {!isMincho ? "明朝体" : "ゴシック体"}
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white w-24 h-24 m-2 flex-center">
                    <div className="flex flex-col">
                        <button onClick={() => incFontSize()} disabled={isDisabledIncFS}>
                            ↑
                        </button>
                        <p>fontsize:{fontSize}</p>
                        <button onClick={() => decFontSize()} disabled={isDisabledDecFS}>
                            ↓
                        </button>
                    </div>
                </div>
                <div className="bg-white w-24 h-24 m-2 flex-center">
                    <div className="flex flex-col">
                        <button onClick={() => incLineWords()} disabled={isDisabledIncLW}>
                            ↑
                        </button>
                        <p>linechars:{lineWords}</p>
                        <button onClick={() => decLineWords()} disabled={isDisabledDecLW}>
                            ↓
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
