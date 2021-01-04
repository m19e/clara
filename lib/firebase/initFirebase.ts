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

export async function loginWithTwitter() {
    const provider = new firebase.auth.TwitterAuthProvider();
    try {
        const res = await auth.signInWithPopup(provider);
        const userDoc = await db.collection("user").doc(res.additionalUserInfo.username).get();
        if (!userDoc.exists) {
            await createUser(res);
        }
    } catch (error) {
        console.error("login failed", error);
    }
}

const createUser = async (res: firebase.auth.UserCredential) => {
    const { uid, displayName, photoURL } = res.user;
    const userID = res.additionalUserInfo.username;
    db.collection("user").doc(userID).set({
        uid,
        displayName,
        photoURL,
        userID,
    });
};

export async function logout() {
    try {
        const user = await auth.signOut();
        console.log(user);
    } catch (error) {
        console.error("login failed", error);
    }
}

export async function getUserData(uid: string) {
    const query = db.collection("user").where("uid", "==", uid);
    const snapshot = await query.get();
    const userData = snapshot.docs[0].data();

    return userData;
}

export async function getRecentDraftID(id: string) {
    const userRef = db.collection("user").doc(id);
    const user = await userRef.get();
    const { editting } = user.data();

    return editting;
}

export async function setRecentDraftID(did, id: string) {
    const userRef = db.collection("user").doc(id);
    await userRef.update({ recent: did });
}

export async function createDraftData(id, draft: string) {
    const userRef = db.collection("user").doc(id);
    const draftID = userRef.collection("draft").doc().id;
    await userRef.collection("draft").doc(draftID).set({ content: draft });
    // const docID = await userRef.set({ content: draft });
    return draftID;
}

export async function readDraftData(id, did: string) {
    const draftRef = db.collection("user").doc(id).collection("draft").doc(did);
    const draft = await draftRef.get();
    const { title, content } = draft.data();
    return { title, content };
}

export async function updateDraftData(did, id, draft: string) {
    const userRef = db.collection("user").doc(id).collection("draft").doc(did);
    await userRef.update({ content: draft });
}

export async function updateFormat(userID: string, isMincho: boolean, fontSize, lineWords: number) {
    const userRef = db.collection("user").doc(userID);
    await userRef.set({ isMincho, fontSize, lineWords }, { merge: true });
}

export async function updateDraftTitle(userID, did, newTitle: string) {
    const draftRef = db.collection("user").doc(userID).collection("draft").doc(did);
    await draftRef.set({ title: newTitle }, { merge: true });
}
