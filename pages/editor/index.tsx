import dynamic from "next/dynamic";
import React, { CSSProperties } from "react";

const styles: { [key: string]: CSSProperties } = {
    wrapper: {
        // minHeight: "100vh",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    flexItem: {
        flex: 1,
    },
};

const DynamicVerticalEditor = dynamic(() => import("../../components/Vertical"), { ssr: false });

export default function EditorIndex() {
    return <DynamicVerticalEditor />;
}
