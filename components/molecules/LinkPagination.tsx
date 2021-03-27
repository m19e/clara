import Link from "next/link";

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
                    <Link href={`/page/${prev}`}>
                        <a>{"<"}</a>
                    </Link>
                    <Link href="/page/1">
                        <a>1</a>
                    </Link>
                </>
            )}
            {prev > 2 && <span>…</span>}
            {prev > 1 && (
                <Link href={`/page/${prev}`}>
                    <a>{prev}</a>
                </Link>
            )}
            <span className="border-b border-gray-400">{currentPage}</span>
            {next < pageCount && (
                <Link href={`/page/${next}`}>
                    <a>{next}</a>
                </Link>
            )}
            {pageCount - next > 1 && <span>…</span>}
            {currentPage != pageCount && (
                <>
                    <Link href={`/page/${pageCount}`}>
                        <a>{pageCount}</a>
                    </Link>
                    <Link href={`/page/${next}`}>
                        <a>{">"}</a>
                    </Link>
                </>
            )}
        </div>
    );
};

export default LinkPagination;
