import { GetServerSideProps, GetServerSidePropsContext } from "next";
import UserPage from "../../../components/UserPage";
import { getAllUserNovelByUID, getUserDataByID, UserProfile, INovelDataSerializable } from "../../../lib/firebase/initFirebase";
import { createDisplayTimeFromTimestamp } from "../../../lib/novel/tools";

type Props = {
    user: UserProfile;
    novels: INovelDataSerializable[];
};

const UserIndex = ({ user, novels }: Props) => <UserPage user={user} novels={novels} />;

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const id = typeof params.id === "string" ? params.id : "";
    const user = await getUserDataByID(id);
    if (!user) return { notFound: true };
    const novels = await getAllUserNovelByUID(user.uid, "desc");
    const serializables: INovelDataSerializable[] = novels.map((novel) => {
        const update = {
            created_at: createDisplayTimeFromTimestamp(novel.created_at),
            updated_at: createDisplayTimeFromTimestamp(novel.updated_at),
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

export default UserIndex;
