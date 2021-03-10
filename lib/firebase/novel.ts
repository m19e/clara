import { INovelData, INovelProp } from "types";
import { db } from "./initFirebase";

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
export const getNovel = async (id: string): Promise<INovelData | null> => {
    const snapshot = await db.collection("novel").doc(id).get();
    if (!snapshot.exists) return null;
    const novel = snapshot.data() as INovelData;
    return novel;
};

export const getRootNovelIDs = async (): Promise<string[]> => {
    const rootNovelInfo = await db.collection("root").doc("novel").get();
    const { infos } = rootNovelInfo.data() as RootNovelInfo;
    const ids = infos.map((info) => info.id);
    return ids;
};

export const getRootNovelInfos = async () => {
    const rootNovelInfo = await db.collection("root").doc("novel").get();
    const { infos } = rootNovelInfo.data() as RootNovelInfo;
    return infos;
};

export const setRootNovelInfos = async (newInfos: { id: string; tags: string[] }[]) => {
    await db.collection("root").doc("novel").set({ infos: newInfos }, { merge: true });
};

export const getNovelsByIDs = async (ids: string[]): Promise<INovelProp[]> => {
    const datas = await Promise.all(ids.map(async (id) => await getNovel(id)));
    const filtered = datas.filter((d) => d !== null);
    const novels = filtered.map((d) => {
        const { created_at, updated_at, ...novelProp } = d;
        return novelProp;
    });
    return novels;
};

export const getNovelsByTagName = async (tag: string): Promise<INovelProp[]> => {
    if (tag === "") return [];
    const infos = await getRootNovelInfos();
    const filteredByTag = infos.filter((info) => info.tags.includes(tag));
    if (filteredByTag.length === 0) return [];
    const ids = filteredByTag.map((info) => info.id);
    const novels = await getNovelsByIDs(ids);
    return novels;
};
