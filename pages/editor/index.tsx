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

export default function EditorIndex() {
    return (
        <div style={styles.wrapper}>
            <div style={styles.flexItem}>
                <VerticalEditor />
                <Footer />
            </div>
        </div>
    );
}
