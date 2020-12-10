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
            db.collection("users").doc(res.additionalUserInfo.username).set({
                uid: res.user.uid,
                displayName: res.user.displayName,
                photoURL: res.user.photoURL,
                userID: res.additionalUserInfo.username,
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
