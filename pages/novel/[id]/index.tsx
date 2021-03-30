import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import { INovelDataSerializable } from "types";
import { getNovel } from "lib/firebase/novel";
import { createDisplayTimeFromTimestamp } from "lib/novel/tools";
import NovelPage from "components/templates/Novel";

type Props = {
    novel: INovelDataSerializable;
    ua: UserAgent;
};

const NovelIndex = ({ novel, ua }: Props) => <NovelPage novel={novel} isMobile={ua.isMobile} />;

export const getServerSideProps: GetServerSideProps = async ({ req, params }: GetServerSidePropsContext): Promise<GetServerSidePropsResult<Props>> => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const id = typeof params.id === "string" ? params.id : "";
    const n = await getNovel(id);
    if (!n) return { notFound: true };

    const tags = "tags" in n ? n.tags : [];
    const r18 = "r18" in n ? n.r18 : false;
    const created_at = createDisplayTimeFromTimestamp(n.created_at);
    const updated_at = createDisplayTimeFromTimestamp(n.updated_at);
    const update = {
        tags,
        r18,
        created_at,
        updated_at,
    };
    const novel: INovelDataSerializable = Object.assign(n, update);

    return {
        props: {
            novel,
            ua,
        },
    };
};

export default NovelIndex;
