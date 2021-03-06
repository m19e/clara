import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback } from "react";

export const isMinchoState = atom({
    key: "editor/isMincho",
    default: true,
});

export const useIsMincho = (): [boolean, () => void] => {
    const [isMincho, setIsMincho] = useRecoilState(isMinchoState);
    const toggleFont = useCallback(() => {
        setIsMincho((prev) => !prev);
    }, []);

    return [isMincho, toggleFont];
};

export const pureFontSizeState = atom({
    key: "editor/pureFontSize",
    default: 7,
});

export const realFontSizeState = selector({
    key: "editor/realFontSize",
    get: ({ get }) => (get(pureFontSizeState) + 5) * 2,
});

export const getRealFontSize = (): number => {
    const rfs = useRecoilValue(realFontSizeState);
    return rfs;
};

export const useFontSize = (): [number, () => void, () => void] => {
    const [fSize, setFontSize] = useRecoilState(pureFontSizeState);
    const incFontSize = useCallback(() => {
        setFontSize((prev) => prev + 1);
    }, []);
    const decFontSize = useCallback(() => {
        setFontSize((prev) => prev - 1);
    }, []);

    return [fSize, incFontSize, decFontSize];
};

export const lineWordsState = atom({
    key: "editor/lineWords",
    default: 30,
});

export const useLineWords = (): [number, () => void, () => void] => {
    const [lineWords, setLineWords] = useRecoilState(lineWordsState);
    const incLineWords = useCallback(() => {
        setLineWords((prev) => prev + 1);
    }, []);
    const decLineWords = useCallback(() => {
        setLineWords((prev) => prev - 1);
    }, []);

    return [lineWords, incLineWords, decLineWords];
};

type FormatProps = {
    isMincho: boolean;
    fontSize: number;
    lineWords: number;
};

export const useFormat = (): (({ isMincho, fontSize, lineWords }: FormatProps) => void) => {
    const setIsMincho = useSetRecoilState(isMinchoState);
    const setFontSize = useSetRecoilState(pureFontSizeState);
    const setLineWords = useSetRecoilState(lineWordsState);

    const setFormatAll = useCallback(({ isMincho, fontSize, lineWords }: FormatProps) => {
        setIsMincho(isMincho);
        setFontSize(fontSize);
        setLineWords(lineWords);
    }, []);

    return setFormatAll;
};

export const wrapperHeightState = atom({
    key: "editor/wrapperHeight",
    default: 480,
});

export const useWrapperHeight = (): [number, (wh: number) => void] => {
    const [wh, setWh] = useRecoilState(wrapperHeightState);
    return [wh, setWh];
};

export const editorHeightState = selector({
    key: "editor/editorHeight",
    get: ({ get }) => get(realFontSizeState) * get(lineWordsState),
});

export const getEditorHeight = (): number => {
    const eh = useRecoilValue(editorHeightState);
    return eh;
};

const isDisabledIncFSState = selector({
    key: "editor/isDisabledIncFS",
    get: ({ get }) => {
        const rfs = get(realFontSizeState);
        return (rfs + 2) * get(lineWordsState) > get(wrapperHeightState) || rfs >= 48;
    },
});

const isDisabledDecFSState = selector({
    key: "editor/isDisabledDecFS",
    get: ({ get }) => get(realFontSizeState) <= 12,
});

const isDisabledIncLWState = selector({
    key: "editor/isDisabledIncLW",
    get: ({ get }) => {
        const lw = get(lineWordsState);
        return get(realFontSizeState) * (lw + 1) > get(wrapperHeightState) || lw >= 40;
    },
});

const isDisabledDecLWState = selector({
    key: "editor/isDisabledDecLW",
    get: ({ get }) => get(lineWordsState) <= 20,
});

export const useIsDisabled = (): boolean[] => {
    const isDisabledIncFS = useRecoilValue(isDisabledIncFSState);
    const isDisabledDecFS = useRecoilValue(isDisabledDecFSState);
    const isDisabledIncLW = useRecoilValue(isDisabledIncLWState);
    const isDisabledDecLW = useRecoilValue(isDisabledDecLWState);

    return [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW];
};

const isShowPublishModalState = atom({
    key: "editor/isShowPublishModal",
    default: false,
});

export const useIsShowPublishModal = (): [boolean, () => void] => {
    const [isShowPublishModal, setIsShowPublishModal] = useRecoilState(isShowPublishModalState);
    const toggleIsShowIsShowPublishModal = useCallback(() => {
        setIsShowPublishModal((prev) => !prev);
    }, []);

    return [isShowPublishModal, toggleIsShowIsShowPublishModal];
};
