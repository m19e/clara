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
            result = doc.data();
        });
    } catch (error) {
        console.log(error);
    }
    return result;
}

export async function createDraftData(uid, draft: string) {
    const id = await getUserData(uid);
    const userRef = db.collection("user").doc(id).collection("draft");
    const docID = await userRef.add({ content: draft }).then((docRef) => {
        return docRef.id;
    });
    return docID;
}
