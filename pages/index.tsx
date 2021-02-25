import { GetStaticProps } from "next";
import Link from "next/link";
import { useState } from "react";
import firebase from "firebase/app";
import Layout from "../components/Layout";
import Header from "../components/Header";
import NewNovelList from "../components/NewNovelList";
import ListTags from "../components/ListTags";
import { INovelDataSerializable, getAllNovel } from "../lib/firebase/initFirebase";
import { getDisplayTime, getTextCharCount } from "../lib/novel/tools";

interface INovelDataWithMillis extends INovelDataSerializable {
    created_at_millis?: number;
    updated_at_millis?: number;
}

export default function Top({ novels }: { novels: INovelDataWithMillis[] }) {
    const [rootList] = useState(novels);
    const [empty] = useState(rootList.length === 0);
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
            <Header
                title={"Clara"}
                description={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogTitle={"Clara"}
                ogDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twTitle={"Clara"}
                twDescription={"Clara(クララ)は縦書き小説が執筆・閲覧できるサービスです。"}
                twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL}
                twCard="summary"
            />
            <div className="flex-center">
                <div className="w-full flex flex-col flex-center mt-4 mb-8">
                    <div className="container flex-center">
                        <div className="w-11/12 flex justify-center flex-wrap items-end editor-bg rounded">
                            {empty ? (
                                <div className="w-3/4 max-w-xl my-12 flex-center">
                                    <span className="text-xl gothic font-semibold opacity-40">まだ小説は投稿されていません</span>
                                </div>
                            ) : (
                                <>
                                    <NewNovelList borderNovelMillis={rootList[0].created_at_millis} />
                                    {displayList.map((novel, i) => (
                                        <div key={"novel-0" + i} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300">
                                            <div className="mb-4">
                                                <Link href={`/novel/${novel.id}`}>
                                                    <a className="text-2xl gothic font-semibold whitespace-pre-wrap opacity-75">{novel.title}</a>
                                                </Link>
                                            </div>
                                            <div className="flex flex-wrap items-center ml-0.5 mb-2">
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
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}

export const getStaticProps: GetStaticProps = async () => {
    const novels = await getAllNovel("desc");
    const serializablesWithMillis: INovelDataWithMillis[] = novels.map((novel) => {
        const c = (novel.created_at as firebase.firestore.Timestamp).toMillis();
        const u = (novel.updated_at as firebase.firestore.Timestamp).toMillis();
        const update = {
            created_at: getDisplayTime(c),
            updated_at: getDisplayTime(u),
            created_at_millis: c,
            updated_at_millis: u,
        };
        const m = Object.assign(novel, update) as INovelDataWithMillis;
        return m;
    });

    return {
        props: {
            novels: serializablesWithMillis,
        },
        revalidate: 1800,
    };
};
