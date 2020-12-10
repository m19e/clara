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
                        <div className="w-80 m-4">
                            <p>{novel.id}</p>
                            <p>{novel.author}</p>
                            <p>{novel.title}</p>
                            <p>{novel.description}</p>
                            <p>{novel.text}</p>
                            <p>{novel.charCount}</p>
                            <p>{novel.tags}</p>
                            <p>{novel.bookmarkCount}</p>
                            <p>{novel.visitCount}</p>
                            <p>{novel.created_at}</p>
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
