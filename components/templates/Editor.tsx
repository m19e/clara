import { useRouter } from "next/router";
import DraftEditor from "components/organisms/DraftEditor";

type Props = {
    isMobile: boolean;
};

const Editor = ({ isMobile }: Props) => {
    const router = useRouter();
    if (isMobile) {
        router.push("/");
    }

    return <DraftEditor />;
};

export default Editor;
