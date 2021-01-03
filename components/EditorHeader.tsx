import React, { useEffect, useState, useRef } from "react";
import { useTitle } from "../store/draft";

export default function Header() {
    const [title, setTitle] = useTitle();
    const [isTitleEdit, setIsTitleEdit] = useState(false);
    const editTitleRef = useRef(null);

    const toggleTitleEdit = () => {
        setIsTitleEdit((prev) => !prev);
    };

    const onTempTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    useEffect(() => {
        if (isTitleEdit) {
            editTitleRef.current.focus();
        }
    }, [isTitleEdit]);

    return (
        <div className="shadow-sm editor-bg fixed top-0 w-full">
            <div className="flex justify-between items-center">
                <div className="w-20"></div>
                <div className="py-5 flex-grow-0 flex-center group">
                    <div className="w-6"></div>
                    {isTitleEdit ? (
                        <>
                            <input
                                className="text-black opacity-75 mx-1 px-2 shadow-inner editor-bg rounded outline-none focus:outline-none"
                                type="text"
                                ref={editTitleRef}
                                value={title}
                                onChange={onTempTitleChange}
                                style={{ width: title.length + 1 + "rem" }}
                            />
                            <div className="w-6 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-50" onClick={toggleTitleEdit}>
                                <svg
                                    className="w-4 h-4 opacity-50 hover:opacity-100"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#2a2e3b"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </>
                    ) : (
                        <>
                            <p className="text-black opacity-75 mx-1 px-2">{title}</p>
                            <div className="w-6 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-50" onClick={toggleTitleEdit}>
                                <svg
                                    className="w-4 h-4 opacity-50 hover:opacity-100"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="#2a2e3b"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                    />
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                <div className="w-20">
                    <div className="flex justify-end items-center">
                        <span className="px-4 opacity-50">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="24" height="24" viewBox="0 0 24 24" stroke="#2a2e3b">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
