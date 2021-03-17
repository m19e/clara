import { atom, useRecoilState } from "recoil";
import { useCallback } from "react";

export const titleState = atom({
    key: "draft/title",
    default: "無題",
});

export const useTitle = (): [string, (s: string) => void] => {
    const [title, setTitle] = useRecoilState(titleState);
    return [title, setTitle];
};

export const draftIDState = atom<string | null>({
    key: "draft/id",
    default: null,
});

export const useDraftID = (): [string, (s: string) => void] => {
    const [draftID, setDraftID] = useRecoilState(draftIDState);
    return [draftID, setDraftID];
};

export const draftContentState = atom({
    key: "draft/content",
    default: "",
});

export const useContent = (): [string, (s: string) => void] => {
    const [content, setContent] = useRecoilState(draftContentState);
    return [content, setContent];
};

export const isTitleEditState = atom({
    key: "draft/isTitleEdit",
    default: false,
});

export const useIsTitleEdit = (): [boolean, () => void] => {
    const [isTitleEdit, setIsTitleEdit] = useRecoilState(isTitleEditState);
    const toggleIsTitleEdit = useCallback(() => {
        setIsTitleEdit((prev) => !prev);
    }, []);
    return [isTitleEdit, toggleIsTitleEdit];
};
