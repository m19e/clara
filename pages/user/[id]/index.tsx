import { useRouter } from "next/router";
import { GetStaticProps } from "next";
import firebase from "firebase/app";
import Loader from "../../../components/Loader";
import UserPage from "../../../components/UserPage";
import { getAllUserID, getAllUserNovelByUID, getUserDataByID, UserProfile, INovelDataSerializable } from "../../../lib/firebase/initFirebase";
import { getDisplayTime } from "../../../lib/novel/tools";

type UserIndexProps = {
    user: UserProfile;
    novels: INovelDataSerializable[];
};

export default function UserIndex({ user, novels }: UserIndexProps) {
    const router = useRouter();
    if (router.isFallback) {
        return (
            <div className="min-h-screen min-w-full flex-center">
                <Loader />
            </div>
        );
    }

    return <UserPage user={user} novels={novels} />;
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string } }) => {
    const user = await getUserDataByID(params.id);
    if (!user) return { notFound: true };
    const novels = await getAllUserNovelByUID(user.uid, "desc");
    const serializables: INovelDataSerializable[] = novels.map((novel) => {
        const update = {
            created_at: getDisplayTime((novel.created_at as firebase.firestore.Timestamp).toMillis()),
            updated_at: getDisplayTime((novel.updated_at as firebase.firestore.Timestamp).toMillis()),
        };
        const s = Object.assign(novel, update) as INovelDataSerializable;
        return s;
    });

    return {
        props: {
            user,
            novels: serializables,
        },
        revalidate: 1,
    };
};

export const getStaticPaths = async () => {
    const ids = await getAllUserID();

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
