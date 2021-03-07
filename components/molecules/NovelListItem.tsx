import Link from "next/link";
import TagList from "../molecules/TagList/Horizontal";
import { INovelProp } from "../../lib/firebase/initFirebase";
import { getTextCharCount } from "../../lib/novel/tools";

type Props = {
    novel: INovelProp;
    className: string;
};

const NovelListItem = ({ novel, className }: Props) => (
    <div key={novel.id} className={className}>
        <div className="mb-3">
            <Link href={`/novel/${novel.id}`}>
                <a className="text-2xl gothic font-semibold whitespace-pre-wrap opacity-75">{novel.title}</a>
            </Link>
        </div>
        <div className="whitespace-pre-wrap ml-0.5 pb-3">
            <TagList novel={novel} />
        </div>
        <div className="flex justify-between items-baseline">
            <Link href={`/user/${novel.author_id}`}>
                <a className="gothic opacity-75">{novel.author_name}</a>
            </Link>
            <span className="text-sm opacity-50">{getTextCharCount(novel.content)}字</span>
        </div>
    </div>
);

export default NovelListItem;
