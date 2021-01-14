import { useState, useRef, useCallback } from "react";
import { Editor, EditorState, ContentState } from "draft-js";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";

import NovelViewerConfig from "../../components/NovelViewerConfig";

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

export default function NovelView() {
    const [editorState] = useState(
        EditorState.createWithContent(
            ContentState.createFromText(
                `　なにかの音がして私がうすく目を開けると、ブラインド越しの窓からは燦々と朝陽が差し込んでいた。靄がかった頭で上体を起こす。枕元から電子音。震えるスマホを持ち上げて一気に意識がする……なんて事は流石にありえないけれど。積み重なる通知やユニットメンバーの名前を見て、徐々に、徐々に焦燥感がこみ上げてくる。ベッドの脇に座っていたカトレアがわふっと鳴いて、二言三言メッセージを送信し、私はようやく寝床から出るのだった。

　ランニングウェアに着替え、街を駆ける。前へ前へと足を進めるうちに血が巡り、身体が温まっていく。真冬の朝の突き刺すような冷気。規則的に視界を覆う白い息。私と一緒に丘を登るゆるやかな風。すべてが心地よく、爽快だった。
                
　丘を越えると、正面に踏切が見えてくる。いつだったか、智代子と一緒に歩いたわね。今は静かなそれを軽やかに横切り、駅の脇を抜けて誰もいない交差点を渡る。歩行者信号はすべて青で、幸運な事もあるものだと思う。
                
　時計を見ると八時を少し過ぎた頃。寝坊してしまった分を取り戻すわけではないけれど、ほんの少しだけペースを上げる。青々とした並木道を勢いよく走り抜ける。誰もいない歩道。急に飛び出す車や人に注意を払いながら、そのままの速度を維持して坂へ向かう。坂を上がっていくと公園があって、さらにその上には美味しいパン屋さんがある。樹里たちが買ってきてくれるのを何度かいただいた事があるけれど、ふかふかで、もちもちで、いくらでも食べられそうだった。
                
　坂を登りはじめてすぐ。視界が開けて、この街の色々なものが私の目に飛び込んでくる。廃校をリノベーションした合宿所。海の家。真っ白な砂浜。商店街。丸い月の浮かぶ展望台。そのどれもが、私たちの中にある大切な思い出。
                
　あまり余所見をしていては危ない。美しい景色を横目に、坂を駆け登る。左へ曲がるカーブが見えてきて、右手には公園への入口が。この公園はかなり広い事もあって、ランニングコースのひとつに含まれていた。公園に入ってしばらく走る。
                
　コースの半分ほど走った頃。みんなでヒーローごっこをしたあの遊具が現れて、その向こうに、見慣れた背中。私は、その背中に、その人に向かって、名前を呼ぶ。
「果穂」
「夏葉さん」
　私は名前を呼ばれ、夢から醒めた。


「なんですか、夏葉さん」
　果穂が私の名前を呼ぶ。果穂は私の腕にぎゅうと抱かれ、苦笑しながら言う。
「あたしはここにいますよ」
　まだ小学生の果穂の背中や事務所近くの町並み。随分と昔の夢を見ていたらしい。
「今、何時……？」
　とっくのとうに朝だった。ブラインドから差し込む光を見るに、恐らくいつもならランニングをしている時間だろう。
「八時をちょっと過ぎましたね」
「……そう、そうなのね」
　こういうのも正夢というのだろうか。寝坊する夢を見て、寝坊してしまった。広がったふわふわの髪を、かき集めて腕に抱く。果穂の頭を引きよせる。
「いいんですか、起きなくて」
　腕の中の果穂が私を見上げて言う。少し困ったように、目を細めて笑う。あたたかい瞳。やさしい熱。
「いいの、果穂がいるもの」
「なんですか、それ」
　ふたりで心底楽しそうに、おかしそうに笑う。
「こうしていたいの。だめ？」
「ううん、嬉しい」
　私の背中に果穂の腕が回される。あたたかい。日光と果穂にあたためられ、私の輪郭がぼやけていく。
「おやすみ、果穂」
「おやすみなさい、夏葉さん」
　どうか、夢でもあなたに会えますように。
                `
            )
        )
    );
    const ps = useRef<HTMLElement>();
    const [fontSize, setFontBase, setFontXl, setFont2xl] = useFontSize("xl");
    const [font, setMincho, setGothic] = useFont("mincho");
    const [show, setShow] = useState(true);

    const onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            setShow(e.deltaY < 0);
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    return (
        <div className="w-full h-screen flex-center editor-bg">
            <Scrollbar containerRef={(ref) => (ps.current = ref)} onWheel={onMouseWheel} className="pb-4 max-h-full flex items-center">
                <div className="writing-v-rl max-h-full px-4" style={{ height: "665px", maxHeight: "85vh", minHeight: `${1.5 * 20}rem` }}>
                    <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                        <p className="text-4xl font-bold opacity-75">作品タイトル</p>
                        <p className="text-xl font-semibold opacity-50">作者名</p>
                    </div>
                    <div className={"leading-relaxed text-justify text-" + fontSize + " " + font}>
                        <Editor editorState={editorState} onChange={(_) => null} readOnly={true} />
                    </div>
                </div>
            </Scrollbar>
            <div
                className={
                    "fixed bottom-0 w-12 mb-4 editor-bg border border-r-0 border-solid border-gray-300 novelView-header" +
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
                    <NovelViewerConfig
                        fontSize={fontSize}
                        toggleFontSmall={setFontBase}
                        toggleFontMedium={setFontXl}
                        toggleFontLarge={setFont2xl}
                        font={font}
                        setMincho={setMincho}
                        setGothic={setGothic}
                    />
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
                </div>
            </div>
        </div>
    );
}
