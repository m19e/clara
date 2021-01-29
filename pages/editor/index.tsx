import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("../../components/DraftEditor"), { ssr: false });

export default function EditorIndex() {
    return <DynamicEditor />;
}
