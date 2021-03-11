import { useRouter } from "next/router";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Scrollbar from "react-perfect-scrollbar";
import "react-perfect-scrollbar/dist/css/styles.css";
import { INovelDataSerializable } from "types";
import { auth } from "lib/firebase/initFirebase";
import { useFont, useFontSize } from "hooks/novel";
import Header from "foundations/ClaraHeader";
import TagList from "components/molecules/TagList/Vertical";
import Tooltip from "components/molecules/Tooltip";
import Config from "components/molecules/Modal/NovelConfig";
import ShareNovelButton from "components/atoms/Button/ShareNovel";
import TopLink from "components/atoms/Button/TopLink";

const getOgpImagePath = (title: string, author: string) => {
    const query = `title=${encodeURIComponent(title)}&author=${author}`;
    return `/api/novel?${query}`;
};

const markPairs = [
    { target: "！？", replace: "⁉" },
    { target: "？！", replace: "⁈" },
    { target: "！！", replace: "‼" },
    { target: "？？", replace: "⁇" },
    { target: "!?", replace: "⁉" },
    { target: "?!", replace: "⁈" },
    { target: "!!", replace: "‼" },
    { target: "??", replace: "⁇" },
];

const getReplacedText = (text: string): string => {
    let result = text;
    for (const pair of markPairs) {
        if (result.includes(pair.target)) result = result.split(pair.target).join(pair.replace);
    }
    return result;
};

const Novel = ({ novel, isMobile }: { novel: INovelDataSerializable; isMobile: boolean }) => {
    const contentArray = getReplacedText(novel.content)
        .split("\n")
        .map((line) => (line === "" ? { text: "　", class: "h-0 overflow-hidden" } : { text: line, class: "" }));
    const ps = useRef<HTMLElement>();
    const [fontSize, setFontBase, setFontXl, setFont2xl] = useFontSize("text-xl");
    const [font, setMincho, setGothic] = useFont(isMobile);
    const [show, setShow] = useState(false);
    const [display, setDisplay] = useState(false);
    const [isAuthor, setIsAuthor] = useState(false);
    const viewerConfig = {
        fontSize,
        setFontBase,
        setFontXl,
        setFont2xl,
        font,
        setMincho,
        setGothic,
        isMobile,
    };
    const router = useRouter();

    const imagePath = getOgpImagePath(novel.title, novel.author_id);
    const desc = Array.from(novel.content.split("\n").join("")).slice(0, 100).join("");

    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;

    useEffect(() => {
        if (ps.current) {
            ps.current.scrollLeft += ps.current.scrollWidth;
            setDisplay(true);
        }

        auth.onAuthStateChanged((user) => {
            if (user && user.uid === novel.author_uid) {
                setIsAuthor(true);
            }
            setShow(true);
        });
    }, []);

    const onMouseWheel = (e: React.WheelEvent<HTMLElement>) => {
        if (ps.current) {
            setShow(e.deltaY < 0);
            ps.current.scrollLeft -= e.deltaY;
        }
    };

    return (
        <>
            <Header
                title={`${r18 ? "[R18]" : ""} ${novel.title} - ${novel.author_name} | Clara`}
                description={r18 ? "" : desc}
                ogTitle={`${r18 ? "[R18]" : ""} ${novel.title} - ${novel.author_name} | Clara`}
                ogDescription={r18 ? "" : desc}
                ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + imagePath}
                twTitle={`${r18 ? "[R18]" : ""} ${novel.title}`}
                twDescription={r18 ? "" : desc}
                twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + imagePath}
                twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL + router.asPath}
                twCard="summary_large_image"
            />
            <div className="w-full h-screen flex justify-end editor-bg">
                <Scrollbar containerRef={(ref) => (ps.current = ref)} onWheel={onMouseWheel} className={display ? "" : " opacity-0"}>
                    <div className="h-full flex items-center">
                        <div className="writing-v-rl" style={{ height: "75vh", minHeight: `${1.5 * 20}rem` }}>
                            <div className="h-full p-16 mx-16 gothic border-solid border-t border-b border-gray-300">
                                <div className="flex flex-col">
                                    <span className="text-sm pt-0.5 text-gray-400">{novel.created_at}</span>
                                    <span className="text-4xl font-bold whitespace-pre-wrap mx-0.5 text-gray-800">{novel.title}</span>
                                    <div className="pt-0.5">
                                        <Link href={`/user/${novel.author_id}`}>
                                            <a className="pr-1.5 border-r border-gray-400 border-opacity-0 hover:border-opacity-100">
                                                <span className="text-xl font-semibold text-gray-600">{novel.author_name}</span>
                                            </a>
                                        </Link>
                                    </div>
                                    <div className={"flex items-center flex-wrap" + (tags.length === 0 && !r18 ? "" : " mr-4")}>
                                        <TagList novel={novel} />
                                    </div>
                                </div>
                            </div>
                            <div className={"leading-relaxed text-justify pl-16 " + fontSize + " " + font}>
                                {contentArray.map((line, i) => (
                                    <div key={i} className={line.class}>
                                        <span>{line.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </Scrollbar>
                <div className={"fixed bottom-0 w-12 mb-4 mr-2 novelView-header" + (show ? " novelView-header__show" : "")}>
                    <div className="flex-col flex-center w-full">
                        {isAuthor && (
                            <Link href={`/novel/${novel.id}/edit`}>
                                <a>
                                    <Tooltip text="小説を編集">
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
                                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                            />
                                        </svg>
                                    </Tooltip>
                                </a>
                            </Link>
                        )}
                        <Config viewerConfig={viewerConfig} />
                        <ShareNovelButton
                            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                `${r18 ? "[R18]" : ""} ${novel.title} - ${novel.author_name} #claranovel`
                            )}&url=${process.env.NEXT_PUBLIC_SITE_ROOT_URL + router.asPath}`}
                        />
                        <TopLink />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Novel;
