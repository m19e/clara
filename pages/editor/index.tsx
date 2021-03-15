import dynamic from "next/dynamic";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import { useRouter } from "next/router";

const DynamicEditor = dynamic(() => import("../../components/DraftEditor"), { ssr: false });

const EditorIndex = ({ ua }: { ua: UserAgent }) => {
    const router = useRouter();
    if (ua.isMobile) {
        router.push("/");
    }

    return <DynamicEditor />;
};

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);

    return {
        props: {
            ua,
        },
    };
};

export default EditorIndex;
