import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import ListTags from "./ListTags";
import { getNewNovels, INovelProp } from "../lib/firebase/initFirebase";
import { getTextCharCount } from "../lib/novel/tools";

type NewNovelListProps = {
    borderNovelMillis: number;
};

export default function NewNovelList({ borderNovelMillis }: NewNovelListProps) {
    const [Loading, setLoading] = useState(true);
    const [newList, setNewList] = useState<INovelProp[]>([]);

    useEffect(() => {
        const loadNewNovels = async () => {
            const newNovels = await getNewNovels(borderNovelMillis);
            if (newNovels.length !== 0) setNewList(newNovels);
            setLoading(false);
        };
        loadNewNovels();
    }, []);

    return (
        <>
            {Loading ? (
                <div className="w-full flex-center">
                    <div className="mt-4 bg-gray-200 rounded-md">
                        <Loader />
                    </div>
                </div>
            ) : (
                <>
                    {newList.map((novel, i) => (
                        <div key={"novel-0" + i} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300">
                            <div className="mb-3">
                                <Link href={`/novel/${novel.id}`}>
                                    <a className="text-2xl gothic font-semibold whitespace-pre-wrap opacity-75">{novel.title}</a>
                                </Link>
                            </div>
                            <div className="whitespace-pre-wrap ml-0.5 pb-3">
                                <ListTags novel={novel} />
                            </div>
                            <div className="flex justify-between items-baseline">
                                <Link href={`/user/${novel.author_id}`}>
                                    <a className="gothic opacity-75">{novel.author_name}</a>
                                </Link>
                                <p className="text-sm opacity-50">{getTextCharCount(novel.content)}字</p>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </>
    );
}
