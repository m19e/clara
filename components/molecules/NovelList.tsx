import { INovelProp } from "types";
import NovelListItem from "components/molecules/NovelListItem";
import Pagination from "components/atoms/Pagination";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage: number;
};

const NovelList = ({ novels, pageCount, initialPage }: Props) => (
    <div className="w-11/12 flex justify-center flex-wrap items-end editor-bg rounded">
        {novels.map((novel, i) => (
            <NovelListItem key={i} novel={novel} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300" />
        ))}
        <div className="w-3/4 xl:max-w-lg xl:mx-8 2xl:max-w-xl"></div>
        <div className="w-full flex-center my-8 editor-bg">
            <Pagination pageCount={pageCount} initialPage={initialPage} />
        </div>
    </div>
);

export default NovelList;
