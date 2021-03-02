import { GetServerSideProps } from "next";
import { getNovelsByIDs, getRootNovelIDs } from "../lib/firebase/novel";
import TopPage from "../components/top/Page";
import { INovelProp } from "../lib/firebase/initFirebase";

const PER_PAGE = 10;

const Top = ({ novels, pageCount }: { novels: INovelProp[]; pageCount: number }) => <TopPage novels={novels} pageCount={pageCount} />;

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

export default Top;
