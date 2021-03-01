import Error from "next/error";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getNovelsByIDs, getRootNovelIDs } from "../../../lib/firebase/novel";
import TopPage from "../../../components/top/Page";
import { INovelProp } from "../../../lib/firebase/initFirebase";

const PER_PAGE = 10;

const Top = ({ page, novels }: { page: number; novels: INovelProp[] }) => {
    if (page === 0) return <Error statusCode={404} />;
    return <TopPage novels={novels} />;
};

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const { page } = params;
    if (typeof page !== "string" || page === "") {
        return {
            props: {
                page: 0,
                novels: [],
            },
        };
    }
    const pageNum = parseInt(page, 10) - 1;
    const novelIDs = await getRootNovelIDs();
    if (pageNum < 0 || pageNum * PER_PAGE > novelIDs.length) {
        return {
            props: {
                page: 0,
                novels: [],
            },
        };
    }
    const novels = await getNovelsByIDs(novelIDs.slice(pageNum * PER_PAGE, (pageNum + 1) * PER_PAGE));

    return {
        props: {
            page: pageNum + 1,
            novels,
        },
    };
};

export default Top;
