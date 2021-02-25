import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { getNovel, auth, getUserDataByUID, INovelData } from "../../../../lib/firebase/initFirebase";
import Loader from "../../../../components/Loader";
import NovelEditor from "../../../../components/NovelEditor";
import { useUserAgent, UserAgent } from "next-useragent";

type NovelEditProps = {
    novel: INovelData;
    tags: string[];
    used_tags: {
        name: string;
        count: number;
    }[];
    r18: boolean;
    ua: UserAgent;
};

export default function NovelEdit({ novel, tags, used_tags, r18, ua }: NovelEditProps) {
    const router = useRouter();
    const [validAuth, setValidAuth] = useState(false);
    const { author_uid, id, title, content } = novel;

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
        return <NovelEditor id={id} title={title} content={content} rootTags={tags} rootR18={r18} usedTags={used_tags} />;
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
    const n = await getNovel(novelID);
    if (!n) return { notFound: true };
    const { created_at, updated_at, ...novel } = n;

    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;
    const userData = await getUserDataByUID(novel.author_uid);
    const used_tags = "used_tags" in userData ? userData.used_tags : [];

    return {
        props: {
            novel,
            tags,
            used_tags,
            r18,
            ua,
        },
    };
};
