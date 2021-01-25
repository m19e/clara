import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import firebase from "firebase/app";
import NovelViewer from "../../../components/NovelViewer";
import Loader from "../../../components/Loader";
import { INovelDataSerializable, getAllNovelIDs, getNovel } from "../../../lib/firebase/initFirebase";
import { getDisplayTime } from "../../../lib/novel/tools";

export default function NovelIndex({ novel }: { novel: INovelDataSerializable }) {
    const router = useRouter();
    if (router.isFallback) {
        return (
            <div className="min-h-screen min-w-full flex-center">
                <Loader />
            </div>
        );
    }

    return <NovelViewer novel={novel} />;
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string } }) => {
    const novel = await getNovel(params.id);
    if (!novel) return { notFound: true };
    const update = {
        created_at: getDisplayTime((novel.created_at as firebase.firestore.Timestamp).toMillis()),
        updated_at: getDisplayTime((novel.updated_at as firebase.firestore.Timestamp).toMillis()),
    };
    const serializable: INovelDataSerializable = Object.assign(novel, update);

    return {
        props: {
            novel: serializable,
        },
        revalidate: 600,
    };
};

export const getStaticPaths = async () => {
    const ids = await getAllNovelIDs();

    return {
        paths: ids.map((id) => {
            return {
                params: {
                    id,
                },
            };
        }),
        fallback: true,
    };
};
