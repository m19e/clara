import { INovelProp } from "types";
import Header from "foundations/ClaraHeader";
import Layout from "components/organisms/Layout";
import NovelList from "components/molecules/NovelList";
import LinkedPagination from "components/molecules/LinkPagination";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    currentPage: number;
};

const Top = ({ novels, pageCount, currentPage }: Props) => {
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
                        <div className="w-11/12 pt-12 xl:px-12 flex-center flex-col editor-bg rounded">
                            <NovelList novels={novels} />
                            <div className="w-full flex-center my-8 editor-bg">
                                <LinkedPagination currentPage={currentPage + 1} pageCount={pageCount} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Top;
