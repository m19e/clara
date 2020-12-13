import React, { useEffect, FC, useState } from "react";
import { useRouter } from "next/router";
import useSWR from "swr";
import { auth, loginWithTwitter, logout, getUserData } from "../../lib/firebase/initFirebase";

type User = {
    uid: string;
    displayName: string;
    photoURL: string;
    userID?: string;
};

type Props = {
    id: string;
};

const Profile = ({ id }: Props) => {
    const { data, error } = useSWR(id, getUserData);

    if (error) return <div>{error.message}</div>;
    else if (!data) return <p>Loading...</p>;
    return (
        <div>
            <div>Hello, {data.userID}</div>
            <p>{JSON.stringify(data)}</p>
        </div>
    );
};

const Home: FC = (props: any) => {
    const router = useRouter();
    const [currentUser, setCurrentUser] = useState<null | User>(null);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            // user ? setCurrentUser(user) : router.push("/auth/login");
            setCurrentUser(user);
        });
    }, []);

    const logIn = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await loginWithTwitter();
            console.log("success login");
        } catch (error) {
            alert(error.message);
        }
    };

    const logOut = async (e: React.MouseEvent) => {
        e.preventDefault();
        try {
            await logout();
            console.log("success logout");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="flex flex-col">
            <div className="flex justify-end bg-gray-300" style={{ minHeight: "10vh" }}>
                {currentUser && <Profile id={currentUser.uid} />}
                {currentUser ? (
                    <div className="flex justify-center items-center w-36 bg-gray-400">
                        <div className="p-2">
                            <img src={currentUser.photoURL} alt="profile image" />
                        </div>
                        <div className="p-2">
                            <button onClick={(e) => logOut(e)}>Logout</button>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center items-center w-36 bg-gray-400">
                        <button onClick={(e) => logIn(e)}>Login</button>
                    </div>
                )}
                {/* <pre>{currentUser && JSON.stringify(currentUser, null, 4)}</pre> */}
            </div>
        </div>
    );
};

export default Home;
