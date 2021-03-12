import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { INovelData } from "types";
import { auth, getUserDataByUID } from "../../../../lib/firebase/initFirebase";
import { getNovel } from "lib/firebase/novel";
import Loader from "../../../../components/Loader";
import NovelEditor from "../../../../components/NovelEditor";
import { useUserAgent, UserAgent } from "next-useragent";

type Props = {
    novel: INovelData;
    tags: string[];
    used_tags: {
        name: string;
        count: number;
    }[];
    r18: boolean;
    ua: UserAgent;
};

export default function NovelEdit({ novel, tags, used_tags, r18, ua }: Props) {
    const router = useRouter();
    const [validAuth, setValidAuth] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user && user.uid === novel.author_uid && !ua.isMobile) {
                setValidAuth(true);
            } else {
                router.push(`/novel/${novel.id}`);
            }
        });
    }, []);

    if (validAuth) {
        return <NovelEditor novel={novel} rootTags={tags} rootR18={r18} usedTags={used_tags} />;
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
