import { GetStaticProps } from "next";
import firebase from "firebase/app";
import Layout from "../../../components/Layout";
import { getAllUserID, getAllUserNovelByID, getUserDataByID, UserProfile, INovelDataSerializable } from "../../../lib/firebase/initFirebase";

export default function UserPage({ user, novels }: { user: UserProfile; novels: INovelDataSerializable[] }) {
    return (
        <Layout>
            {/* <div className="flex-center flex-col mt-4">
                <img className="w-36 h-36 mb-2 rounded-full" src={user.photoURL.replace(/_normal/, "")} alt="" />
                <h3 className="text-2xl font-semibold text-gray-800">{user.displayName}</h3>
                <span className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold">@{user.userID}</span>
            </div> */}
            <div className="h-full pt-16 mt-72">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                        <div className="px-6">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                    <div className="relative">
                                        <img
                                            alt="..."
                                            src={user.photoURL.replace(/_normal/, "")}
                                            className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                            style={{ maxWidth: "150px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-28">
                                <h3 className="text-3xl font-semibold gothic leading-normal text-gray-800 mb-2">{user.displayName}</h3>
                                <div className="text-sm leading-normal mt-0 mb-2 text-gray-500 font-bold">@{user.userID}</div>
                            </div>
                            <div className="mt-6 border-t border-gray-300 text-center">
                                <div className="flex flex-col items-center">
                                    <div className="w-full lg:w-9/12 px-4"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
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

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string } }) => {
    const user = await getUserDataByID(params.id);
    if (!user) return { notFound: true };
    const novels = await getAllUserNovelByID(params.id, "desc");
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
        revalidate: 600,
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
