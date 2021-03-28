import Link from "next/link";

const Chevron = ({ prev }: { prev: boolean }) => (
    <div className="mx-0.5 transition-colors text-gray-400 hover:text-gray-600 bg-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-6 sm:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={prev ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
    </div>
);

const Ellipsis = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 sm:w-6 sm:h-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
    </svg>
);

const PageNum = ({ num }: { num: number }) => (
    <div className="w-6 h-6 sm:w-9 sm:h-9 flex-center bg-transparent transition-colors hover:bg-gray-200 rounded-full">
        <span className="sm:text-lg font-black text-gray-600">{num}</span>
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
        <div className="inline-flex items-center gap-1 mt-2">
            {currentPage != 1 && (
                <>
                    <Link href={`/page/${prev}`}>
                        <a>
                            <Chevron prev />
                        </a>
                    </Link>
                    <Link href="/page/1">
                        <a>
                            <PageNum num={1} />
                        </a>
                    </Link>
                </>
            )}
            {prev > 2 && <Ellipsis />}
            {prev > 1 && (
                <Link href={`/page/${prev}`}>
                    <a>
                        <PageNum num={prev} />
                    </a>
                </Link>
            )}
            <div className="w-6 h-6 sm:w-9 sm:h-9 flex-center bg-gray-200 rounded-full">
                <span className="sm:text-lg font-black text-gray-600">{currentPage}</span>
            </div>
            {next < pageCount && (
                <Link href={`/page/${next}`}>
                    <a>
                        <PageNum num={next} />
                    </a>
                </Link>
            )}
            {pageCount - next > 1 && <Ellipsis />}
            {currentPage != pageCount && (
                <>
                    <Link href={`/page/${pageCount}`}>
                        <a>
                            <PageNum num={pageCount} />
                        </a>
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
