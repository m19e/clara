import dynamic from "next/dynamic";
import EditorStore from "../../components/EditorStore";

const DynamicStoreEditor = dynamic(() => import("../../components/EditorStore"), { ssr: false });

export default function StoreEditorIndex() {
    return <DynamicStoreEditor />;
}
