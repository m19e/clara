import { useState } from "react";
import Layout from "../components/Layout";

export default function Top() {
    const [rootList] = useState([...Array(100)]);
    const [displayList, setDisplayList] = useState(rootList.slice(0, 20));
    const [hasMore, setHasMore] = useState(rootList.length > 10);

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
                            {displayList.map((_, i) => (
                                <div className="w-3/4 mt-12 xl:max-w-lg xl:mx-8 2xl:max-w-xl border-b border-solid border-gray-300">
                                    <p className="text-2xl font-semibold whitespace-pre-wrap opacity-75">小説{i + 1}のタイトル</p>
                                    <div className="flex justify-between mt-1 items-baseline">
                                        <p className="opacity-75">小説の作者</p>
                                        <p className="text-sm opacity-50">小説の文字数</p>
                                    </div>
                                </div>
                            ))}
                            <div className="w-full max-w-xl mx-8"></div>
                            {hasMore && (
                                <div className="w-full flex-center my-8 editor-bg">
                                    <button
                                        className="gothic text-gray-500 bg-transparent border border-solid border-gray-500 transition-all hover:bg-gray-400 hover:border-gray-400 hover:text-white font-bold text-sm px-4 py-2 rounded outline-none focus:outline-none"
                                        type="button"
                                        onClick={() => displayMore()}
                                    >
                                        もっと見る
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
