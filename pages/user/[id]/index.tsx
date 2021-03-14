import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { INovelDataSerializable } from "types";
import { getAllUserNovelByUID, getUserDataByID, UserProfile } from "lib/firebase/initFirebase";
import { createDisplayTimeFromTimestamp } from "lib/novel/tools";
import UserPage from "components/UserPage";

type Props = {
    user: UserProfile;
    novels: INovelDataSerializable[];
};

const UserIndex = ({ user, novels }: Props) => <UserPage user={user} novels={novels} />;

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const id = typeof params.id === "string" ? params.id : "";
    const user = await getUserDataByID(id);
    if (!user) return { notFound: true };
    const datas = await getAllUserNovelByUID(user.uid, "desc");
    const novels: INovelDataSerializable[] = datas.map((data) => {
        const tags = "tags" in data ? data.tags : [];
        const r18 = "r18" in data ? data.r18 : false;
        const created_at = createDisplayTimeFromTimestamp(data.created_at);
        const updated_at = createDisplayTimeFromTimestamp(data.updated_at);
        const update = {
            tags,
            r18,
            created_at,
            updated_at,
        };
        return Object.assign(data, update);
    });

    return {
        props: {
            user,
            novels,
        },
    };
};

export default UserIndex;
