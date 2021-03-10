import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const config = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
};

if (!firebase.apps.length) {
    firebase.initializeApp(config);
}

export const db = firebase.firestore();
export const auth = firebase.auth();

type UserTwitterProfile = {
    name: string;
    screen_name: string;
    profile_image_url_https: string;
};

export async function loginWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    try {
        const res = await auth.signInWithPopup(provider);
        const userDoc = await db.collection("user").doc(res.user.uid).get();
        if (userDoc.exists) {
            const { displayName, userID, uid } = userDoc.data();
            const { name, screen_name, profile_image_url_https } = res.additionalUserInfo.profile as UserTwitterProfile;
            if (displayName !== name || userID !== screen_name) {
                const allUserNovel = await db.collection("novel").where("author_uid", "==", uid).get();
                await allUserNovel.forEach((snapshot) => snapshot.ref.set({ author_name: name, author_id: screen_name }, { merge: true }));
            }
            await auth.currentUser.updateProfile({ displayName: name, photoURL: profile_image_url_https });
            await updateUser(res);
        } else {
            await createUser(res);
        }
    } catch (error) {
        console.error("login failed", error);
    }
}

const createUser = async (res: firebase.auth.UserCredential) => {
    const { uid, displayName, photoURL } = res.user;
    const userID = res.additionalUserInfo.username;
    const userRef = db.collection("user").doc(uid);
    await userRef.set({
        uid,
        displayName,
        photoURL,
        userID,
    });
    await updateFormat(uid, true, 7, 30);
    const draftRef = userRef.collection("draft").doc();
    const draftID = draftRef.id;
    await draftRef.set({ title: "無題", content: "執筆を始める" });
    await userRef.set({ recent: draftID }, { merge: true });
};

const updateUser = async (res: firebase.auth.UserCredential) => {
    const { uid, displayName, photoURL } = res.user;
    const userID = res.additionalUserInfo.username;
    await db.collection("user").doc(uid).set(
        {
            displayName,
            userID,
            photoURL,
        },
        { merge: true }
    );
};

export async function logout() {
    try {
        await auth.signOut();
    } catch (error) {
        console.error("login failed", error);
    }
}

export type UserProfile = {
    uid: string;
    displayName: string;
    photoURL: string;
    userID: string;
};

export async function getUserDataByUID(uid: string) {
    const query = db.collection("user").doc(uid);
    const snapshot = await query.get();
    const userData = snapshot.data();

    return userData;
}

export async function getUserDataByID(id: string): Promise<UserProfile | null> {
    const query = db.collection("user").where("userID", "==", id);
    const userDocs = await query.get();
    if (userDocs.size === 0) return null;
    const userData = userDocs.docs[0].data() as UserProfile;

    return userData;
}

export async function getAllUserID() {
    const snapshot = await db.collection("user").get();
    const ids = snapshot.docs.map((doc) => (doc.data() as UserProfile).userID);
    return ids;
}

export async function getRecentDraftID(id: string) {
    const userRef = db.collection("user").doc(id);
    const user = await userRef.get();
    const { recent } = user.data();

    return recent;
}

export async function setRecentDraftID(did, id: string) {
    const userRef = db.collection("user").doc(id);
    await userRef.update({ recent: did });
}

export async function createDraftData(id: string) {
    const userRef = db.collection("user").doc(id);
    const draftID = userRef.collection("draft").doc().id;
    await userRef.collection("draft").doc(draftID).set({ title: "無題", content: "執筆を始める" });
    await setRecentDraftID(draftID, id);
}

export async function readDraftData(uid, did: string) {
    const draftRef = db.collection("user").doc(uid).collection("draft").doc(did);
    const draft = await draftRef.get();
    const { title, content } = draft.data();
    return { title, content };
}

export async function updateDraftData(did, uid, draft: string) {
    const userRef = db.collection("user").doc(uid).collection("draft").doc(did);
    await userRef.update({ content: draft });
}

export async function updateFormat(uid: string, isMincho: boolean, fontSize, lineWords: number) {
    const userRef = db.collection("user").doc(uid);
    await userRef.set({ isMincho, fontSize, lineWords }, { merge: true });
}

export async function updateDraftTitle(uid, did, newTitle: string) {
    const draftRef = db.collection("user").doc(uid).collection("draft").doc(did);
    await draftRef.set({ title: newTitle }, { merge: true });
}

export const setUsedTags = async (uid: string, used_tags: { name: string; count: number }[]) => {
    const userRef = db.collection("user").doc(uid);
    await userRef.set({ used_tags }, { merge: true });
};

export interface INovelProp {
    id: string;
    title: string;
    content: string;
    tags: string[];
    r18: boolean;
    author_id: string;
    author_uid: string;
    author_name: string;
}

export interface INovelData extends INovelProp {
    created_at: firebase.firestore.FieldValue;
    updated_at: firebase.firestore.FieldValue;
}

export interface INovelDataSerializable extends INovelProp {
    created_at?: string;
    updated_at?: string;
}

export async function publishNovel(novel: INovelProp) {
    const novelData: INovelData = Object.assign(novel, {
        created_at: firebase.firestore.FieldValue.serverTimestamp(),
        updated_at: firebase.firestore.FieldValue.serverTimestamp(),
    });
    await db.collection("novel").doc(novel.id).set(novelData);
}

export async function getAllNovelIDs(): Promise<string[]> {
    const snapshot = await db.collection("novel").get();
    const ids = snapshot.docs.map((doc) => doc.id);
    return ids;
}

export async function getAllNovel(sort: "desc" | "asc"): Promise<INovelData[]> {
    const snapshot = await db.collection("novel").orderBy("created_at", sort).get();
    const novels = snapshot.docs.map((doc) => doc.data() as INovelData);
    return novels;
}

export async function getNewNovels(millis: number): Promise<INovelProp[]> {
    const localFirstNovelCreatedAt = firebase.firestore.Timestamp.fromMillis(millis);
    const novels = await db.collection("novel").where("created_at", ">", localFirstNovelCreatedAt).orderBy("created_at", "desc").get();
    if (novels.size === 0) return [];
    const novelsData = novels.docs.map((doc) => doc.data() as INovelProp);
    return novelsData;
}

export async function getNovel(id: string): Promise<INovelData | null> {
    const snapshot = await db.collection("novel").doc(id).get();
    if (!snapshot.exists) return null;
    const novel = snapshot.data() as INovelData;
    return novel;
}

export async function updateNovel(id: string, title: string, content: string, tags: string[], r18: boolean) {
    const novelRef = db.collection("novel").doc(id);
    await novelRef.set({ title, content, tags, r18, updated_at: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
}

export async function deleteNovel(id: string) {
    const novelRef = db.collection("novel").doc(id);
    await novelRef.delete();
}

export async function getAllUserNovelByUID(uid: string, sort: "desc" | "asc"): Promise<INovelData[]> {
    const snapshot = await db.collection("novel").where("author_uid", "==", uid).orderBy("created_at", sort).get();
    const novels = snapshot.docs.map((doc) => doc.data() as INovelData);
    return novels;
}
