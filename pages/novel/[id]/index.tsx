import { useRouter } from "next/router";
import firebase from "firebase/app";
import NovelViewer from "../../../components/NovelViewer";
import Loader from "../../../components/Loader";
import { INovelDataSerializable, getAllNovelIDs, getNovel } from "../../../lib/firebase/initFirebase";

export default function NovelIndex({ novel }: { novel: INovelDataSerializable }) {
    const router = useRouter();
    if (router.isFallback)
        return (
            <div className="min-h-screen min-w-full flex-center">
                <Loader />
            </div>
        );

    return <NovelViewer novel={novel} />;
}

const getDisplayTime = (milli: number): string => {
    const dt = new Date(milli);
    const y = dt.getFullYear() + "/";
    const m = dt.getMonth() + 1 + "/";
    const d = dt.getDate() + " ";
    const ho = ("00" + dt.getHours()).slice(-2) + ":";
    const mi = ("00" + dt.getMinutes()).slice(-2);
    return y + m + d + ho + mi;
};

export async function getStaticProps({ params }: { params: { id: string } }) {
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
}

export async function getStaticPaths() {
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
}
