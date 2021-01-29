import { useIsMincho, useIsShowPublishModal } from "../store/editor";
import { useIsTitleEdit } from "../store/draft";
import Header from "./EditorHeader";
import Footer from "./EditorFooter";

export default function Frame() {
    const [isMincho] = useIsMincho();
    const [isShowModal] = useIsShowPublishModal();
    const [isTitleEdit] = useIsTitleEdit();

    return (
        <div
            className={
                (isShowModal || isTitleEdit ? "" : "transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100") + (isMincho ? " mincho" : " gothic")
            }
        >
            <Footer />
            <Header />
        </div>
    );
}
