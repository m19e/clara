import Link from "next/link";
import { INovelProp } from "../../lib/firebase/initFirebase";
import { getTextCharCount } from "../../lib/novel/tools";
import Layout from "../Layout";
import ListTags from "../ListTags";

type Props = {
    tag: string;
    novels: INovelProp[];
};

const TagPage = ({ tag, novels }: Props) => (
    <Layout>
        <div className="flex-center pb-4">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="flex flex-center my-8">
                    <div className="flex rounded-lg overflow-hidden whitespace-nowrap h-12">
                        <div className="h-full flex-center editor-bg">
                            <span className="sm:text-2xl font-black sm:font-normal text-gray-600 sm:text-gray-700 px-3">{tag}</span>
                        </div>
                        <div className="h-full flex-center bg-gray-400">
                            <span className="sm:text-xl text-gray-100 whitespace-nowrap px-3">{novels.length}件</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col min-w-0 break-words editor-bg w-full mb-6 px-6 rounded-lg">
                    <div className="flex flex-col items-center justify-end">
                        {novels.length === 0 ? (
                            <div className="w-3/4 max-w-xl my-12">
                                <span className="text-xl gothic font-semibold opacity-40">まだ小説は投稿されていません</span>
                            </div>
                        ) : (
                            <>
                                {novels.map((novel, i) => (
                                    <div key={"novel-0" + i} className="w-3/4 max-w-xl mt-12 border-b border-solid border-gray-300">
                                        <div className="flex justify-start mb-3">
                                            <Link href={`/novel/${novel.id}`}>
                                                <a className="text-2xl gothic font-semibold whitespace-pre-wrap text-left opacity-75">{novel.title}</a>
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
                        <div className="w-full flex-center my-6 editor-bg"></div>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default TagPage;
