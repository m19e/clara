import { INovelProp } from "types";
import NovelListItem from "components/molecules/NovelListItem";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage: number;
};

const NovelList = ({ novels, pageCount, initialPage }: Props) => (
    <div className="w-3/4 xl:w-full grid grid-cols-1 xl:grid-cols-2 gap-12">
        {novels.map((novel, i) => (
            <NovelListItem key={i} novel={novel} className="flex flex-col justify-end border-b border-solid border-gray-300" />
        ))}
    </div>
);

export default NovelList;
