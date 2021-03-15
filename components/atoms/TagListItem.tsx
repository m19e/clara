import Link from "next/link";

type Props = {
    tag: string;
    className: string;
};

const TagListItem = ({ tag, className }: Props) => (
    <Link href={`/tag/${encodeURIComponent(tag)}`}>
        <a className={"text-gray-600 hover:text-blue-400 text-sm leading-none border-gray-300 " + className}>{tag}</a>
    </Link>
);

export default TagListItem;
