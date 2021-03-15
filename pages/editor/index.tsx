import { GetServerSideProps, GetServerSidePropsContext } from "next";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { useUserAgent, UserAgent } from "next-useragent";
import EditorPage from "components/templates/Editor";

const DynamicEditor = dynamic(() => import("../../components/DraftEditor"), { ssr: false });

const EditorIndex = ({ ua }: { ua: UserAgent }) => <EditorPage isMobile={ua.isMobile} />;

export const getServerSideProps: GetServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const ua = useUserAgent(req.headers["user-agent"]);

    return {
        props: {
            ua,
        },
    };
};

export default EditorIndex;
