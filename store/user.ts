import { atom } from "recoil";

type UserProfile = {
    uid: string;
    displayName: string;
    photoURL: string;
    userID: string;
};

export const userProfileState = atom<UserProfile | null>({
    key: "userIDState",
    default: null,
});
