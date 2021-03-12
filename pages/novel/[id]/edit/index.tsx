import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { useUserAgent, UserAgent } from "next-useragent";
import { INovelData } from "types";
import { auth, getUserDataByUID } from "lib/firebase/initFirebase";
import { getNovel } from "lib/firebase/novel";
import Loader from "components/Loader";
import NovelEditPage from "components/templates/NovelEdit";

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

const NovelEditIndex = ({ novel, tags, used_tags, r18, ua }: Props) => (
    <NovelEditPage novel={novel} tags={tags} r18={r18} usedTags={used_tags} isMobile={ua.isMobile} />
);

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

export default NovelEditIndex;
