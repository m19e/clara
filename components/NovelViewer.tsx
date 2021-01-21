import { useRouter } from "next/router";
import { useState, useRef, useCallback, useEffect } from "react";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import NovelViewerConfig from "./NovelViewerConfig";
import { INovelDataSerializable } from "../lib/firebase/initFirebase";

type FontSizeState = "base" | "xl" | "2xl";

const useFontSize = (fs: FontSizeState): [FontSizeState, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const setFontBase = useCallback(() => {
        setFontSize("base");
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("xl");
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("2xl");
    }, []);

    return [fontSize, setFontBase, setFontXl, setFont2xl];
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

export default function NovelView({ novel }: { novel: INovelDataSerializable }) {
    const contentArray = novel.content.split("\n").map((line) => (line === "" ? { text: "　", class: "h-0 overflow-hidden" } : { text: line, class: "" }));
    const ps = useRef<HTMLElement>();
    const [fontSize, setFontBase, setFontXl, setFont2xl] = useFontSize("xl");
    const [font, setMincho, setGothic] = useFont("mincho");
    const [show, setShow] = useState(true);
    const [display, setDisplay] = useState(false);
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
        if (ps.current) {
            ps.current.scrollLeft += ps.current.scrollWidth;
            setDisplay(true);
        }
    }, []);

    const onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            setShow(e.deltaY < 0);
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    return (
        <div className="w-full h-screen flex-center editor-bg">
            <Scrollbar containerRef={(ref) => (ps.current = ref)} onWheel={onMouseWheel} className={"w-full h-full" + (display ? "" : " opacity-0")}>
                <div className="h-full flex justify-end items-center">
                    <div className="writing-v-rl" style={{ height: "75vh", minHeight: `${1.5 * 20}rem` }}>
                        <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                            <p className="text-sm pt-1 opacity-50">{novel.created_at}</p>
                            <p className="text-4xl font-bold opacity-75">{novel.title}</p>
                            <p className="text-xl font-semibold pt-1 opacity-50">{novel.author_name}</p>
                        </div>
                        <div className={"leading-relaxed text-justify pl-16 text-" + fontSize + " " + font}>
                            {contentArray.map((line, i) => (
                                <div key={"novelview-line-" + (i + 1)} className={line.class}>
                                    <span>{line.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Scrollbar>
            <div
                className={
                    "fixed bottom-0 w-12 mb-4 editor-bg border border-r-0 border-solid border-gray-300 rounded-l-lg novelView-header" +
                    (show ? " novelView-header__show" : "")
                }
            >
                <div className="flex-col flex-center w-full my-3">
                    {/* <svg
                        className="w-full h-8 transition opacity-50 hover:opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg> */}
                    <NovelViewerConfig viewerConfig={viewerConfig} />
                    {/* <svg
                        className="w-full h-8 mt-2 transition opacity-50 hover:opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg> */}
                    <a
                        href={
                            "https://twitter.com/intent/tweet?text=" +
                            encodeURIComponent(novel.title + " | " + novel.author_name) +
                            "&url=" +
                            "http://localhost:3000" +
                            router.asPath
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            className="w-full h-6 mt-2 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="#55acee"
                            // viewBox="0 0 24 24"
                            viewBox="0 0 350 300"
                            stroke="#55acee"
                        >
                            {/* <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        /> */}
                            <path d="M350.001,35.509 C346.026,42.167 340.649,49.197 333.870,56.595 C328.493,62.513 321.944,68.556 314.231,74.720 C314.231,74.720 314.231,76.940 314.231,76.940 C314.231,76.940 314.231,79.530 314.231,79.530 C314.231,80.762 314.346,81.626 314.579,82.119 C314.579,82.119 314.579,84.708 314.579,84.708 C314.579,110.109 310.022,135.572 300.903,161.097 C291.785,186.620 278.809,209.494 261.975,229.715 C243.971,251.417 222.113,268.556 196.394,281.134 C170.674,293.711 141.917,299.999 110.122,299.999 C89.546,299.999 70.142,297.041 51.904,291.122 C33.201,285.202 15.899,276.818 -0.001,265.967 C0.936,266.214 2.337,266.338 4.208,266.338 C7.948,266.831 10.755,267.077 12.626,267.077 C12.626,267.077 17.183,267.077 17.183,267.077 C33.550,267.077 49.567,264.242 65.231,258.569 C79.727,253.144 93.403,245.253 106.263,234.895 C91.300,234.649 77.387,229.469 64.531,219.357 C51.904,209.494 43.486,197.040 39.279,181.997 C42.786,182.737 45.007,183.105 45.943,183.105 C45.943,183.105 49.447,183.105 49.447,183.105 C50.151,183.352 51.202,183.476 52.605,183.476 C54.708,183.476 56.346,183.352 57.516,183.105 C59.853,183.105 63.128,182.612 67.335,181.626 C67.801,181.626 68.505,181.502 69.439,181.256 C70.376,181.009 71.075,180.887 71.542,180.887 C54.941,177.434 41.265,168.679 30.509,154.622 C19.520,140.565 14.029,124.536 14.029,106.534 C14.029,106.534 14.029,106.163 14.029,106.163 C14.029,106.163 14.029,105.794 14.029,105.794 C14.029,105.794 14.029,105.424 14.029,105.424 C18.471,108.383 23.615,110.603 29.460,112.082 C35.538,114.054 41.265,115.042 46.644,115.042 C36.354,107.644 28.640,98.642 23.497,88.038 C17.651,77.187 14.729,65.102 14.729,51.786 C14.729,44.388 15.546,37.729 17.183,31.810 C18.120,27.617 20.457,21.576 24.198,13.685 C42.435,37.358 64.177,55.854 89.429,69.172 C115.382,83.475 142.969,91.366 172.195,92.847 C171.494,87.667 171.145,84.832 171.145,84.339 C170.674,80.886 170.441,78.051 170.441,75.830 C170.441,54.868 177.456,36.989 191.483,22.193 C205.512,7.396 222.462,-0.002 242.337,-0.002 C252.623,-0.002 262.325,2.094 271.444,6.286 C280.562,10.971 288.394,16.891 294.942,24.042 C302.423,22.315 310.372,19.850 318.788,16.644 C325.803,13.931 333.051,10.232 340.532,5.547 C337.729,14.424 333.634,22.439 328.260,29.591 C322.179,36.989 315.751,42.907 308.969,47.347 C315.984,46.113 322.999,44.634 330.010,42.907 C335.388,41.428 342.052,38.961 350.001,35.509 Z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
