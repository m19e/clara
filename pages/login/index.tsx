import { GetServerSideProps } from "next";
import { loginWithTwitter } from "../../lib/firebase/initFirebase";

type Props = {};

export default function LoginIndex() {
    return (
        <div className="flex-center flex-1 h-screen bg-gray-100">
            <div className="w-80 h-60 flex-center flex-col editor-bg rounded">
                <h1 className="text-7xl">Clara</h1>
                <div className="btn-twitter flex-center w-72 mt-4 rounded-2xl cursor-pointer" onClick={() => loginWithTwitter()}>
                    <span className="system-font opacity-60 py-1" style={{ fontSize: "14px" }}>
                        Twitterでログイン
                    </span>
                </div>
            </div>
        </div>
    );
}

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    return {
        props: {},
    };
};
