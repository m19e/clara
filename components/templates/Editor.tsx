import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const DraftEditor = dynamic(() => import("components/organisms/DraftEditor"), { ssr: false });

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
