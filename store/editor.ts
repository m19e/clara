import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import { useCallback } from "react";

const pureFontSizeState = atom({
    key: "pureFontSizeState",
    default: 6,
});

export const realFontSizeState = selector({
    key: "realFtonSizeState",
    get: ({ get }) => get(pureFontSizeState) * 4,
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

export const useLineWords = () => {
    const [lineWords, setLineWords] = useRecoilState(lineWordsState);
    const incLineWords = useCallback(() => {
        setLineWords((prev) => prev + 1);
    }, []);
    const decLineWords = useCallback(() => {
        setLineWords((prev) => prev - 1);
    }, []);

    return [lineWords, incLineWords, decLineWords];
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
        return (rfs + 4) * get(lineWordsState) > get(wrapperHeightState) || rfs >= 48;
    },
});

const isDisabledDecFSState = selector({
    key: "isDisabledDecFSState",
    get: ({ get }) => get(realFontSizeState) <= 16,
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

export const useIsDisabled = () => {
    const isDisabledIncFS = useRecoilValue(isDisabledIncFSState);
    const isDisabledDecFS = useRecoilValue(isDisabledDecFSState);
    const isDisabledIncLW = useRecoilValue(isDisabledIncLWState);
    const isDisabledDecLW = useRecoilValue(isDisabledDecLWState);

    return [isDisabledIncFS, isDisabledDecFS, isDisabledIncLW, isDisabledDecLW];
};
