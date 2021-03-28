import { GetServerSideProps } from "next";
import { INovelProp } from "types";
import { getNovelsByIDs, getRootNovelIDs, PER_PAGE } from "lib/firebase/novel";
import TopPage from "components/templates/Top";

const TopIndex = ({ novels, pageCount }: { novels: INovelProp[]; pageCount: number }) => <TopPage novels={novels} pageCount={pageCount} currentPage={1} />;

export const getServerSideProps: GetServerSideProps = async () => {
    const novelIDs = await getRootNovelIDs();
    const novels = await getNovelsByIDs(novelIDs.slice(0, PER_PAGE));
    const pageCount = Math.ceil(novelIDs.length / PER_PAGE);

    return {
        props: {
            novels,
            pageCount,
        },
    };
};

export default TopIndex;
