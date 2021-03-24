import { INovelProp } from "types";
import NovelListItem from "components/molecules/NovelListItem";
import Pagination from "components/atoms/Pagination";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage: number;
};

const NovelList = ({ novels, pageCount, initialPage }: Props) => (
    <div className="w-11/12 flex-center flex-col editor-bg rounded">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 p-16 pb-0">
            {novels.map((novel, i) => (
                <NovelListItem key={i} novel={novel} className="w-full flex flex-col justify-end border-b border-solid border-gray-300" />
            ))}
        </div>
        <div className="w-full flex-center my-8 editor-bg">
            <Pagination pageCount={pageCount} initialPage={initialPage} />
        </div>
    </div>
);

export default NovelList;
