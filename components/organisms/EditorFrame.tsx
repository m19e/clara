import { useIsTitleEdit } from "store/draft";
import { useIsMincho, useIsShowPublishModal } from "store/editor";
import Header from "components/organisms/EditorHeader";
import Footer from "components/organisms/EditorFooter";

type Props = {
    loading: boolean;
};

const Frame = ({ loading }: Props) => {
    const [isMincho] = useIsMincho();
    const [isShowModal] = useIsShowPublishModal();
    const [isTitleEdit] = useIsTitleEdit();

    return (
        <div
            className={
                (loading || isShowModal || isTitleEdit ? "" : "transition-opacity duration-1000 ease-out opacity-0 hover:opacity-100") +
                (isMincho ? " mincho" : " gothic")
            }
        >
            <Header loading={loading} />
            <Footer />
        </div>
    );
};

export default Frame;
