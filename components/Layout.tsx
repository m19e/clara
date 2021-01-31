import Link from "next/link";
import { useState, useEffect } from "react";
import JumpEditorButton from "./JumpEditorButton";
import UserMenu from "./UserMenu";
import { auth } from "../lib/firebase/initFirebase";

export default function Layout({ children }) {
    const [isLoggedin, setIsLoggedin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setIsLoggedin(!!user);
            setCurrentUser(user);
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-200">
            <nav className="h-16 w-full flex-center editor-bg">
                <div className="container flex-center">
                    <div className="w-11/12 flex flex-wrap items-center justify-between">
                        <Link href="/">
                            <a className="mincho font-black text-3xl text-gray-600">Clara</a>
                        </Link>
                        <div className="flex">
                            <JumpEditorButton isLoggedin={isLoggedin} />
                            {/* user dropdown menu (if loggedin display) */}
                            <UserMenu user={currentUser} />
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
