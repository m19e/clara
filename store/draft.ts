import { atom, useRecoilState } from "recoil";

export const titleState = atom({
    key: "titleState",
    default: "無題",
});

export const useTitle = (): [string, (string) => void] => {
    const [title, setTitle] = useRecoilState(titleState);

    return [title, setTitle];
};