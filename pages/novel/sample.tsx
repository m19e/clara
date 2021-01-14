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
                    "fixed bottom-0 w-12 h-44 mb-4 editor-bg border border-r-0 border-solid border-gray-300 novelView-header" +
                    (show ? " novelView-header__show" : "")
                }
            >
                <div className="flex-col flex-center w-full h-full">
                    <NovelViewerConfig fontSize={fontSize} toggleFontSmall={setFontBase} toggleFontMedium={setFontXl} toggleFontLarge={setFont2xl} />
                    <svg
                        className="w-full h-8 mt-2 transition opacity-50 hover:opacity-70"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                    <svg
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
                    </svg>
                    <svg
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
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
}
