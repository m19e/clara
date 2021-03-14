import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import { INovelProp } from "types";
import { getUserDataByUID } from "lib/firebase/initFirebase";
import { getNovel } from "lib/firebase/novel";
import NovelEditPage from "components/templates/NovelEdit";

type Props = {
    novel: INovelProp;
    used_tags: {
        name: string;
        count: number;
    }[];
    ua: UserAgent;
};

const NovelEditIndex = ({ novel, used_tags, ua }: Props) => <NovelEditPage novel={novel} usedTags={used_tags} isMobile={ua.isMobile} />;

export const getServerSideProps: GetServerSideProps = async ({ params, req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const novelID = typeof params.id === "string" ? params.id : "";
    const n = await getNovel(novelID);
    if (!n) return { notFound: true };
    const { created_at, updated_at, ...novelData } = n;
    const userData = await getUserDataByUID(novelData.author_uid);
    const used_tags = "used_tags" in userData ? userData.used_tags : [];

    const tags = "tags" in novelData ? novelData.tags : [];
    const r18 = "r18" in novelData ? novelData.r18 : false;
    const novel = Object.assign(novelData, { tags, r18 });

    return {
        props: {
            novel,
            used_tags,
            ua,
        },
    };
};

export default NovelEditIndex;
