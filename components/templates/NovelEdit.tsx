import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { INovelProp } from "types";
import { auth } from "lib/firebase/initFirebase";
import NovelEditor from "components/organisms/NovelEditor";
import Loader from "components/atoms/Loader";

type Props = {
    novel: INovelProp;
    tags: string[];
    usedTags: {
        name: string;
        count: number;
    }[];
    r18: boolean;
    isMobile: boolean;
};

const NovelEditPage = ({ novel, tags, usedTags, r18, isMobile }: Props) => {
    const router = useRouter();
    const [validAuth, setValidAuth] = useState(false);

    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user && user.uid === novel.author_uid && !isMobile) {
                setValidAuth(true);
            } else {
                router.push(`/novel/${novel.id}`);
            }
        });
    }, []);

    if (validAuth) {
        return <NovelEditor novel={novel} rootTags={tags} rootR18={r18} usedTags={usedTags} />;
    } else {
        return <Loader />;
    }
};

export default NovelEditPage;
