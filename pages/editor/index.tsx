import dynamic from "next/dynamic";
import React, { CSSProperties } from "react";
import VerticalEditor from "../../components/Vertical";
import Footer from "../../components/Footer";

const styles: { [key: string]: CSSProperties } = {
    wrapper: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
    },
    flexItem: {
        flex: 1,
    },
};

const DynamicVerticalEditor = dynamic(() => import("../../components/Vertical"), { ssr: false });

export default function EditorIndex() {
    return (
        <div style={styles.wrapper}>
            <div style={styles.flexItem}>
                <DynamicVerticalEditor />
                <Footer />
            </div>
        </div>
    );
}
