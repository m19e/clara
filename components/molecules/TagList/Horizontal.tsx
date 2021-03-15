import { INovelProp } from "types";
import R18Label from "components/atoms/R18Label";
import TagListItem from "components/atoms/TagListItem";

type Props = {
    novel: INovelProp;
};

const Horizontal = ({ novel }: Props) => {
    const tags = "tags" in novel ? novel.tags : [];
    const r18 = "r18" in novel ? novel.r18 : false;

    return (
        <>
            {r18 && <R18Label className="mr-1.5 -mt-1" />}
            {tags.map((tag, i) => (
                <TagListItem key={i} tag={tag} className="pr-2 mr-2 mb-1.5 border-r" />
            ))}
        </>
    );
};

export default Horizontal;
