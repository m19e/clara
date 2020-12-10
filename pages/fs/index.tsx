import { GetStaticProps } from "next";
import { db } from "../../lib/firebase/initFirebase";
import firebase from "firebase/app";

type Props = {
    novels: any[];
};

const WithStaticProps = ({ novels }: Props) => {
    // console.log(novels);
    return (
        <div className="w-full h-full p-8">
            <h1>小説一覧</h1>
            <div className="flex flex-1 flex-wrap">
                {novels.map((novel, i) => (
                    <div key={i} className="flex">
                        {/* <p>{JSON.stringify(novel)}</p> */}
                        <div className="flex items-start m-4 p-4 border-b-2" style={{ width: "392px" }}>
                            <img src="http://via.placeholder.com/96x120" alt="表紙画像のplaceholder" />
                            <div className="mx-6">
                                {/* <p>{novel.id}</p> */}
                                {/* <p>{novel.author}</p> */}
                                <p>{novel.title}</p>
                                <div className="text-gray-400 flex items-center" style={{ fontSize: "12px" }}>
                                    {/* <p>{novel.charCount}</p> */}
                                    <p className="my-1">3500文字</p>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="icon icon-tabler icon-tabler-heart ml-1"
                                        width="12"
                                        height="12"
                                        viewBox="0 0 24 24"
                                        stroke-width="1.5"
                                        stroke="#9e9e9e"
                                        fill="currentcolor"
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                    >
                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                        <path d="M19.5 13.572l-7.5 7.428l-7.5 -7.428m0 0a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
                                    </svg>
                                    {/* <p>{novel.bookmarkCount}</p> */}
                                    <p>12</p>
                                </div>
                                {/* <p>{novel.tags}</p> */}
                                <div className="flex flex-wrap">
                                    {["アイドルマスターシャイニーカラーズ", "樋口円香", "福丸小糸", "まどこい"].map((tag, i) => (
                                        <p key={"00" + i} className="text-blue-400 mr-1" style={{ fontSize: "14px" }}>
                                            #{tag}
                                        </p>
                                    ))}
                                </div>
                                {/* <p>{novel.description}</p> */}
                                <p style={{ fontSize: "14px", width: "240px", height: "60px", textOverflow: "ellipsis" }}>
                                    これはキャプションですこれはキャプションですこれはキャプションですこれはキャプションですこれはキャプションですこれはキャプションです
                                </p>
                                {/* <p>{novel.text}</p> */}
                                {/* <p>{novel.visitCount}</p> */}
                                {/* <p>{novel.created_at}</p> */}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

const plainList = Array.from(new Array(20).keys()).map((i) => ++i);

const getDisplayTime = (milli: number): string => {
    const dt = new Date(milli);
    const y = dt.getFullYear() + "年";
    const m = dt.getMonth() + 1 + "月";
    const d = dt.getDate() + "日 ";
    const ho = ("00" + dt.getHours()).slice(-2) + ":";
    const mi = ("00" + dt.getMinutes()).slice(-2);
    return y + m + d + ho + mi;
};

export const getStaticProps: GetStaticProps = async () => {
    const novelsRef = db.collection("novels");
    const novelsRefOrdered = novelsRef.orderBy("created_at", "desc");

    // plainList.forEach((id) => {
    //     novelsRef.doc(`${id}`).set({
    //         id: "" + id,
    //         author: `小説${id}著者(参照予定)`,
    //         title: `小説${id}タイトル`,
    //         description: `小説${id}キャプション`,
    //         text: `小説${id}本文`,
    //         charCount: `小説${id}文字数(number)`,
    //         tags: [`小説${id}タグ-1`, `小説${id}タグ-3`, `小説${id}タグ-3`],
    //         bookmarkCount: `小説${id}ブックマーク数(number)`,
    //         visitCount: `小説${id}閲覧数(number)`,
    //         created_at: firebase.firestore.FieldValue.serverTimestamp(),
    //     });
    // });

    const snapShot = await novelsRefOrdered.get();
    const novels: any[] = [];

    // TODO: when first load, check `created_at` type, if type != number { update(created_at, timestamp.toMillis) }
    snapShot.forEach((doc) => {
        const data = doc.data();
        const update = { created_at: getDisplayTime((data.created_at as firebase.firestore.Timestamp).toMillis()) };

        novels.push(Object.assign(data, update));
    });

    return { props: { novels } };
};

export default WithStaticProps;
