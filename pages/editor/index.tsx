import dynamic from "next/dynamic";

const DynamicEditor = dynamic(() => import("../../components/EditorStore"), { ssr: false });

export default function EditorIndex() {
    return <DynamicEditor />;
}
