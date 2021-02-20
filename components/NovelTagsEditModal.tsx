import { useState } from "react";
import TagsEditor from "./TagsEditor";

type TagsEditModalProps = {
    tags: string[];
    setTags: (tags: string[]) => void;
};

const NovelTagsEditModal = ({ tags, setTags }: TagsEditModalProps) => {
    const [showModal, setShowModal] = useState(false);
    const [tempTags, setTempTags] = useState(tags);

    const initModal = () => {
        setTempTags(tags);
        setShowModal(true);
    };

    return (
        <div style={{ writingMode: "initial" }}>
            <span className="text-gray-400 hover:text-gray-600 w-4 h-4 mb-1 mr-1.5 flex-center cursor-pointer" onClick={() => initModal()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </span>
            {showModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-md">
                            <div className="gothic border-0 rounded shadow-lg relative flex flex-col w-full p-6 pb-4 editor-bg outline-none focus:outline-none">
                                <TagsEditor tempTags={tempTags} setTempTags={setTempTags} />
                                <div className="flex-center">
                                    <div className="flex justify-between w-72 mt-12">
                                        <span
                                            className="px-4 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            取消
                                        </span>
                                        <span
                                            className="px-4 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            編集
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            )}
        </div>
    );
};

export default NovelTagsEditModal;
