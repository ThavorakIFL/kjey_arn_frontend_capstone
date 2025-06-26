import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
}

interface PaginationProps {
    pagination: PaginationData;
    onPageChange: (page: number) => void;
    loading?: boolean;
}

export default function Pagination({
    pagination,
    onPageChange,
    loading = false,
}: PaginationProps) {
    const { current_page, last_page, total, from, to } = pagination;

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const showPages = 5; // Show 5 page numbers at most

        if (last_page <= showPages) {
            // Show all pages if total pages <= showPages
            for (let i = 1; i <= last_page; i++) {
                pages.push(i);
            }
        } else {
            // Always show first page
            pages.push(1);

            if (current_page > 3) {
                pages.push("...");
            }

            // Show pages around current page
            const start = Math.max(2, current_page - 1);
            const end = Math.min(last_page - 1, current_page + 1);

            for (let i = start; i <= end; i++) {
                if (i !== 1 && i !== last_page) {
                    pages.push(i);
                }
            }

            if (current_page < last_page - 2) {
                pages.push("...");
            }

            // Always show last page if more than 1 page
            if (last_page > 1) {
                pages.push(last_page);
            }
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    const handlePageClick = (page: number) => {
        if (page !== current_page && !loading) {
            onPageChange(page);
        }
    };

    const handlePrevious = () => {
        if (current_page > 1 && !loading) {
            onPageChange(current_page - 1);
        }
    };

    const handleNext = () => {
        if (current_page < last_page && !loading) {
            onPageChange(current_page + 1);
        }
    };

    if (last_page <= 1) {
        return null; // Don't show pagination if there's only one page
    }

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            {/* Results info */}
            <div className="text-sm text-gray-600">
                {from && to ? (
                    <>
                        Showing <span className="font-medium">{from}</span> to{" "}
                        <span className="font-medium">{to}</span> of{" "}
                        <span className="font-medium">{total}</span> results
                    </>
                ) : (
                    <>
                        <span className="font-medium">{total}</span> total
                        results
                    </>
                )}
            </div>

            {/* Pagination controls */}
            <div className="flex items-center space-x-1">
                {/* Previous button */}
                <button
                    onClick={handlePrevious}
                    disabled={current_page === 1 || loading}
                    className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Page numbers */}
                <div className="flex">
                    {pageNumbers.map((page, index) => (
                        <div key={index}>
                            {page === "..." ? (
                                <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-500 bg-white border-t border-b border-gray-300">
                                    <MoreHorizontal className="w-4 h-4" />
                                </span>
                            ) : (
                                <button
                                    onClick={() =>
                                        handlePageClick(page as number)
                                    }
                                    disabled={loading}
                                    className={`inline-flex items-center px-3 py-2 text-sm font-medium border-t border-b border-gray-300 transition-colors ${
                                        current_page === page
                                            ? "bg-blue-50 text-blue-600 border-blue-500"
                                            : "text-gray-700 bg-white hover:bg-gray-50"
                                    } ${
                                        loading
                                            ? "cursor-not-allowed opacity-50"
                                            : ""
                                    }`}
                                >
                                    {page}
                                </button>
                            )}
                        </div>
                    ))}
                </div>

                {/* Next button */}
                <button
                    onClick={handleNext}
                    disabled={current_page === last_page || loading}
                    className="inline-flex items-center px-2 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
