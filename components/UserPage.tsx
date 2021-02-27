import Link from "next/link";
import { useState, useEffect } from "react";
import Layout from "./Layout";
import Header from "./Header";
import { UserProfile, INovelDataSerializable } from "../lib/firebase/initFirebase";
import ListTags from "./ListTags";

const DISPLAY_NOVEL_SPAN = 3;

export default function UserPage({ user, novels }: { user: UserProfile; novels: INovelDataSerializable[] }) {
    const [rootList] = useState(novels);
    const [displayList, setDisplayList] = useState(novels.slice(0, DISPLAY_NOVEL_SPAN));
    const [hasMore, setHasMore] = useState(novels.length > DISPLAY_NOVEL_SPAN);

    useEffect(() => {
        setDisplayList(novels.slice(0, DISPLAY_NOVEL_SPAN));
    }, [user]);

    const displayMore = () => {
        const displayListLen = displayList.length;
        const moreItems = rootList.slice(0, displayListLen + DISPLAY_NOVEL_SPAN);
        if (moreItems.length === rootList.length) {
            setHasMore(false);
        }
        setDisplayList(moreItems);
    };

    return (
        <Layout>
            <Header
                title={`${user.displayName} | Clara`}
                description={"Clara"}
                ogTitle={`${user.displayName} | Clara`}
                ogDescription={"Clara"}
                ogImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twTitle={`${user.displayName} | Clara`}
                twDescription={"Clara"}
                twImage={process.env.NEXT_PUBLIC_SITE_ROOT_URL + "/icon-128x128.png"}
                twUrl={process.env.NEXT_PUBLIC_SITE_ROOT_URL + `/user/${user.userID}`}
                twCard="summary"
            />
            <div className="flex-center pt-16 pb-4 mt-72">
                <div className="container max-w-4xl mx-auto px-4">
                    <div className="flex flex-col min-w-0 break-words editor-bg w-full mb-6 rounded-lg -mt-64">
                        <div className="px-6">
                            <div className="flex flex-wrap justify-center">
                                <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                                    <div className="relative">
                                        <img
                                            alt={`${user.displayName}(@${user.userID})`}
                                            src={user.photoURL.replace(/_normal/, "")}
                                            className="shadow-xl rounded-full align-middle border-none absolute -m-16 -ml-20 lg:-ml-16"
                                            style={{ maxWidth: "150px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="text-center mt-28">
                                <h3 className="text-3xl font-semibold gothic leading-normal text-gray-800 mb-2">{user.displayName}</h3>
                                <div className="text-base leading-normal mt-0 mb-2 text-gray-500 font-bold">
                                    <div className="flex-center">
                                        <a className="flex-center" href={`https://twitter.com/${user.userID}`} target="_blank" rel="noopener noreferrer">
                                            <svg
                                                className="w-5 h-5 cursor-pointer"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 350 300"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M350.001,35.509 C346.026,42.167 340.649,49.197 333.870,56.595 C328.493,62.513 321.944,68.556 314.231,74.720 C314.231,74.720 314.231,76.940 314.231,76.940 C314.231,76.940 314.231,79.530 314.231,79.530 C314.231,80.762 314.346,81.626 314.579,82.119 C314.579,82.119 314.579,84.708 314.579,84.708 C314.579,110.109 310.022,135.572 300.903,161.097 C291.785,186.620 278.809,209.494 261.975,229.715 C243.971,251.417 222.113,268.556 196.394,281.134 C170.674,293.711 141.917,299.999 110.122,299.999 C89.546,299.999 70.142,297.041 51.904,291.122 C33.201,285.202 15.899,276.818 -0.001,265.967 C0.936,266.214 2.337,266.338 4.208,266.338 C7.948,266.831 10.755,267.077 12.626,267.077 C12.626,267.077 17.183,267.077 17.183,267.077 C33.550,267.077 49.567,264.242 65.231,258.569 C79.727,253.144 93.403,245.253 106.263,234.895 C91.300,234.649 77.387,229.469 64.531,219.357 C51.904,209.494 43.486,197.040 39.279,181.997 C42.786,182.737 45.007,183.105 45.943,183.105 C45.943,183.105 49.447,183.105 49.447,183.105 C50.151,183.352 51.202,183.476 52.605,183.476 C54.708,183.476 56.346,183.352 57.516,183.105 C59.853,183.105 63.128,182.612 67.335,181.626 C67.801,181.626 68.505,181.502 69.439,181.256 C70.376,181.009 71.075,180.887 71.542,180.887 C54.941,177.434 41.265,168.679 30.509,154.622 C19.520,140.565 14.029,124.536 14.029,106.534 C14.029,106.534 14.029,106.163 14.029,106.163 C14.029,106.163 14.029,105.794 14.029,105.794 C14.029,105.794 14.029,105.424 14.029,105.424 C18.471,108.383 23.615,110.603 29.460,112.082 C35.538,114.054 41.265,115.042 46.644,115.042 C36.354,107.644 28.640,98.642 23.497,88.038 C17.651,77.187 14.729,65.102 14.729,51.786 C14.729,44.388 15.546,37.729 17.183,31.810 C18.120,27.617 20.457,21.576 24.198,13.685 C42.435,37.358 64.177,55.854 89.429,69.172 C115.382,83.475 142.969,91.366 172.195,92.847 C171.494,87.667 171.145,84.832 171.145,84.339 C170.674,80.886 170.441,78.051 170.441,75.830 C170.441,54.868 177.456,36.989 191.483,22.193 C205.512,7.396 222.462,-0.002 242.337,-0.002 C252.623,-0.002 262.325,2.094 271.444,6.286 C280.562,10.971 288.394,16.891 294.942,24.042 C302.423,22.315 310.372,19.850 318.788,16.644 C325.803,13.931 333.051,10.232 340.532,5.547 C337.729,14.424 333.634,22.439 328.260,29.591 C322.179,36.989 315.751,42.907 308.969,47.347 C315.984,46.113 322.999,44.634 330.010,42.907 C335.388,41.428 342.052,38.961 350.001,35.509 Z"
                                                />
                                            </svg>
                                            <span className="ml-1">{user.userID}</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 border-t border-gray-300">
                                <div className="flex flex-col items-center justify-end">
                                    {novels.length === 0 ? (
                                        <div className="w-3/4 max-w-xl my-12">
                                            <span className="text-xl gothic font-semibold opacity-40">まだ小説は投稿されていません</span>
                                        </div>
                                    ) : (
                                        <>
                                            {displayList.map((novel, i) => (
                                                <div key={"novel-0" + i} className="w-3/4 max-w-xl mt-12 border-b border-solid border-gray-300">
                                                    <div className="flex justify-start mb-4">
                                                        <Link href={`/novel/${novel.id}`}>
                                                            <a className="text-2xl gothic font-semibold whitespace-pre-wrap text-left opacity-75">
                                                                {novel.title}
                                                            </a>
                                                        </Link>
                                                    </div>
                                                    <div className="flex flex-wrap items-center ml-0.5 mb-3">
                                                        <ListTags novel={novel} />
                                                    </div>
                                                    <div className="flex justify-end items-baseline">
                                                        <p className="text-sm opacity-50">{novel.created_at}</p>
                                                    </div>
                                                </div>
                                            ))}
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
                </div>
            </div>
        </Layout>
    );
}
