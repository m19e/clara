import Link from "next/link";
import React, { useEffect, useState, useRef, FormEvent, ChangeEvent } from "react";
import { updateDraftTitle } from "lib/firebase/initFirebase";
import { useProfile } from "store/user";
import { useTitle, useDraftID, useIsTitleEdit } from "store/draft";
import ClaraHeader from "foundations/ClaraHeader";
import PublishModal from "components/organisms/PublishModal";

type Props = {
    loading: boolean;
};

const Header = ({ loading }: Props) => {
    const [profile] = useProfile();
    const [draftID] = useDraftID();
    const [title, setTitle] = useTitle();
    const [temptitle, setTempTitle] = useState("");
    const [isTitleEdit, toggleIsTitleEdit] = useIsTitleEdit();
    const editTitleRef = useRef(null);

    useEffect(() => {
        if (isTitleEdit) {
            editTitleRef.current.focus();
        }
    }, [isTitleEdit]);

    const handleToggle = async () => {
        if (!isTitleEdit) {
            setTempTitle(title);
            toggleIsTitleEdit();
        } else {
            const tempTitleTrimmed = temptitle.trim();
            if (tempTitleTrimmed !== title && tempTitleTrimmed !== "") {
                setTitle(tempTitleTrimmed);
                await updateDraftTitle(profile.uid, draftID, tempTitleTrimmed);
            }
            setTimeout(() => {
                toggleIsTitleEdit();
            }, 50);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        handleToggle();
    };

    const handleTempTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const t = e.currentTarget.value;
        const arrayTitle = Array.from(t);
        const charCount = arrayTitle.length;
        if (charCount <= 50) {
            setTempTitle(t);
        } else {
            setTempTitle(arrayTitle.slice(0, 50).join(""));
        }
    };

    return (
        <div className="shadow-sm editor-bg fixed top-0 w-full flex-center">
            <ClaraHeader
                title={title + " | Clara"}
                description={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogTitle={"Clara"}
                ogDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twTitle={"Clara"}
                twDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL}
                twCard="summary"
            />
            <div className="container flex justify-between items-center">
                <div className="w-20">
                    <div className="flex justify-start items-center">
                        <div className="px-4">
                            <Link href="/">
                                <a>
                                    <img className="w-6 h-6" src="/icon-64x64.png" alt="Clara" />
                                </a>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="py-5 flex-grow-0 flex-center group">
                    {loading ? (
                        <div className="animate-pulse h-3 w-36 my-1.5 bg-gray-300 rounded-sm"></div>
                    ) : (
                        <>
                            {isTitleEdit ? (
                                <form onSubmit={handleSubmit}>
                                    <input
                                        className="text-gray-900 mx-2 text-center shadow-inner editor-bg rounded outline-none focus:outline-none"
                                        type="text"
                                        ref={editTitleRef}
                                        value={temptitle}
                                        onChange={handleTempTitleChange}
                                        onBlur={handleToggle}
                                        onKeyDown={(e) => {
                                            if (e.key === "Tab") e.preventDefault();
                                        }}
                                        style={{ minWidth: "10rem", maxWidth: "50rem", width: `${temptitle.length + 1}rem` }}
                                    />
                                </form>
                            ) : (
                                <>
                                    <div className="w-6"></div>
                                    <span className="text-gray-900 whitespace-pre mx-1">{title}</span>
                                    <div className="w-6 opacity-0 transition-opacity duration-1000 ease-out group-hover:opacity-60" onClick={handleToggle}>
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
                        </>
                    )}
                </div>
                <div className="w-20">
                    <div className="flex justify-end items-center">
                        <div className="px-4">
                            <PublishModal />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Header;
