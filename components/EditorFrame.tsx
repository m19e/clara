import { useIsMincho, useIsShowPublishModal } from "../store/editor";
import Header from "./EditorHeader";
import Footer from "./EditorFooter";

export default function Frame() {
    const [isMincho] = useIsMincho();
    const [isShowModal] = useIsShowPublishModal();

    return (
        <div className={(isShowModal ? "" : "transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100") + (isMincho ? " mincho" : " gothic")}>
            <Footer />
            <Header />
        </div>
    );
}
