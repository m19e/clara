import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import { INovelDataSerializable } from "types";
import { getNovel } from "lib/firebase/novel";
import { createDisplayTimeFromTimestamp } from "lib/novel/tools";
import NovelPage from "components/templates/Novel";

const NovelIndex = ({ novel, ua }: { novel: INovelDataSerializable; ua: UserAgent }) => <NovelPage novel={novel} isMobile={ua.isMobile} />;

export const getServerSideProps: GetServerSideProps = async ({ req, params }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const id = typeof params.id === "string" ? params.id : "";
    const novel = await getNovel(id);
    if (!novel) return { notFound: true };
    const update = {
        created_at: createDisplayTimeFromTimestamp(novel.created_at),
        updated_at: createDisplayTimeFromTimestamp(novel.updated_at),
    };
    const serializable: INovelDataSerializable = Object.assign(novel, update);

    return {
        props: {
            novel: serializable,
            ua,
        },
    };
};

export default NovelIndex;
