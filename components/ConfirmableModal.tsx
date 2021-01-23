import Link from "next/link";
import { useState } from "react";
import Tooltip from "./Tooltip";

type ConfirmableProps = {
    popperText: string;
    d: string;
    message: string;
    confirmText: string;
    cancelText: string;
    confirmFunc?: () => void;
    back?: boolean;
    novelID?: string;
};

export default function ConfirmableModal({ popperText, d, message, confirmText, cancelText, confirmFunc, back = false, novelID }: ConfirmableProps) {
    const [showModal, setShowModal] = useState(false);

    return (
        <>
            <div onClick={() => setShowModal(true)}>
                <Tooltip text={popperText} d={d} />
            </div>
            {showModal && (
                <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-md">
                            <div className="gothic border-0 rounded-lg shadow-lg relative flex flex-col w-full p-6 pb-4 bg-white outline-none focus:outline-none">
                                <div className="flex-center">{message}</div>
                                <div className="flex-center">
                                    <div className="flex justify-between w-72 opacity-80 mt-10">
                                        <span
                                            className="w-28 py-1 text-center font-semibold opacity-75 editor-bg border border-solid border-gray-300 rounded-3xl cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            {cancelText}
                                        </span>
                                        {back ? (
                                            <Link href={`/novel/${novelID}`}>
                                                <a className="w-28 py-1 text-center font-semibold opacity-75 editor-bg border border-solid border-gray-300 rounded-3xl cursor-pointer">
                                                    {confirmText}
                                                </a>
                                            </Link>
                                        ) : (
                                            <span
                                                className="w-28 py-1 text-center font-semibold opacity-75 editor-bg border border-solid border-gray-300 rounded-3xl cursor-pointer"
                                                onClick={() => confirmFunc()}
                                            >
                                                {confirmText}
                                            </span>
                                        )}
                                    </div>
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
