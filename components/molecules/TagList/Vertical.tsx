import { INovelProp } from "types";
import R18Label from "components/atoms/R18Label";
import TagListItem from "components/atoms/TagListItem";

type Props = {
    novel: INovelProp;
};

const Vertical = ({ novel }: Props) => {
    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;

    return (
        <>
            {r18 && <R18Label className="mb-1.5 ml-1" />}
            {tags.map((tag, i) => (
                <TagListItem key={i} tag={tag} className="pb-2 mb-2 ml-1.5 border-b" />
            ))}
        </>
    );
};

export default Vertical;
