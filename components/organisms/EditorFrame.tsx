import { useIsTitleEdit } from "store/draft";
import { useIsMincho, useIsShowPublishModal } from "store/editor";
import Header from "components/organisms/EditorHeader";
import Footer from "../EditorFooter";

const Frame = () => {
    const [isMincho] = useIsMincho();
    const [isShowModal] = useIsShowPublishModal();
    const [isTitleEdit] = useIsTitleEdit();

    // TODO: Use group hover
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
};

export default Frame;
