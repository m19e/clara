import { useRouter } from "next/router";
import { useEffect } from "react";
import Paginate from "react-paginate";

const chevron = (left: boolean) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        className={"w-4 h-4 text-gray-600 " + (left ? "mr-1" : "ml-1")}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={left ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
    </svg>
);

const Pagination = () => {
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
            pageCount={7}
            pageRangeDisplayed={2}
            marginPagesDisplayed={1}
            onPageChange={handlePageChange}
            initialPage={0}
            previousLabel={chevron(true)}
            nextLabel={chevron(false)}
            containerClassName="flex items-center"
            pageClassName="font-black text-gray-600 mx-0.5 px-2.5 py-0.5 border border-gray-300 rounded bg-transparent hover:bg-gray-200"
        />
    );
};

export default Pagination;
