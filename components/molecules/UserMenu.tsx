import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Popper from "popper.js";
import { loginWithTwitter, logout } from "../../lib/firebase/initFirebase";

type User = {
    photoURL: string;
    userID: string;
};

type Props = {
    user: User | null;
};

const LoginButton = ({ onClick }: { onClick: () => void }) => (
    <span className={"text-sm p-4 font-normal block w-full whitespace-no-wrap cursor-pointer transition-colors hover:bg-gray-100"} onClick={() => onClick()}>
        ログイン
    </span>
);

const LogoutButton = ({ onClick }: { onClick: () => void }) => (
    <span className={"text-sm p-4 font-normal block w-full whitespace-no-wrap cursor-pointer transition-colors hover:bg-gray-100"} onClick={() => onClick()}>
        ログアウト
    </span>
);

const UserMenu = ({ user }: Props) => {
    const [dropdownPopoverShow, setDropdownPopoverShow] = useState(false);
    const btnDropdownRef = useRef<HTMLDivElement>();
    const popoverDropdownRef = useRef();

    useEffect(() => {
        dropdownPopoverShow && btnDropdownRef.current.focus();
    }, [dropdownPopoverShow]);

    const openDropdownPopover = () => {
        new Popper(btnDropdownRef.current, popoverDropdownRef.current, {
            placement: "bottom-start",
        });
        setDropdownPopoverShow(true);
    };
    const closeDropdownPopover = () => {
        setDropdownPopoverShow(false);
    };

    const handleLogInOut = async () => {
        if (user) {
            await logout();
        } else {
            await loginWithTwitter();
        }
    };

    return (
        <div className="flex flex-wrap">
            <div className="w-full">
                <div className="relative inline-flex align-middle w-full">
                    <div
                        className="w-9 h-9 ml-2 flex-center rounded-full bg-gray-200 cursor-pointer outline-none focus:outline-none"
                        ref={btnDropdownRef}
                        onClick={() => {
                            dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
                        }}
                        onBlur={() =>
                            setTimeout(() => {
                                closeDropdownPopover();
                            }, 200)
                        }
                        tabIndex={0}
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
                        className={
                            (dropdownPopoverShow ? "block " : "hidden ") +
                            "text-base w-48 z-50 list-none text-left rounded overflow-hidden shadow-md editor-bg mt-5 -ml-36"
                        }
                    >
                        {user && (
                            <>
                                <Link href={`/user/${user.userID}`}>
                                    <a className={"text-sm p-4 font-normal block w-full whitespace-no-wrap transition-colors hover:bg-gray-100"}>マイページ</a>
                                </Link>
                                <div className="h-0 border border-solid border-t-0 border-gray-300" />
                            </>
                        )}
                        <div
                            className={"text-sm p-4 font-normal block w-full whitespace-no-wrap cursor-pointer transition-colors hover:bg-gray-100"}
                            onClick={() => handleLogInOut()}
                        >
                            {user ? "ログアウト" : "ログイン"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserMenu;
