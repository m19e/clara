import { INovelProp } from "../../types";
import Header from "../../foundations/ClaraHeader";
import Layout from "../organisms/Layout";
import NovelListItem from "../molecules/NovelListItem";
import Pagination from "../atoms/Pagination";

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
                            {novels.map((novel) => (
                                <NovelListItem novel={novel} className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300" />
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
