import { useTitle } from "../store/draft";

export default function Header() {
    const [title, setTitle] = useTitle();
    return (
        <div className="shadow-sm editor-bg fixed top-0 w-full">
            <div className="flex justify-between items-center">
                <div className="w-20"></div>
                <div className="py-5 flex-grow-0 flex-center">
                    <div className="w-6"></div>
                    <p className="text-black opacity-75 px-1">{title}</p>
                    <div className="w-6">
                        <svg className="opacity-50 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#2a2e3b">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                    </div>
                </div>
                <div className="w-20">
                    <div className="flex justify-end items-center">
                        <span className="px-4 opacity-50">
                            {/* <svg className="w-8 h-8" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m5.029 10.429h10" />
                                    <path d="m10.029 15.429v-10.001" />
                                </g>
                            </svg> */}
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
