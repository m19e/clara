import { atom, selector, useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useCallback } from "react";

export const isMinchoState = atom({
    key: "isMinchoState",
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
    key: "pureFontSizeState",
    default: 7,
});

export const realFontSizeState = selector({
    key: "realFontSizeState",
    get: ({ get }) => (get(pureFontSizeState) + 5) * 2,
});

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
    key: "lineWordsState",
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
    key: "wrapperHeightState",
    default: 480,
});

export const editorHeightState = selector({
    key: "editorHeightState",
    get: ({ get }) => get(realFontSizeState) * get(lineWordsState),
});

const isDisabledIncFSState = selector({
    key: "isDisabledIncFSState",
    get: ({ get }) => {
        const rfs = get(realFontSizeState);
        return (rfs + 2) * get(lineWordsState) > get(wrapperHeightState) || rfs >= 48;
    },
});

const isDisabledDecFSState = selector({
    key: "isDisabledDecFSState",
    get: ({ get }) => get(realFontSizeState) <= 12,
});

const isDisabledIncLWState = selector({
    key: "isDisabledIncLWState",
    get: ({ get }) => {
        const lw = get(lineWordsState);
        return get(realFontSizeState) * (lw + 1) > get(wrapperHeightState) || lw >= 40;
    },
});

const isDisabledDecLWState = selector({
    key: "isDisabledDecLWState",
    get: ({ get }) => get(lineWordsState) <= 20,
});

export const useIsDisabled = (): boolean[] => {
    const isDisabledIncFS = useRecoilValue(isDisabledIncFSState);
    const isDisabledDecFS = useRecoilValue(isDisabledDecFSState);
    const isDisabledIncLW = useRecoilValue(isDisabledIncLWState);
    const isDisabledDecLW = useRecoilValue(isDisabledDecLWState);

    return [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW];
};
