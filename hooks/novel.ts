import { useState, useCallback } from "react";

export type FontSize = "text-base" | "text-xl" | "text-2xl";

export const useFontSize = (fs: FontSize): [FontSize, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const setFontBase = useCallback(() => {
        setFontSize("text-base");
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("text-xl");
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("text-2xl");
    }, []);

    return [fontSize, setFontBase, setFontXl, setFont2xl];
};

export const useFormat = (fs: FontSize, rfs: 16 | 20 | 24): [FontSize, 16 | 20 | 24, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const [realFontSize, setRealFontSize] = useState(rfs);
    const setFontBase = useCallback(() => {
        setFontSize("text-base");
        setRealFontSize(16);
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("text-xl");
        setRealFontSize(20);
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("text-2xl");
        setRealFontSize(24);
    }, []);

    return [fontSize, realFontSize, setFontBase, setFontXl, setFont2xl];
};

export type FontType = "mincho" | "gothic" | "mobile-serif" | "mobile-sans";

export const useFont = (isMobile: boolean): [FontType, () => void, () => void] => {
    const f: FontType = isMobile ? "mobile-serif" : "mincho";
    const [font, setFont] = useState<FontType>(f);
    const setMincho = useCallback(() => {
        isMobile ? setFont("mobile-serif") : setFont("mincho");
    }, []);
    const setGothic = useCallback(() => {
        isMobile ? setFont("mobile-sans") : setFont("gothic");
    }, []);

    return [font, setMincho, setGothic];
};
