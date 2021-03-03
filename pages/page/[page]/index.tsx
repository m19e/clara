import Error from "next/error";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getNovelsByIDs, getRootNovelIDs } from "../../../lib/firebase/novel";
import TopPage from "../../../components/top/Page";
import { INovelProp } from "../../../lib/firebase/initFirebase";

const PER_PAGE = 10;

type Props = {
    novels: INovelProp[];
    page: number;
    pageCount: number;
    initialPage: number;
};

const Top = ({ novels = [], page = 0, pageCount, initialPage }: Props) => {
    if (page === 0) return <Error statusCode={404} />;
    return <TopPage novels={novels} pageCount={pageCount} initialPage={initialPage} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const { page } = params;
    if (typeof page !== "string" || page === "") {
        return { props: {} };
    }
    const pageNum = parseInt(page, 10) - 1;
    const novelIDs = await getRootNovelIDs();
    const pageCount = Math.ceil(novelIDs.length / PER_PAGE);
    if (pageNum < 0 || pageNum * PER_PAGE > novelIDs.length) {
        return { props: {} };
    }
    const novels = await getNovelsByIDs(novelIDs.slice(pageNum * PER_PAGE, (pageNum + 1) * PER_PAGE));

    return {
        props: {
            novels,
            page: pageNum + 1,
            pageCount,
            initialPage: pageNum,
        },
    };
};

export default Top;
