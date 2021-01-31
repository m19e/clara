import { useState, useRef } from "react";
import Popper from "popper.js";

type User = {
    photoURL: string;
};

export default function UserMenu({ user }: { user: User | null }) {
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = useRef();
    const popoverDropdownRef = useRef();
    const openDropdownPopover = () => {
        new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <div className="relative inline-flex align-middle w-full">
                    <div
                        className="w-9 h-9 ml-2 flex-center rounded-full bg-gray-200"
                        ref={btnDropdownRef}
                        onClick={() => {
                            dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                        }}
                    >
                        {user ? (
                            <img className="w-full h-full rounded-full" src={user.photoURL.replace(/.jpg/, "_normal.jpg")} />
                        ) : (
                            <svg
                                className="w-6 h-6 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                            </svg>
                        )}
                    </div>
                    <div
                        ref={popoverDropdownRef}
                        className={(dropdownPopoverShow ? "block " : "hidden ") + "text-base z-50 list-none text-left rounded shadow-md editor-bg mt-5 -ml-36"}
                        style={{ minWidth: "12rem" }}
                    >
                        {user && (
                            <>
                                <a
                                    href="#pablo"
                                    className={"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap bg-transparent"}
                                    onClick={(e) => e.preventDefault()}
                                >
                                    マイページ
                                </a>
                                <div className="h-0 my-2 border border-solid border-t-0 border-gray-300" />
                            </>
                        )}
                        <a
                            href="#pablo"
                            className={"text-sm py-2 px-4 font-normal block w-full whitespace-no-wrap transition-colors hover:bg-gray-200"}
                            onClick={(e) => e.preventDefault()}
                        >
                            {user ? "ログアウト" : "ログイン"}
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
