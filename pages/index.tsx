import { GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";
import firebase from "firebase/app";
import Layout from "../components/Layout";
import { INovelDataSerializable, getAllNovel } from "../lib/firebase/initFirebase";
import { getDisplayTime, getTextCharCount } from "../lib/novel/tools";

export default function Top({ novels }: { novels: INovelDataSerializable[] }) {
    const [rootList] = useState(novels);
    const [displayList, setDisplayList] = useState(novels.slice(0, 20));
    const [hasMore, setHasMore] = useState(novels.length > 20);

    const displayMore = () => {
        const displayListLen = displayList.length;
        const moreItems = rootList.slice(0, displayListLen + 10);
        if (moreItems.length === rootList.length) {
            setHasMore(false);
        }
        setDisplayList(moreItems);
    };

    return (
        <Layout>
            <div className="flex-center">
                <div className="w-full flex flex-col flex-center mt-4 mb-8">
                    <div className="container flex-center">
                        <div className="w-11/12 flex justify-center flex-wrap items-end editor-bg rounded">
                            {displayList.map((novel, i) => (
                                <div key={"novel-0" + i} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300">
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
                            <div className="w-3/4 xl:max-w-lg xl:mx-8 2xl:max-w-xl"></div>
                            <div className="w-full flex-center my-8 editor-bg">
                                {hasMore && (
                                    <button
                                        className="gothic text-gray-500 bg-transparent border border-solid border-gray-500 transition-all hover:bg-gray-400 hover:border-gray-400 hover:text-white font-bold text-sm px-4 py-2 rounded outline-none focus:outline-none"
                                        type="button"
                                        onClick={() => displayMore()}
                                    >
                                        もっと見る
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const novels = await getAllNovel("desc");
    const serializables: INovelDataSerializable[] = novels.map((novel) => {
        const update = {
            created_at: getDisplayTime((novel.created_at as firebase.firestore.Timestamp).toMillis()),
            updated_at: getDisplayTime((novel.updated_at as firebase.firestore.Timestamp).toMillis()),
        };
        const s = Object.assign(novel, update) as INovelDataSerializable;
        return s;
    });

    return {
        props: {
            novels: serializables,
        },
        revalidate: 600,
    };
};
