import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import firebase from "firebase/app";
import NovelViewer from "../../../components/NovelViewer";
import { INovelDataSerializable, getNovel } from "../../../lib/firebase/initFirebase";
import { getDisplayTime } from "../../../lib/novel/tools";

export default function NovelIndex({ novel, ua }: { novel: INovelDataSerializable; ua: UserAgent }) {
    return <NovelViewer novel={novel} isMobile={ua.isMobile} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const id = typeof params.id === "string" ? params.id : "";
    const novel = await getNovel(id);
    if (!novel) return { notFound: true };
    const update = {
        created_at: getDisplayTime((novel.created_at as firebase.firestore.Timestamp).toMillis()),
        updated_at: getDisplayTime((novel.updated_at as firebase.firestore.Timestamp).toMillis()),
    };
    const serializable: INovelDataSerializable = Object.assign(novel, update);

    return {
        props: {
            novel: serializable,
            ua,
        },
    };
};
