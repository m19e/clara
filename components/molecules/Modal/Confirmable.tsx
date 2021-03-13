import Link from "next/link";
import { useState } from "react";
import Tooltip from "components/molecules/Tooltip";

type Props = {
    popperText: string;
    d: string;
    message: string;
    confirmText: string;
    cancelText: string;
    onConfirm?: () => Promise<void>;
    back?: boolean;
    novelID?: string;
};

export default function ConfirmableModal({ popperText, d, message, confirmText, cancelText, onConfirm, back = false, novelID }: Props) {
    const [showModal, setShowModal] = useState(false);
    const [inTask, setInTask] = useState(false);

    const fireConfirm = async () => {
        if (inTask) return;
        setInTask(true);
        await onConfirm();
    };

    return (
        <>
            <div onClick={() => setShowModal(true)}>
                <Tooltip text={popperText}>
                    <svg
                        className="w-8 h-8 transition-opacity opacity-50 hover:opacity-70 cursor-pointer"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
                    </svg>
                </Tooltip>
            </div>
            {showModal && (
                <>
                    <div
                        className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
                        onClick={() => setShowModal(false)}
                    >
                        <div className="relative w-auto my-6 mx-auto max-w-xs">
                            <div
                                className="gothic border-0 rounded shadow-lg relative flex flex-col w-full p-6 pb-4 editor-bg outline-none focus:outline-none"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex-center text-lg">{message}</div>
                                <div className="flex-center">
                                    <div className="flex justify-between w-72 mt-12">
                                        <span
                                            className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                            onClick={() => setShowModal(false)}
                                        >
                                            {cancelText}
                                        </span>
                                        {back ? (
                                            <Link href={`/novel/${novelID}`}>
                                                <a className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer">
                                                    {confirmText}
                                                </a>
                                            </Link>
                                        ) : (
                                            <span
                                                className="w-20 text-center text-gray-600 border-b border-solid border-gray-300 transition-colors hover:border-gray-400 cursor-pointer"
                                                onClick={() => fireConfirm()}
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
