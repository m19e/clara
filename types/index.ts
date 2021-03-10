import firebase from "firebase/app";

export type FirestoreFieldValue = firebase.firestore.FieldValue;
export type FirestoreTimestamp = firebase.firestore.Timestamp;

export interface INovelProp {
    id: string;
    title: string;
    content: string;
    tags: string[];
    r18: boolean;
    author_id: string;
    author_uid: string;
    author_name: string;
}

export interface INovelData extends INovelProp {
    created_at: FirestoreFieldValue;
    updated_at: FirestoreFieldValue;
}

export interface INovelDataSerializable extends INovelProp {
    created_at?: string;
    updated_at?: string;
}
