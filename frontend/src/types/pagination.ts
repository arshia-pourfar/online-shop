export type PaginationProps = {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
};
