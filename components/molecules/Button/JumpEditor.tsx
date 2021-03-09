import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { loginWithTwitter } from "../../../lib/firebase/initFirebase";

type Props = {
    isLoggedin: boolean;
};

const JumpEditor = ({ isLoggedin }: Props) => {
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    const login = async () => {
        await loginWithTwitter();
        router.push("/editor");
    };

    return (
        <>
            {isLoggedin ? (
                <Link href="/editor">
                    <a className="flex-center px-6 bg-gray-200 bg-opacity-60 rounded-2xl cursor-pointer">
                        <span className="gothic font-black text-sm opacity-60 py-2">小説を書く</span>
                        <svg
                            className="w-4 h-4 opacity-50 hover:opacity-100"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                        </svg>
                    </a>
                </Link>
            ) : (
                <div className="flex-center px-6 bg-gray-200 bg-opacity-60 rounded-2xl cursor-pointer" onClick={() => setShowModal(true)}>
                    <span className="gothic font-black text-sm opacity-60 py-2">小説を書く</span>
                    <svg
                        className="w-4 h-4 opacity-50 hover:opacity-100"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                    </svg>
                </div>
            )}
            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div
                                className="border-0 rounded-lg shadow-lg relative flex flex-col w-full py-4 px-4 bg-white outline-none focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex-center px-2">
                                    <span className="gothic font-black opacity-60">小説を書く</span>
                                </div>
                                <span className="gothic font-thin opacity-70 w-full text-center pt-3 pb-4" style={{ fontSize: "14px" }}>
                                    ログインして執筆を始めましょう。
                                </span>
                                <div className="btn-twitter flex-center w-64 rounded-2xl cursor-pointer" onClick={() => login()}>
                                    <span className="system-font opacity-60 py-1" style={{ fontSize: "14px" }}>
                                        Twitterでログイン
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

export default JumpEditor;
