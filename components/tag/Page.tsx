import { INovelProp } from "../../lib/firebase/initFirebase";

type Props = {
    tag: string;
    novels: INovelProp[];
};

const TagPage = ({ tag, novels }: Props) => (
    <div className="w-full pl-8 flex flex-col">
        <span className="mb-4">
            #{tag} の小説 {novels.length}件
        </span>
        {novels.map((novel) => (
            <span>{novel.title}</span>
        ))}
    </div>
);

export default TagPage;
