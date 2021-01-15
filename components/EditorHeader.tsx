import Link from "next/link";
import React, { useEffect, useState, useRef } from "react";
import { useTitle, useDraftID, useContent } from "../store/draft";
import { useProfile } from "../store/user";
import { updateDraftTitle } from "../lib/firebase/initFirebase";
import PublishModal from "./PubishModal";

export default function Header() {
    const [title, setTitle] = useTitle();
    const [draftID] = useDraftID();
    const [profile] = useProfile();
    const [content] = useContent();
    const [temptitle, setTempTitle] = useState("");
    const [isTitleEdit, setIsTitleEdit] = useState(false);
    const editTitleRef = useRef(null);

    const toggleTitleEdit = async () => {
        if (!isTitleEdit) {
            setTempTitle(title);
            setIsTitleEdit((prev) => !prev);
        } else {
            const tempTitleTrimmed = temptitle.trim();
            if (tempTitleTrimmed !== title && tempTitleTrimmed !== "") {
                setTitle(tempTitleTrimmed);
                await updateDraftTitle(profile.userID, draftID, tempTitleTrimmed);
            }
            setTimeout(() => {
                setIsTitleEdit((prev) => !prev);
            }, 50);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        toggleTitleEdit();
    };

    const handleTempTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTempTitle(e.target.value);
    };

    useEffect(() => {
        if (isTitleEdit) {
            editTitleRef.current.focus();
        }
    }, [isTitleEdit]);

    return (
        <div className="shadow-sm editor-bg fixed top-0 w-full">
            <div className="flex justify-between items-center">
                <div className="w-20">
                    <div className="flex justify-start items-center">
                        <span className="px-4 opacity-50">
                            <Link href="/">
                                <a>
                                    <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                </a>
                            </Link>
                        </span>
                    </div>
                </div>
                <div className="py-5 flex-grow-0 flex-center group">
                    {isTitleEdit ? (
                        <form onSubmit={handleSubmit}>
                            <input
                                className="text-black opacity-75 mx-2 text-center shadow-inner editor-bg rounded outline-none focus:outline-none"
                                type="text"
                                ref={editTitleRef}
                                value={temptitle}
                                onChange={handleTempTitleChange}
                                onBlur={toggleTitleEdit}
                                style={{ minWidth: "10rem", maxWidth: "50rem", width: `${temptitle.length + 1}rem` }}
                            />
                        </form>
                    ) : (
                        <>
                            <div className="w-6"></div>
                            <p className="text-black opacity-50 mx-1">{title}</p>
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
                                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                </svg>
                            </div>
                        </>
                    )}
                </div>
                <div className="w-20">
                    <div className="flex justify-end items-center">
                        <span className="px-4">
                            <PublishModal title={title} />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
