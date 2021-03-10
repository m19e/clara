import { useState, useCallback } from "react";

type FontSize = "base" | "xl" | "2xl";

export const useFontSize = (fs: FontSize): [FontSize, () => void, () => void, () => void] => {
    const [fontSize, setFontSize] = useState(fs);
    const setFontBase = useCallback(() => {
        setFontSize("base");
    }, []);
    const setFontXl = useCallback(() => {
        setFontSize("xl");
    }, []);
    const setFont2xl = useCallback(() => {
        setFontSize("2xl");
    }, []);

    return [fontSize, setFontBase, setFontXl, setFont2xl];
};

type FontType = "mincho" | "gothic" | "mobile-serif" | "mobile-sans";

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
