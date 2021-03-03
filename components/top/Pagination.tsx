import { useRouter } from "next/router";
import { useEffect } from "react";
import Paginate from "react-paginate";

const chevron = (left: boolean) => (
    <div className="w-6 h-6 mx-0.5 flex-center rounded transition-colors text-gray-400 hover:text-gray-600 bg-transparent">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={left ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
        </svg>
    </div>
);

const ellipsis = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
        />
    </svg>
);

type Props = {
    pageCount: number;
    initialPage: number;
};

const Pagination = ({ pageCount, initialPage }: Props) => {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChangeComplete = () => {
            window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        };
        router.events.on("routeChangeComplete", handleRouteChangeComplete);

        return () => {
            router.events.off("routeChangeComplete", handleRouteChangeComplete);
        };
    }, []);

    const handlePageChange = (selectedItem: { selected: number }) => {
        const { selected } = selectedItem;
        router.push(`/page/${selected + 1}`);
    };

    return (
        <Paginate
            pageCount={pageCount}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            initialPage={initialPage}
            onPageChange={handlePageChange}
            previousLabel={chevron(true)}
            breakLabel={ellipsis()}
            nextLabel={chevron(false)}
            containerClassName="flex items-center"
            previousLinkClassName="outline-none focus:outline-none"
            nextLinkClassName="outline-none focus:outline-none"
            pageClassName="flex-center"
            pageLinkClassName="font-black text-gray-600 mx-0.5 px-2.5 py-0.5 rounded-full bg-transparent hover:bg-gray-200 outline-none focus:outline-none"
            activeClassName="flex-center"
            activeLinkClassName="font-black text-gray-600 mx-0.5 px-2.5 py-0.5 rounded-full bg-gray-200 outline-none focus:outline-none cursor-default"
            disabledClassName="opacity-0"
        />
    );
};

export default Pagination;
