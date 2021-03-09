import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getNovelsByIDs, getRootNovelIDs, PER_PAGE } from "../../../lib/firebase/novel";
import TopPage from "../../../components/templates/Top";
import { INovelProp } from "../../../types";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage: number;
};

const Top = ({ novels = [], pageCount, initialPage }: Props) => <TopPage novels={novels} pageCount={pageCount} initialPage={initialPage} />;

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const { page } = params;
    if (typeof page !== "string" || page === "") {
        return { notFound: true, props: {} };
    }
    const pageNum = parseInt(page, 10) - 1;
    const novelIDs = await getRootNovelIDs();
    const pageCount = Math.ceil(novelIDs.length / PER_PAGE);
    if (pageNum < 0 || pageNum * PER_PAGE > novelIDs.length) {
        return { notFound: true, props: {} };
    }
    const novels = await getNovelsByIDs(novelIDs.slice(pageNum * PER_PAGE, (pageNum + 1) * PER_PAGE));

    return {
        props: {
            novels,
            pageCount,
            initialPage: pageNum,
        },
    };
};

export default Top;
