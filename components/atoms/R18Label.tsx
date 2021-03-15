type Props = {
    className: string;
};

const R18Label = ({ className }: Props) => (
    <span className={"text-sm font-semibold text-red-500 " + className} style={{ fontFamily: "sans-serif" }}>
        <span className="tracking-tighter">R18</span>
    </span>
);

export default R18Label;
