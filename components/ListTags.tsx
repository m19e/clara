import { INovelDataSerializable } from "../lib/firebase/initFirebase";

type TagsProps = {
    novel: INovelDataSerializable;
};

const ListTags = ({ novel }: TagsProps) => {
    const tags = "tags" in novel ? novel.tags : [];

    return (
        <>
            <span className="text-sm font-semibold text-red-500 mr-1.5 -mt-1" style={{ fontFamily: "sans-serif" }}>
                <span className="tracking-tighter">R18</span>
            </span>
            {tags.map((tag) => (
                <span className="text-gray-600 text-sm leading-none border-gray-300 pr-2 mr-2 mb-1.5 border-r">{tag}</span>
            ))}
        </>
    );
};

export default ListTags;
