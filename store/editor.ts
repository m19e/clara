import { atom, selector, useRecoilState } from "recoil";
import { useCallback } from "react";

const pureFontSizeState = atom({
    key: "pureFontSizeState",
    default: 6,
});

export const realFontSizeState = selector({
    key: "realFtonSizeState",
    get: ({ get }) => get(pureFontSizeState) * 8,
});

export const useFontSize = () => {
    const [fSize, setFontSize] = useRecoilState(pureFontSizeState);
    const incFontSize = useCallback(() => {
        setFontSize((prev) => prev + 1);
    }, []);
    const decFontSize = useCallback(() => {
        setFontSize((prev) => prev - 1);
    }, []);

    return [fSize, incFontSize, decFontSize];
};
