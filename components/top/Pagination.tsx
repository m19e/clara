import { useRouter } from "next/router";
import { useEffect } from "react";
import Paginate from "react-paginate";

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
            containerClassName="flex"
            pageClassName="mx-1"
        />
    );
};

export default Pagination;