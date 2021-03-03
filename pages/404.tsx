import Head from "next/head";
import Layout from "../components/Layout";

export default function NotFound() {
    return (
        <Layout>
            <Head>
                <title>ページが見つかりません | Clara</title>
            </Head>
            <div className="flex-center" style={{ height: "calc(100vh - 4rem)" }}>
                <div className="flex items-center">
                    <div className="py-3 pr-5 mr-4 border-r border-gray-400">
                        <h1 className="text-2xl font-black">404</h1>
                    </div>
                    <div>
                        <span className="text-xs">ページが見つかりません</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
