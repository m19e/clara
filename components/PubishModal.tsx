import { useIsShowPublishModal } from "../store/editor";

export default function PublishModal({ title }: { title: string }) {
    const [showModal, toggleShowModal] = useIsShowPublishModal();

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
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-sm">
                            <div className="gothic border-0 rounded-lg shadow-lg relative flex flex-col w-full p-6 pt-4 pb-3 bg-white outline-none focus:outline-none">
                                <span className="mincho text-xl">「{title}」</span>
                                <span className="w-full text-center opacity-75">を投稿しますか？</span>
                                <div className="flex justify-between opacity-80 mt-10">
                                    <span className="cursor-pointer" onClick={() => toggleShowModal()}>
                                        取消
                                    </span>
                                    <span className="cursor-pointer">投稿する</span>
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
