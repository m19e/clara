import { GetServerSideProps } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, loginWithTwitter, logout } from "../../lib/firebase/initFirebase";

type Props = {};

export default function LoginIndex() {
    const [user, loading] = useAuthState(auth);
    console.log(user);

    return (
        <div className="flex justify-center items-center flex-1">
            <div className="w-48 h-48 flex justify-center items-center">
                {!loading && user ? (
                    <div>
                        <button onClick={() => logout()}>Logout</button>
                        <h2>Status: You Logged In</h2>
                    </div>
                ) : (
                    <button onClick={() => loginWithTwitter()}>Login</button>
                )}
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    return {
        props: {},
    };
};
