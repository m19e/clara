import React, { useState, useRef, useEffect } from "react";

export default function TitleEditModal({ title, setTitle }: { title: string; setTitle: (string) => void }) {
    const [showModal, setShowModal] = useState(false);
    const [tempTitle, setTempTitle] = useState(title);
    const [titleCharCount, setTitleCharCount] = useState(Array.from(title).length);
    const editTitleRef = useRef(null);

    useEffect(() => {
        if (showModal) {
            editTitleRef.current.focus();
        }
    }, [showModal]);

    const initModal = () => {
        setTempTitle(title);
        setShowModal(true);
    };

    const updateTitle = () => {
        tempTitle.trim() === "" ? null : setTitle(tempTitle.trim());
        setShowModal(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const arrayTitle = Array.from(e.currentTarget.value);
        const charCount = arrayTitle.length;
        if (charCount <= 100) {
            setTempTitle(e.currentTarget.value);
            setTitleCharCount(charCount);
        } else {
            setTempTitle(arrayTitle.slice(0, 100).join(""));
            setTitleCharCount(100);
        }
    };

    return (
        <div style={{ writingMode: "initial" }}>
            <svg
                className="w-6 h-6 opacity-50"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                onClick={() => initModal()}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
            {showModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-md">
                            <div className="gothic border-0 rounded-lg shadow-lg relative flex flex-col w-full p-6 pb-4 bg-white outline-none focus:outline-none">
                                <input
                                    type="text"
                                    className="w-72 py-1 px-2 editor-bg gothic text-xl text-center rounded shadow-inner outline-none focus:outline-none"
                                    ref={editTitleRef}
                                    value={tempTitle}
                                    onChange={(e) => handleChange(e)}
                                />
                                <span className="w-full text-right text-sm opacity-50">{titleCharCount}/100</span>
                                <div className="flex-center">
                                    <div className="flex justify-between w-72 opacity-80 mt-10">
                                        <span
                                            className="px-6 py-1 text-center font-semibold opacity-75 editor-bg border border-solid border-gray-300 rounded-3xl cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            取消
                                        </span>
                                        <span
                                            className="px-6 py-1 text-center font-semibold opacity-75 editor-bg border border-solid border-gray-300 rounded-3xl cursor-pointer"
                                            onClick={() => updateTitle()}
                                        >
                                            更新
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
}
