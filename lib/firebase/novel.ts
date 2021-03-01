import { db, getNovel, INovelProp } from "./initFirebase";

type RootNovelInfo = {
    ids: string[];
};

// Admin
export const saveAllNovelID = async () => {
    const allNovel = await db.collection("novel").orderBy("created_at", "desc").get();
    const allNovelID = allNovel.docs.map((doc) => doc.id);
    await db.collection("root").doc("novel").set({ ids: allNovelID }, { merge: true });
};

// User
export const getRootNovelIDs = async (): Promise<string[]> => {
    const rootNovelInfo = await db.collection("root").doc("novel").get();
    const { ids } = rootNovelInfo.data() as RootNovelInfo;
    return ids;
};

export const setRootNovelIDs = async (newIds: string) => {
    await db.collection("root").doc("novel").set({ ids: newIds }, { merge: true });
};

export const getNovelsByIDs = async (ids: string[]): Promise<INovelProp[]> => {
    const datas = await Promise.all(ids.map(async (id) => await getNovel(id)));
    const novels = datas.map((d) => {
        const { created_at, updated_at, ...novelProp } = d;
        return novelProp;
    });
    return novels;
};
