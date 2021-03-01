import { GetServerSideProps } from "next";
import { getNovelsByIDs, getRootNovelIDs } from "../../lib/firebase/novel";
import TopPage from "../../components/top/Page";
import { INovelProp } from "../../lib/firebase/initFirebase";

const Top = ({ novels }: { novels: INovelProp[] }) => <TopPage novels={novels} />;

export const getServerSideProps: GetServerSideProps = async () => {
    const novelIDs = await getRootNovelIDs();
    const novels = await getNovelsByIDs(novelIDs.slice(0, 10));

    return {
        props: {
            novels,
        },
    };
};

export default Top;
