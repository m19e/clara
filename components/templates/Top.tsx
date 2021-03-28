import { INovelProp } from "types";
import Header from "foundations/ClaraHeader";
import Layout from "components/organisms/Layout";
import NovelListItem from "components/molecules/NovelListItem";
import Pagination from "components/atoms/Pagination";
import NovelList from "components/molecules/NovelList";

type Props = {
    novels: INovelProp[];
    pageCount: number;
    initialPage?: number;
};

const Top = ({ novels, pageCount, initialPage = 0 }: Props) => {
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
                        <NovelList novels={novels} pageCount={pageCount} initialPage={initialPage} />
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Top;
