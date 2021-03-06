import { GetServerSideProps, GetServerSidePropsResult } from "next";
import { INovelProp } from "types";
import { getNovelsByIDs, getRootNovelIDs, PER_PAGE } from "lib/firebase/novel";
import TopPage from "components/templates/Top";

type Props = {
    novels: INovelProp[];
    pageCount: number;
};

const TopIndex = ({ novels, pageCount }: Props) => <TopPage novels={novels} pageCount={pageCount} currentPage={1} />;

export const getServerSideProps: GetServerSideProps = async (): Promise<GetServerSidePropsResult<Props>> => {
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
