import { atom, useRecoilState } from "recoil";

const r18State = atom({
    key: "novel/r18",
    default: false,
});

export const useR18 = (): [boolean, (boolean) => void] => {
    const [r18, setR18] = useRecoilState(r18State);
    return [r18, setR18];
};
