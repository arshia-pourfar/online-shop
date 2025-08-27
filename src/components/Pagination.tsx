"use client";
import { PaginationProps } from "types/pagination";

export default function Pagination({
    currentPage,
    pageCount,
    onPageChange,
}: PaginationProps) {
    const pages = [];
    for (let i = 1; i <= pageCount; i++) {
        pages.push(i);
    }

    return (
        <nav aria-label="Pagination" className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded bg-primary-text text-primary-bg disabled:opacity-50 cursor-pointer">
                Prev
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded cursor-pointer ${page === currentPage ? "bg-accent text-white" : "bg-secondary-bg text-primary-text hover:bg-accent/60"}`} >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 rounded bg-primary-text text-primary-bg disabled:opacity-50 cursor-pointer">
                Next
            </button>
        </nav>
    );
}
