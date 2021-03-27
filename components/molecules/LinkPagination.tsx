type Props = {
    currentPage: number;
    pageCount: number;
};

const LinkPagination = ({ currentPage, pageCount }: Props) => {
    const prev = currentPage - 1;
    const next = currentPage + 1;

    return (
        <div className="inline-flex gap-2 mt-2">
            {currentPage != 1 && (
                <>
                    <span>{"<"}</span>
                    <span>1</span>
                </>
            )}
            {prev > 2 && <span>…</span>}
            {prev > 1 && <span>{prev}</span>}
            <span className="border-b border-gray-400">{currentPage}</span>
            {next < pageCount && <span>{next}</span>}
            {pageCount - next > 1 && <span>…</span>}
            {currentPage != pageCount && (
                <>
                    <span>{pageCount}</span>
                    <span>{">"}</span>
                </>
            )}
        </div>
    );
};

export default LinkPagination;
