import { db, getNovel, INovelProp } from "./initFirebase";

export const PER_PAGE = 10;

type RootNovelInfo = {
    infos: {
        id: string;
        tags: string[];
    }[];
};

// Admin
export const saveAllNovelInfo = async () => {
    const allNovel = await db.collection("novel").orderBy("created_at", "desc").get();
    const allNovelInfo = allNovel.docs.map((doc) => {
        const novel = doc.data() as INovelProp;
        const tags = "tags" in novel ? novel.tags : [];
        return { id: doc.id, tags };
    });
    await db.collection("root").doc("novel").set({ infos: allNovelInfo }, { merge: true });
};

// User
export const getRootNovelIDs = async (): Promise<string[]> => {
    const rootNovelInfo = await db.collection("root").doc("novel").get();
    const { infos } = rootNovelInfo.data() as RootNovelInfo;
    const ids = infos.map((info) => info.id);
    return ids;
};

export const setRootNovelInfos = async (newInfos: { id: string; tags: string[] }[]) => {
    await db.collection("root").doc("novel").set({ infos: newInfos }, { merge: true });
};

export const getNovelsByIDs = async (ids: string[]): Promise<INovelProp[]> => {
    const datas = await Promise.all(ids.map(async (id) => await getNovel(id)));
    const novels = datas.map((d) => {
        const { created_at, updated_at, ...novelProp } = d;
        return novelProp;
    });
    return novels;
};
