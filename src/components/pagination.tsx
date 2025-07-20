'use client';

import { Button } from "@/components/Button";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
}: PaginationProps) {
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex justify-center mt-6 space-x-2 rtl:space-x-reverse">
            <Button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                قبلی
            </Button>

            {pages.map((page) => (
                <Button
                    key={page}
                    onClick={() => onPageChange(page)}
                >
                    {page}
                </Button>
            ))}

            <Button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                بعدی
            </Button>
        </div>
    );
}
