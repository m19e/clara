import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { useUserAgent, UserAgent } from "next-useragent";
import EditorPage from "components/templates/Editor";

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
