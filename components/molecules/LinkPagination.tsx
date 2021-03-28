import Link from "next/link";

const Chevron = ({ prev }: { prev: boolean }) => (
    <div className="w-6 h-6 mx-0.5 flex-center rounded transition-colors text-gray-400 hover:text-gray-600 bg-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={prev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
    </div>
);

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
                        <a>
                            <Chevron prev />
                        </a>
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
                        <a>
                            <Chevron prev={false} />
                        </a>
                    </Link>
                </>
            )}
        </div>
    );
};

export default LinkPagination;
