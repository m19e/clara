import { atom, useRecoilState } from "recoil";

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

export const useProfile = (): [UserProfile, (UserProfile) => void] => {
    const [profile, setProfile] = useRecoilState(userProfileState);
    return [profile, setProfile];
};
