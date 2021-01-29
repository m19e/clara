import { useRouter } from "next/router";
import { useIsShowPublishModal } from "../store/editor";
import { useDraftID, useTitle, useContent } from "../store/draft";
import { useProfile } from "../store/user";
import { publishNovel, createDraftData } from "../lib/firebase/initFirebase";

interface INovelProp {
    id: string;
    title: string;
    content: string;
    author_id: string;
    author_uid: string;
    author_name: string;
}

export default function PublishModal() {
    const [showModal, toggleShowModal] = useIsShowPublishModal();
    const [id] = useDraftID();
    const [title] = useTitle();
    const [content] = useContent();
    const [profile] = useProfile();
    const router = useRouter();

    const confirm = async () => {
        const novel: INovelProp = { id, title, content, author_id: profile.userID, author_uid: profile.uid, author_name: profile.displayName };
        await publishNovel(novel);
        await createDraftData(profile.uid);
        router.push(`/novel/${id}`);
        toggleShowModal();
    };

    return (
        <>
            <svg
                className="w-5 h-5 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => toggleShowModal()}
            >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => toggleShowModal()}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div
                                className="gothic border-0 rounded shadow-lg relative flex flex-col w-full p-6 pb-4 editor-bg outline-none focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <span className="gothic text-xl text-gray-800 text-center">{title}</span>
                                <span className="w-full text-center text-gray-600">を投稿しますか？</span>
                                <div className="flex justify-between w-72 mt-10">
                                    <span
                                        className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                        onClick={() => toggleShowModal()}
                                    >
                                        閉じる
                                    </span>
                                    <span
                                        className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                        onClick={() => confirm()}
                                    >
                                        投稿する
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </>
    );
}
