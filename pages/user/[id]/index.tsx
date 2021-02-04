import { GetServerSideProps, GetServerSidePropsContext } from "next";
import firebase from "firebase/app";
import UserPage from "../../../components/UserPage";
import { getAllUserNovelByUID, getUserDataByID, UserProfile, INovelDataSerializable } from "../../../lib/firebase/initFirebase";
import { getDisplayTime } from "../../../lib/novel/tools";

type UserIndexProps = {
    user: UserProfile;
    novels: INovelDataSerializable[];
};

export default function UserIndex({ user, novels }: UserIndexProps) {
    return <UserPage user={user} novels={novels} />;
}

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const id = typeof params.id === "string" ? params.id : "";
    const user = await getUserDataByID(id);
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
    };
};
