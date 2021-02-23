type TagsProps = {
    tags: string[];
};

const NovelTags = ({ tags }: TagsProps) => (
    <>
        {tags.map((tag) => (
            <span className="text-gray-600 text-sm leading-none border-gray-300 pb-2 mb-2 ml-1.5 border-b">{tag}</span>
        ))}
    </>
);

export default NovelTags;
