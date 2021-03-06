import Link from "next/link";

type TagsProps = {
    tags: string[];
};

const NovelTags = ({ tags }: TagsProps) => (
    <>
        {tags.map((tag, i) => (
            <Link href={`/tag/${encodeURIComponent(tag)}`}>
                <a key={`novel-tags-0${i}`} className="text-gray-600 hover:text-blue-400 text-sm leading-none border-gray-300 pb-2 mb-2 ml-1.5 border-b">
                    {tag}
                </a>
            </Link>
        ))}
    </>
);

export default NovelTags;
