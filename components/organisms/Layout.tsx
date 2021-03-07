import Link from "next/link";
import { ReactNode, useEffect } from "react";
import JumpEditorButton from "../JumpEditorButton";
import UserMenu from "../UserMenu";
import { useProfile } from "../../store/user";
import { auth, getUserDataByUID } from "../../lib/firebase/initFirebase";

type Props = {
    children: ReactNode;
};

const Layout = ({ children }: Props) => {
    const [profile, setProfile] = useProfile();

    useEffect(() => {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const { uid, displayName, photoURL } = user;
                const userData = await getUserDataByUID(uid);
                const { userID } = userData;
                setProfile({ uid, displayName, photoURL, userID });
            } else {
                setProfile(null);
            }
        });
    }, []);

    return (
        <div className="min-h-screen w-full bg-gray-200">
            <nav className="h-16 w-full flex-center editor-bg">
                <div className="container flex-center">
                    <div className="w-11/12 flex flex-wrap items-center justify-between">
                        <div className="flex-center">
                            <Link href="/">
                                <a>
                                    <div className="flex-center">
                                        <img className="w-6 h-6 mr-1.5" src="/icon-64x64.png" alt="Clara" />
                                        <span className="mincho font-black text-3xl text-gray-700">Clara</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                        <div className="flex">
                            <JumpEditorButton isLoggedin={!!profile} />
                            <UserMenu user={profile} />
                        </div>
                    </div>
                </div>
            </nav>
            {children}
        </div>
    );
};

export default Layout;
