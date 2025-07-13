"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams, usePathname } from "next/navigation";
import { fetchSearchData } from "../all-book/all-book-action";
import { useSession } from "next-auth/react";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import MobileBook from "@/components/bookComponent/MobileBook"; // Add this import
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";
import BookCardSkeleton from "@/components/bookComponent/BookSkeleton";
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

export default function ShelfPage({}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "book";
    const genreIds = searchParams.get("genre_ids") || "";
    const currentPage = parseInt(searchParams.get("page") || "1");
    const perPage = parseInt(searchParams.get("per_page") || "14");

    const [books, setBooks] = React.useState<any[]>([]);
    const [error, setError] = React.useState("");
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
        // Don't search if session is still loading
        if (status === "loading") {
            return;
        }

        // Don't search if user is not authenticated
        if (status === "unauthenticated") {
            setError("You must be logged in to access your shelf");
            setLoading(false);
            return;
        }

        const genre_ids = genreIds ? genreIds.split(",").map(Number) : [];
        setError("");
        setLoading(true);

        try {
            const res = await fetchSearchData({
                title: query,
                genre_ids,
                sub: session?.userSubId,
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
    }, [query, genreIds, session?.userSubId, status, currentPage, perPage]);

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

    const handleRetry = () => {
        handleSearch(currentPage);
    };

    // Show loading while session is being loaded
    if (status === "loading") {
        return (
            <div className="">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                            Loading your books...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
        router.push("/login");
        return null;
    }

    return (
        <div className="">
            <div>
                {/* Search and Filter Bar */}
                <SearchAndFilterBar globalSearch={false} />

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                        {/* Title Section */}
                        <div className="sm:text-left w-full">
                            {!query && (
                                <TitleBar
                                    title="My Shelf"
                                    subTitle="Explore and manage your personal book collection"
                                    onAction={() => {
                                        router.push("/add-book");
                                    }}
                                    actionTitle="List Book"
                                />
                            )}

                            {query && (
                                <div>
                                    <h1 className="text-xl sm:text-2xl  font-semibold text-gray-900 mb-1">
                                        Search Results
                                    </h1>
                                    <p className=" text-gray-600">
                                        Showing results for
                                        <span className="font-semibold text-blue-primaryBlue">
                                            "{query}"
                                        </span>
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Items per page selector - only show when we have results */}
                    </div>

                    {/* Results count */}
                    {!loading && !error && pagination && (
                        <div className="flex justify-between text-sm text-gray-500 mt-4">
                            <div className="flex space-x-2  items-center ">
                                <BookOpen className="w-4 h-4" />
                                <span>
                                    {pagination.total}{" "}
                                    {pagination.total === 1 ? "book" : "books"}{" "}
                                    found in your shelf
                                    {pagination.total > pagination.per_page && (
                                        <span className="ml-1">
                                            (page {pagination.current_page} of{" "}
                                            {pagination.last_page})
                                        </span>
                                    )}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    {/* Error State */}
                    {!loading && error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 mx-2 sm:mx-0">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg
                                        className="w-4 h-4 text-red-600"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-sm sm:text-base font-medium text-red-800">
                                        Unable to load books
                                    </h3>
                                    <p className="text-xs sm:text-sm text-red-600 mt-1 break-words">
                                        {error}
                                    </p>
                                    <Button
                                        onClick={handleRetry}
                                        variant="outline"
                                        size="sm"
                                        className="mt-3 text-red-600 border-red-300 hover:bg-red-50"
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && books.length === 0 && !error && (
                        // <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <BookOpen className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                {query
                                    ? "No books found"
                                    : "Your shelf is empty"}
                            </h3>
                            <p className="text-gray-500 text-center max-w-md">
                                {query
                                    ? `No books match your search for "${query}". Try different keywords or browse all books.`
                                    : "Start building your collection by adding books to your shelf. Click 'List Book' to get started!"}
                            </p>
                            {!query && (
                                <Button
                                    onClick={() => router.push("/add-book")}
                                    className="w-full sm:w-auto"
                                    size="lg"
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Your First Book
                                </Button>
                            )}
                        </div>
                        // </div>
                    )}

                    {/* Books Grid */}
                    {!loading && books.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {books.map((book) => (
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
                    )}

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
        </div>
    );
}
