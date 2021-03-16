import { useRouter } from "next/router";
import { useState } from "react";
import { publishNovel, createDraftData, setUsedTags } from "lib/firebase/initFirebase";
import { getRootNovelInfos, setRootNovelInfos } from "lib/firebase/novel";
import { unifyUsedTags } from "lib/novel/tools";
import { useDraftID, useTitle, useContent } from "store/draft";
import { useIsShowPublishModal } from "store/editor";
import { useSuggests } from "store/novel";
import { useProfile } from "store/user";
import TagsEditor from "components/molecules/TagsEditor";

const PublishModal = () => {
    const [id] = useDraftID();
    const [title] = useTitle();
    const [content] = useContent();
    const [profile] = useProfile();
    const [suggests] = useSuggests();
    const [showModal, toggleShowModal] = useIsShowPublishModal();

    const [tags, setTags] = useState([]);
    const [r18, setR18] = useState(false);
    const [inTask, setInTask] = useState(false);

    const router = useRouter();

    const publish = async () => {
        if (inTask) return;
        setInTask(true);
        const novel = {
            id,
            title,
            content,
            tags,
            r18,
            author_id: profile.userID,
            author_uid: profile.uid,
            author_name: profile.displayName,
        };
        await publishNovel(novel);
        const newUsedTags = unifyUsedTags(suggests, [], tags);
        await setUsedTags(novel.author_uid, newUsedTags);
        const infos = await getRootNovelInfos();
        if (infos.findIndex((i) => i.id === id) === -1) {
            const added = [].concat([{ id, tags }], infos);
            await setRootNovelInfos(added);
        }
        await createDraftData(profile.uid);
        toggleShowModal();
        router.push(`/novel/${id}`);
    };

    return (
        <>
            <svg
                className="w-6 h-6 opacity-50 cursor-pointer"
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
                        <div className="relative w-auto my-6 mx-auto max-w-lg" style={{ width: "512px" }}>
                            <div
                                className="gothic border-0 rounded shadow-lg relative flex flex-col w-full p-6 pb-4 editor-bg outline-none focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <TagsEditor tempTags={tags} setTempTags={setTags} tempR18={r18} setTempR18={setR18} />
                                <div className="flex justify-between w-full mt-12">
                                    <span
                                        className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                        onClick={() => toggleShowModal()}
                                    >
                                        閉じる
                                    </span>
                                    <span
                                        className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                        onClick={() => publish()}
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
};

export default PublishModal;
