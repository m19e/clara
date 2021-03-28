import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { INovelProp } from "types";
import { getNovelsByIDs, getRootNovelIDs, PER_PAGE } from "lib/firebase/novel";
import TopPage from "components/templates/Top";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    currentPage: number;
};

const Top = ({ novels = [], pageCount, currentPage }: Props) => <TopPage novels={novels} pageCount={pageCount} currentPage={currentPage} />;

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const { page } = params;
    if (typeof page !== "string" || page === "") {
        return { notFound: true, props: {} };
    }
    const currentPage = parseInt(page, 10);
    const novelIDs = await getRootNovelIDs();
    const pageCount = Math.ceil(novelIDs.length / PER_PAGE);
    if (currentPage < 1 || (currentPage - 1) * PER_PAGE > novelIDs.length) {
        return { notFound: true, props: {} };
    }
    const novels = await getNovelsByIDs(novelIDs.slice((currentPage - 1) * PER_PAGE, currentPage * PER_PAGE));

    return {
        props: {
            novels,
            pageCount,
            currentPage,
        },
    };
};

export default Top;
