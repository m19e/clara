export const getTextCharCount = (text: string): number => {
    const regex = /(?:\r\n|\r|\n)/g; // new line, carriage return, line feed
    const cleanString = text.replace(regex, "").trim(); // replace above characters w/ nothing
    return Array.from(cleanString).length;
};

export const getDisplayTime = (milli: number): string => {
    const dt = new Date(milli);
    const y = dt.getFullYear() + "/";
    const m = dt.getMonth() + 1 + "/";
    const d = dt.getDate() + " ";
    const ho = ("00" + dt.getHours()).slice(-2) + ":";
    const mi = ("00" + dt.getMinutes()).slice(-2);
    return y + m + d + ho + mi;
};
