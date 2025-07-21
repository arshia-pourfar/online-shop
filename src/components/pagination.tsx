'use client';

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
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 rounded bg-gray-700 text-primary-text disabled:opacity-50">
                Prev
            </button>
            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`px-3 py-1 rounded ${page === currentPage ? "bg-accent text-white" : "bg-secondary-bg text-primary-text hover:bg-accent/70"}`} >
                    {page}
                </button>
            ))}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === pageCount}
                className="px-3 py-1 rounded bg-gray-700 text-primary-text disabled:opacity-50">
                Next
            </button>
        </nav>
    );
}
