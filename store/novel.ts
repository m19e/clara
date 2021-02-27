import { atom, useRecoilState } from "recoil";

const r18State = atom({
    key: "novel/r18",
    default: false,
});

export const useR18 = (): [boolean, (boolean) => void] => {
    const [r18, setR18] = useRecoilState(r18State);
    return [r18, setR18];
};

type UsedTag = { name: string; count: number };

const suggestsState = atom<UsedTag[]>({
    key: "novel/suggests",
    default: [],
});

export const useSuggests = (): [UsedTag[], (tags: UsedTag[]) => void] => {
    const [suggests, setSuggests] = useRecoilState(suggestsState);
    return [suggests, setSuggests];
};
