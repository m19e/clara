import R18Label from "components/atoms/R18Label";

type Props = {
    r18: boolean;
    tags: string[];
};

const Editable = ({ r18, tags }: Props) => (
    <>
        {r18 && <R18Label className="mb-1.5 ml-1" />}
        {tags.map((tag, i) => (
            <span key={i} className="text-gray-600 text-sm leading-none border-gray-300  pb-2 mb-2 ml-1.5 border-b">
                {tag}
            </span>
        ))}
    </>
);

export default Editable;
