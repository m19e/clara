import Link from "next/link";
import { useState, useEffect } from "react";
import JumpEditorButton from "./JumpEditorButton";
import { auth } from "../lib/firebase/initFirebase";

export default function Layout({ children }) {
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setIsLoggedin(!!user);
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
                        <JumpEditorButton isLoggedin={isLoggedin} />
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
}
