import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import { INovelProp } from "types";
import { getUserDataByUID } from "lib/firebase/initFirebase";
import { getNovel } from "lib/firebase/novel";
import NovelEditPage from "components/templates/NovelEdit";

type Props = {
    novel: INovelProp;
    tags: string[];
    used_tags: {
        name: string;
        count: number;
    }[];
    r18: boolean;
    ua: UserAgent;
};

const NovelEditIndex = ({ novel, used_tags, ua }: Props) => (
    <NovelEditPage novel={novel} tags={novel.tags} r18={novel.r18} usedTags={used_tags} isMobile={ua.isMobile} />
);

export const getServerSideProps: GetServerSideProps = async ({ params, req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const novelID = typeof params.id === "string" ? params.id : "";
    const n = await getNovel(novelID);
    if (!n) return { notFound: true };
    const { created_at, updated_at, ...novel } = n;
    const userData = await getUserDataByUID(novel.author_uid);
    const used_tags = "used_tags" in userData ? userData.used_tags : [];

    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;
    const assigned = Object.assign(novel, { tags, r18 });

    return {
        props: {
            novel: assigned,
            used_tags,
            ua,
        },
    };
};

export default NovelEditIndex;
