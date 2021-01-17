import { GetStaticProps } from "next";
import { useRouter } from "next/router";
import { getAllNovelIDs, getNovel } from "../../../../lib/firebase/initFirebase";
import Loader from "../../../../components/Loader";

type NovelEditProps = {
    title: string;
    content: string;
};

export default function NovelEdit({ title, content }: NovelEditProps) {
    const router = useRouter();
    if (router.isFallback) {
        return (
            <div className="min-h-screen min-w-full flex-center">
                <Loader />
            </div>
        );
    }

    return (
        <div>
            <h1>{title}</h1>
            <h2>{content}</h2>
        </div>
    );
}

export const getStaticProps: GetStaticProps = async ({ params }: { params: { id: string } }) => {
    const novel = await getNovel(params.id);
    if (!novel) return { notFound: true };
    const { title, content } = novel;

    return {
        props: {
            title,
            content,
        },
        revalidate: 600,
    };
};

export const getStaticPaths = async () => {
    const ids = await getAllNovelIDs();

    return {
        paths: ids.map((id) => {
            return {
                params: {
                    id,
                },
            };
        }),
        fallback: true,
    };
};
