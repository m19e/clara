import { useIsMincho } from "../store/editor";

export default function Header() {
    const [isMincho] = useIsMincho();

    return (
        <div className={"fixed top-0 w-full" + (isMincho ? " mincho" : " gothic")}>
            <div className="flex justify-between items-center">
                <div className="w-20"></div>
                <p className="text-black opacity-50 py-5 flex-grow-0">[ここにタイトルが入ります]</p>
                <div className="w-20">
                    <div className="flex justify-end items-center">
                        <span className="px-4 opacity-50">
                            <svg className="w-8 h-8" width="21" height="21" viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
                                <g fill="none" fillRule="evenodd" stroke="#2a2e3b" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="m5.029 10.429h10" />
                                    <path d="m10.029 15.429v-10.001" />
                                </g>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
