import { atom, useRecoilState } from "recoil";

export const titleState = atom({
    key: "draft/title",
    default: "無題",
});

export const useTitle = (): [string, (string) => void] => {
    const [title, setTitle] = useRecoilState(titleState);
    return [title, setTitle];
};

export const draftIDState = atom<string | null>({
    key: "draft/id",
    default: null,
});

export const useDraftID = (): [string, (string) => void] => {
    const [draftID, setDraftID] = useRecoilState(draftIDState);
    return [draftID, setDraftID];
};

export const draftContentState = atom({
    key: "draft/content",
    default: "",
});

export const useContent = (): [string, (string) => void] => {
    const [content, setContent] = useRecoilState(draftContentState);
    return [content, setContent];
};
