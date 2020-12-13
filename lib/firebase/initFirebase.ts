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
        const user = await auth.signInWithPopup(provider).then((res) => {
            console.log(0, res);
            const { uid, displayName, photoURL } = res.user;
            const userID = res.additionalUserInfo.username;
            db.collection("user").doc(userID).set({
                uid,
                displayName,
                photoURL,
                userID,
            });
        });
        console.log(1, user);
    } catch (error) {
        console.error("login failed", error);
    }
}

export async function logout() {
    try {
        const user = await auth.signOut();
        console.log(user);
    } catch (error) {
        console.error("login failed", error);
    }
}

export async function getUserData(id: string) {
    const query = db.collection("user").where("uid", "==", id);
    let result;
    try {
        const snapshot = await query.get();
        snapshot.forEach((doc) => {
            result = doc.data().userID;
        });
    } catch (error) {
        console.log(error);
    }
    return result;
}

export async function getEdittingDraftData(uid: string) {
    const id = await getUserData(uid);
    const userRef = db.collection("user").doc(id);
    const user = await userRef.get();
    const { editting } = user.data();
    console.log(editting);

    return editting;
}

export async function setEdittingDraftData(did, uid, draft: string) {
    const id = await getUserData(uid);
    const userRef = db.collection("user").doc(id);
    await userRef.update({ "editting.did": did, "editting.content": draft });
}

export async function createDraftData(uid, draft: string) {
    const id = await getUserData(uid);
    const userRef = db.collection("user").doc(id);
    const draftID = userRef.collection("draft").doc().id;
    await userRef.collection("draft").doc(draftID).set({ content: draft });
    // const docID = await userRef.set({ content: draft });
    return draftID;
}

export async function readDraftData(did, uid: string) {
    const id = await getUserData(uid);
    const draftRef = db.collection("user").doc(id).collection("draft").doc(did);
    const draft = await draftRef.get();
    const { content } = draft.data();
    return content;
}

export async function updateDraftData(did, uid, draft: string) {
    const id = await getUserData(uid);
    const userRef = db.collection("user").doc(id).collection("draft").doc(did);
    await userRef.update({ content: draft });
}
