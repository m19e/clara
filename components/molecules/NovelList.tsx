import { INovelProp } from "types";
import NovelListItem from "components/molecules/NovelListItem";
import Pagination from "components/atoms/Pagination";
import Linked from "components/molecules/LinkPagination";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage: number;
};

const NovelList = ({ novels, pageCount, initialPage }: Props) => (
    <div className="w-11/12 pt-12 xl:px-12 flex-center flex-col editor-bg rounded">
        <div className="w-3/4 xl:w-full grid grid-cols-1 xl:grid-cols-2 gap-12">
            {novels.map((novel, i) => (
                <NovelListItem key={i} novel={novel} className="flex flex-col justify-end border-b border-solid border-gray-300" />
            ))}
        </div>
        <div className="w-full flex-center my-8 editor-bg">
            <Linked currentPage={initialPage + 1} pageCount={pageCount} />
        </div>
    </div>
);

export default NovelList;
