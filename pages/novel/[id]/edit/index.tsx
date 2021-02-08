import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getNovel, auth } from "../../../../lib/firebase/initFirebase";
import Loader from "../../../../components/Loader";
import NovelEditor from "../../../../components/NovelEditor";
import { useUserAgent, UserAgent } from "next-useragent";

type NovelEditProps = {
    author_uid: string;
    id: string;
    title: string;
    content: string;
    ua: UserAgent;
};

export default function NovelEdit({ author_uid, id, title, content, ua }: NovelEditProps) {
    const router = useRouter();
    const [validAuth, setValidAuth] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user && user.uid === author_uid && !ua.isMobile) {
                setValidAuth(true);
            } else {
                router.push(`/novel/${id}`);
            }
        });
    }, []);

    if (validAuth) {
        return <NovelEditor id={id} title={title} content={content} />;
    } else {
        return (
            <div className="min-h-screen min-w-full flex-center bg-gray-100">
                <Loader />
            </div>
        );
    }
}

export const getServerSideProps: GetServerSideProps = async ({ params, req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);
    const novelID = typeof params.id === "string" ? params.id : "";
    const novel = await getNovel(novelID);
    if (!novel) return { notFound: true };
    const { author_uid, id, title, content } = novel;

    return {
        props: {
            author_uid,
            id,
            title,
            content,
            ua,
        },
    };
};
