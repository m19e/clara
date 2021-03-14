import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { INovelProp } from "types";
import { auth } from "lib/firebase/initFirebase";
import NovelEditor from "components/organisms/NovelEditor";
import Loader from "components/atoms/Loader";

type Props = {
    novel: INovelProp;
    usedTags: {
        name: string;
        count: number;
    }[];
    isMobile: boolean;
};

const NovelEditPage = ({ novel, usedTags, isMobile }: Props) => {
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
        return <NovelEditor novel={novel} rootTags={novel.tags} rootR18={novel.r18} usedTags={usedTags} />;
    } else {
        return <Loader />;
    }
};

export default NovelEditPage;
