import dynamic from "next/dynamic";

const DynamicStoreEditor = dynamic(() => import("../../components/EditorStore"), { ssr: false });

export default function StoreEditorIndex() {
    return <DynamicStoreEditor />;
}
