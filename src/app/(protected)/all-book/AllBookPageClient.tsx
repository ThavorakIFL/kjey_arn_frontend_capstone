"use client";

import { useEffect, useState } from "react";
import { fetchSearchData } from "./all-book-action";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import Book from "@/components/bookComponent/Book";
import TitleBar from "@/components/TitleBar";
import { BookOpen } from "lucide-react";
import BookCardSkeleton from "@/components/bookComponent/BookSkeleton";
import BookErrorState from "@/components/bookComponent/BookErrorState";
import BookEmptyState from "@/components/bookComponent/BookEmptyState";
import Pagination from "@/components/Pagination";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
}

export default function AllBookClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const query = searchParams.get("q") || "";
    const genreIds = searchParams.get("genre_ids") || "";
    const currentPage = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "14");

    const [books, setBooks] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState<PaginationData | null>(null);

    const updateURLParams = (newPage?: number, newPerPage?: number) => {
        const params = new URLSearchParams(searchParams.toString());

        if (newPage !== undefined) {
            if (newPage === 1) {
                params.delete("page");
            } else {
                params.set("page", newPage.toString());
            }
        }

        if (newPerPage !== undefined) {
            if (newPerPage === 14) {
                params.delete("per_page"); // Remove parameter when using default value
            } else {
                params.set("per_page", newPerPage.toString());
            }
        }

        const newURL = `${pathname}?${params.toString()}`;
        router.push(newURL, { scroll: false });
    };

    const handleSearch = async (page: number = currentPage) => {
        const genre_ids = genreIds ? genreIds.split(",").map(Number) : [];
        setError("");
        setLoading(true);

        try {
            const res = await fetchSearchData({
                title: query,
                genre_ids,
                page,
                per_page: perPage,
            });

            if (res.success) {
                setBooks(res.data.books);
                setPagination(res.data.pagination);
            } else {
                setBooks([]);
                setPagination(null);
                setError(res.message);
            }
        } catch {
            setBooks([]);
            setPagination(null);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch(currentPage);
    }, [query, genreIds, currentPage, perPage]);

    const handleRetry = () => {
        handleSearch(currentPage);
    };

    const handlePageChange = (page: number) => {
        updateURLParams(page);
        // Scroll to top of results when changing pages
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePerPageChange = (newPerPage: number) => {
        updateURLParams(1, newPerPage); // Reset to page 1 when changing per page
    };

    return (
        <div>
            <div>
                {/* Header Section */}
                <div className="mb-8">
                    <div className="space-y-4">
                        <SearchAndFilterBar />
                        <div className="flex  sm:flex-row sm:items-center justify-between gap-4">
                            <div>
                                <h1 className="text-2xl font-semibold text-gray-900">
                                    {query ? `Search Results` : "All Books"}
                                </h1>
                                {query && (
                                    <p className="text-gray-600 mt-1">
                                        Showing results for{" "}
                                        <span className="font-semibold text-blue-primaryBlue">
                                            "{query}"
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Items per page selector */}
                            {!loading &&
                                !error &&
                                pagination &&
                                pagination.total > 0 && (
                                    <div className="flex items-center space-x-2">
                                        <label
                                            htmlFor="per-page"
                                            className="text-sm text-gray-600"
                                        >
                                            Show:
                                        </label>
                                        <select
                                            id="per-page"
                                            value={perPage}
                                            onChange={(e) =>
                                                handlePerPageChange(
                                                    parseInt(e.target.value)
                                                )
                                            }
                                            className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value={14}>14</option>
                                            <option value={24}>24</option>
                                            <option value={48}>48</option>
                                            <option value={96}>96</option>
                                        </select>
                                        <span className="text-sm text-gray-600">
                                            per page
                                        </span>
                                    </div>
                                )}
                        </div>

                        {!loading && !error && pagination && (
                            <div className="flex items-center space-x-2 text-sm text-gray-500">
                                <BookOpen className="w-4 h-4" />
                                <span>
                                    {pagination.total}{" "}
                                    {pagination.total === 1 ? "book" : "books"}{" "}
                                    found
                                    {pagination.total > pagination.per_page && (
                                        <span className="ml-1">
                                            (page {pagination.current_page} of{" "}
                                            {pagination.last_page})
                                        </span>
                                    )}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
                    {loading &&
                        Array.from({ length: perPage }).map((_, index) => (
                            <BookCardSkeleton key={index} />
                        ))}

                    {!loading && error && (
                        <div className="col-span-full">
                            <BookErrorState
                                error={error}
                                onRetry={handleRetry}
                            />
                        </div>
                    )}

                    {!loading && !error && books.length === 0 && (
                        <div className="col-span-full">
                            <BookEmptyState query={query} />
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        books.length > 0 &&
                        books.map((book) => <Book key={book.id} book={book} />)}
                </div>

                {/* Pagination */}
                {!loading &&
                    !error &&
                    pagination &&
                    pagination.last_page > 1 && (
                        <Pagination
                            pagination={pagination}
                            onPageChange={handlePageChange}
                            loading={loading}
                        />
                    )}
            </div>
        </div>
    );
}
