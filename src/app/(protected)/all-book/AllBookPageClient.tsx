"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { fetchSearchData } from "./all-book-action";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import Book from "@/components/bookComponent/Book";
import MobileBook from "@/components/bookComponent/MobileBook"; // Add this import
import TitleBar from "@/components/TitleBar";
import { BookOpen } from "lucide-react";
import BookCardSkeleton from "@/components/bookComponent/BookSkeleton";
import BookErrorState from "@/components/bookComponent/BookErrorState";
import BookEmptyState from "@/components/bookComponent/BookEmptyState";
import Pagination from "@/components/Pagination";
import React from "react";

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

    // Add refs for request management
    const abortControllerRef = useRef<AbortController | null>(null);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                params.delete("per_page");
            } else {
                params.set("per_page", newPerPage.toString());
            }
        }

        const newURL = `${pathname}?${params.toString()}`;
        router.push(newURL, { scroll: false });
    };

    const handleSearch = useCallback(
        async (page: number = currentPage) => {
            // Cancel previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Clear previous debounce timeout
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

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

                // Check if request was aborted
                if (abortControllerRef.current?.signal.aborted) {
                    return;
                }

                if (res.success) {
                    setBooks(res.data.books);
                    setPagination(res.data.pagination);
                } else {
                    setBooks([]);
                    setPagination(null);
                    setError(res.message);
                }
            } catch (error: any) {
                // Don't show error if request was aborted
                if (
                    error.name === "AbortError" ||
                    abortControllerRef.current?.signal.aborted
                ) {
                    return;
                }

                setBooks([]);
                setPagination(null);

                // Handle 429 specifically
                if (error.message.includes("429")) {
                    setError(
                        "Too many requests. Please wait a moment and try again."
                    );
                } else {
                    setError("Something went wrong.");
                }
            } finally {
                if (!abortControllerRef.current?.signal.aborted) {
                    setLoading(false);
                }
            }
        },
        [query, genreIds, currentPage, perPage]
    );

    // Debounced search effect
    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        debounceTimeoutRef.current = setTimeout(() => {
            handleSearch(currentPage);
        }, 300); // 300ms debounce

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [handleSearch, currentPage]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, []);

    const handleRetry = () => {
        // Add a small delay before retry to avoid immediate rate limiting
        setTimeout(() => {
            handleSearch(currentPage);
        }, 1000);
    };

    const handlePageChange = (page: number) => {
        updateURLParams(page);
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    const handlePerPageChange = (newPerPage: number) => {
        updateURLParams(1, newPerPage);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading all books...
                    </p>
                </div>
            </div>
        );
    }

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
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
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
                        books.map((book) => (
                            <React.Fragment key={book.id}>
                                {/* Mobile component - hidden on sm and up */}
                                <div className="block sm:hidden">
                                    <MobileBook book={book} />
                                </div>

                                {/* Desktop component - hidden on mobile, shown on sm and up */}
                                <div className="hidden sm:block">
                                    <Book book={book} />
                                </div>
                            </React.Fragment>
                        ))}
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
