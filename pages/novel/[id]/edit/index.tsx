import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getAllNovelIDs, getNovel, auth } from "../../../../lib/firebase/initFirebase";
import Loader from "../../../../components/Loader";

import NovelEditor from "../../../../components/NovelEditor";

type NovelEditProps = {
    author_uid: string;
    id: string;
    title: string;
    content: string;
};

export default function NovelEdit({ author_uid, id, title, content }: NovelEditProps) {
    const router = useRouter();
    const [validAuth, setValidAuth] = useState(false);
    if (router.isFallback) {
        return (
            <div className="min-h-screen min-w-full flex-center bg-gray-100">
                <Loader />
            </div>
        );
    }

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user && user.uid === author_uid) {
                setValidAuth(true);
            } else {
                router.push(`/novel/${id}`);
            }
        });
    }, []);

    if (validAuth) {
        return <NovelEditor title={title} content={content} />;
    } else {
        return (
            <div className="min-h-screen min-w-full flex-center bg-gray-100">
                <Loader />
            </div>
        );
    }
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string } }) => {
    const novel = await getNovel(params.id);
    if (!novel) return { notFound: true };
    const { author_uid, id, title, content } = novel;

    return {
        props: {
            author_uid,
            id,
            title,
            content,
        },
        revalidate: 600,
    };
};

export const getStaticPaths = async () => {
    const ids = await getAllNovelIDs();

    return {
        paths: ids.map((id) => {
            return {
                params: {
                    id,
                },
            };
        }),
        fallback: true,
    };
};
