import firebase from "firebase/app";

export const getTextCharCount = (text: string): number => {
    const regex = /(?:\r\n|\r|\n)/g;
    const cleanString = text.replace(regex, "").trim();
    return Array.from(cleanString).length;
};

export const createDisplayTimeFromTimestamp = (fv: firebase.firestore.FieldValue): string => {
    const timestamp = fv as firebase.firestore.Timestamp;
    const millis = timestamp.toMillis();
    const displayTime = getDisplayTime(millis);
    return displayTime;
};

export const getDisplayTime = (milli: number): string => {
    const dt = new Date(milli + 32400000);
    const y = dt.getFullYear() + "/";
    const m = dt.getMonth() + 1 + "/";
    const d = dt.getDate() + " ";
    const ho = ("00" + dt.getHours()).slice(-2) + ":";
    const mi = ("00" + dt.getMinutes()).slice(-2);
    return y + m + d + ho + mi;
};

type UsedTag = {
    name: string;
    count: number;
};

export const unifyUsedTags = (rootTags: UsedTag[], oldTags: string[], newTags: string[]) => {
    const removed = oldTags.filter((tag) => !newTags.includes(tag));
    const added = newTags.filter((tag) => !oldTags.includes(tag));

    const unified = rootTags
        .map((tagInfo) => {
            if (removed.includes(tagInfo.name)) {
                const update = { name: tagInfo.name, count: tagInfo.count - 1 };
                return update;
            }
            if (added.includes(tagInfo.name)) {
                const update = { name: tagInfo.name, count: tagInfo.count + 1 };
                return update;
            }
            return tagInfo;
        })
        .filter((tagInfo) => tagInfo.count > 0);

    const rootTagsNames = rootTags.map((tagInfo) => tagInfo.name);
    const filteredNewTags = newTags.filter((tag) => !rootTagsNames.includes(tag)).map((tag) => Object.assign({}, { name: tag, count: 1 }));
    const newRootTags = unified.concat(filteredNewTags);

    return newRootTags;
};
