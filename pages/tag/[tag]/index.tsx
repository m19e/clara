import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { INovelProp } from "types";
import { getNovelsByTagName } from "lib/firebase/novel";
import TagPage from "components/templates/Tag";

type Props = {
    tag: string;
    novels: INovelProp[];
};

const TagIndex = ({ tag, novels }: Props) => <TagPage tag={tag} novels={novels} />;

export const getServerSideProps: GetServerSideProps = async ({ params }: GetServerSidePropsContext) => {
    const tag = typeof params.tag === "string" ? params.tag : "";
    const novels = await getNovelsByTagName(tag);

    return {
        props: {
            tag,
            novels,
        },
    };
};

export default TagIndex;
