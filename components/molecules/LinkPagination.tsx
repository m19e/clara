type Props = {
    currentPage: number;
    pageCount: number;
};

const LinkPagination = ({ currentPage, pageCount }: Props) => {
    return (
        <div>
            {currentPage} in {pageCount}
        </div>
    );
};

export default LinkPagination;
