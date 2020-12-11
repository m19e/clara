import firebase from "firebase";
import { FC, createContext, useEffect, useState } from "react";
import { auth } from "../lib/firebase/initFirebase";

type AuthContextProps = {
    currentUser: firebase.User | null | undefined;
};

const AuthContext = createContext<AuthContextProps>({ currentUser: undefined });

const AuthProvider: FC = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null | undefined>(undefined);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            setCurrentUser(user);
        });
    }, []);

    return <AuthContext.Provider value={{ currentUser }}>{children}</AuthContext.Provider>;
};

export { AuthContext, AuthProvider };
