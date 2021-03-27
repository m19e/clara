type Props = {
    currentPage: number;
    pageCount: number;
};

const LinkPagination = ({ currentPage, pageCount }: Props) => {
    const prev = currentPage - 1;
    const next = currentPage + 1;

    return (
        <div className="inline-flex gap-2">
            {currentPage != 1 && <span>1</span>}
            {prev > 1 && <span>{prev}</span>}
            {currentPage != 1 && currentPage !== pageCount && <span>{currentPage}</span>}
            {next < pageCount && <span>{next}</span>}
            {currentPage != pageCount && <span>{pageCount}</span>}
        </div>
    );
};

export default LinkPagination;
