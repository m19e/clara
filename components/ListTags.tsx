import Link from "next/link";
import { INovelProp } from "../lib/firebase/initFirebase";

type TagsProps = {
    novel: INovelProp;
};

const ListTags = ({ novel }: TagsProps) => {
    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;

    return (
        <>
            {r18 && (
                <span className="text-sm font-semibold text-red-500 mr-1.5 -mt-1" style={{ fontFamily: "sans-serif" }}>
                    <span className="tracking-tighter">R18</span>
                </span>
            )}
            {tags.map((tag, i) => (
                <Link href={`/tag/${encodeURIComponent(tag)}`}>
                    <a key={`novel-tags-0${i}`} className="text-gray-600 hover:text-blue-400 text-sm leading-none border-gray-300 pr-2 mr-2 mb-1.5 border-r">
                        {tag}
                    </a>
                </Link>
            ))}
        </>
    );
};

export default ListTags;
