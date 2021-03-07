import Link from "next/link";
import Layout from "../Layout";
import Header from "../Header";
import ListTags from "../ListTags";
import Pagination from "../atoms/Pagination";
import { INovelProp } from "../../lib/firebase/initFirebase";
import { getTextCharCount } from "../../lib/novel/tools";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage?: number;
};

const TopPage = ({ novels, pageCount, initialPage = 0 }: Props) => {
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
                            {novels.map((novel, i) => (
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
                            <div className="w-3/4 xl:max-w-lg xl:mx-8 2xl:max-w-xl"></div>
                            <div className="w-full flex-center my-8 editor-bg">
                                <Pagination pageCount={pageCount} initialPage={initialPage} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default TopPage;
