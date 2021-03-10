import Link from "next/link";
import { INovelProp } from "types";
import { getTextCharCount } from "lib/novel/tools";
import Header from "foundations/ClaraHeader";
import Layout from "components/organisms/Layout";
import TagList from "components/molecules/TagList/Horizontal";
import NovelListItem from "components/molecules/NovelListItem";

type Props = {
    tag: string;
    novels: INovelProp[];
};

const Tag = ({ tag, novels }: Props) => (
    <Layout>
        <Header
            title={`「${tag}」の小説一覧 | Clara`}
            description={"Clara"}
            ogTitle={`「${tag}」の小説一覧 | Clara`}
            ogDescription={"Clara"}
            ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
            twTitle={`「${tag}」の小説一覧 | Clara`}
            twDescription={"Clara"}
            twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
            twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL + `/tag/${encodeURIComponent(tag)}`}
            twCard="summary"
        />
        <div className="flex-center pb-4">
            <div className="container max-w-4xl mx-auto px-4">
                <div className="flex flex-center my-4 sm:my-6">
                    <div className="flex rounded-lg overflow-hidden whitespace-nowrap h-8 sm:h-12">
                        <div className="h-full flex-center editor-bg">
                            <span className="text-sm sm:text-2xl font-black sm:font-normal text-gray-500 sm:text-gray-700 px-1.5 sm:px-3">{tag}</span>
                        </div>
                        <div className="h-full flex-center bg-gray-400">
                            <span className="text-sm sm:text-xl text-gray-100 whitespace-nowrap px-1.5 sm:px-3">{novels.length}作品</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col min-w-0 break-words editor-bg w-full mb-6 px-6 rounded-lg">
                    <div className="flex flex-col items-center justify-end">
                        {novels.length === 0 ? (
                            <div className="flex-center my-12">
                                <span className="text-xl gothic font-semibold opacity-40">まだ小説は投稿されていません</span>
                            </div>
                        ) : (
                            <>
                                {novels.map((novel, i) => (
                                    <NovelListItem key={i} novel={novel} className="w-3/4 max-w-xl mt-12 border-b border-solid border-gray-300" />
                                ))}
                                <div className="w-full flex-center my-6 editor-bg"></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </Layout>
);

export default Tag;
