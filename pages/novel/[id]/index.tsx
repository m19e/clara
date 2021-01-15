import { useRouter } from "next/router";
import ErrorPage from "next/error";
import firebase from "firebase/app";
import NovelViewer from "../../../components/NovelViewer";
import { INovelDataSerializable, getAllNovelIDs, getNovel } from "../../../lib/firebase/initFirebase";

export default function NovelIndex({ novel }: { novel: INovelDataSerializable }) {
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
    const update = {
        created_at: getDisplayTime((novel.created_at as firebase.firestore.Timestamp).toMillis()),
        updated_at: getDisplayTime((novel.updated_at as firebase.firestore.Timestamp).toMillis()),
    };
    const serializable: INovelDataSerializable = Object.assign(novel, update);

    return {
        props: {
            novel: serializable,
        },
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
        fallback: false,
    };
}
