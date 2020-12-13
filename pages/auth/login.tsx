import React, { useEffect, FC } from "react";
import { useRouter } from "next/router";
import { auth, loginWithTwitter } from "../../lib/firebase/initFirebase";

const Login: FC = () => {
    const router = useRouter();

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            user && router.push("/auth");
        });
    }, []);

    const login = async () => {
        try {
            await loginWithTwitter();
            router.push("/auth");
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="flex justify-center items-center flex-1">
            <div className="w-48 h-48 flex justify-center items-center">
                <button onClick={() => login()}>Login</button>
            </div>
        </div>
    );
};

export default Login;
