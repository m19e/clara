import Link from "next/link";
import R18Label from "./atoms/R18Label";
import { INovelProp } from "../lib/firebase/initFirebase";

type TagsProps = {
    novel: INovelProp;
};

const ListTags = ({ novel }: TagsProps) => {
    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;

    return (
        <>
            {r18 && <R18Label className="mr-1.5 -mt-1" />}
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
