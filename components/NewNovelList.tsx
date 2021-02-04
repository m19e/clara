import Link from "next/link";
import { useState, useEffect } from "react";
import Loader from "./Loader";
import { INovelData, getNewNovels } from "../lib/firebase/initFirebase";
import { getTextCharCount } from "../lib/novel/tools";

type NewNovelListProps = {
    borderNovelMillis: number;
};

export default function NewNovelList({ borderNovelMillis }: NewNovelListProps) {
    const [Loading, setLoading] = useState(true);
    const [newList, setNewList] = useState<INovelData[]>([]);

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
                        <div key={"novel-new-0" + i} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300">
                            <Link href={`/novel/${novel.id}`}>
                                <a className="text-2xl font-semibold whitespace-pre-wrap opacity-75">{novel.title}</a>
                            </Link>
                            <div className="flex justify-between mt-4 items-baseline">
                                <Link href={`/user/${novel.author_id}`}>
                                    <a className="opacity-75">{novel.author_name}</a>
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
