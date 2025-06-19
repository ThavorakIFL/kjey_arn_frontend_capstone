"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchSearchData } from "../all-book/all-book-action";
import { useSession } from "next-auth/react";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import { Button } from "@/components/ui/button";
import { BookOpen, Plus } from "lucide-react";

export default function ShelfPage({}) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "book";
    const genreIds = searchParams.get("genre_ids") || "";

    const [books, setBooks] = React.useState<any[]>([]);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = useState(true);

    const handleSearch = async () => {
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
            });

            if (res.success) {
                setBooks(res.data.books);
            } else {
                setBooks([]);
                setError(res.message);
            }
        } catch {
            setBooks([]);
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        handleSearch();
    }, [query, genreIds, session?.userSubId, status]);

    // Show loading while session is being loaded
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                            Loading books...
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                {/* Search and Filter Bar */}
                <div className="mb-6 sm:mb-8">
                    <SearchAndFilterBar globalSearch={false} />
                </div>

                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6">
                        {/* Title Section */}
                        <div className="text-center sm:text-left">
                            {query ? (
                                <div>
                                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-1">
                                        Search Results
                                    </h1>
                                    <p className="text-sm sm:text-base text-gray-600">
                                        Results for "{query}"
                                    </p>
                                </div>
                            ) : (
                                <div>
                                    <TitleBar
                                        title="My Shelf"
                                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800"
                                    />
                                    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                                        Manage your book collection
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Action Button */}
                        <div className="flex justify-center sm:justify-start">
                            <Button
                                onClick={() => router.push("/add-book")}
                                className="w-full sm:w-auto h-10 sm:h-12 lg:h-14 px-4 sm:px-6 font-medium"
                                size="lg"
                            >
                                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                                List Book
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="space-y-6">
                    {/* Loading State */}
                    {loading && (
                        <div className="flex items-center justify-center py-12 sm:py-16">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                                <p className="text-sm sm:text-base text-gray-600">
                                    Loading your books...
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
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
                                <div>
                                    <h3 className="text-sm sm:text-base font-medium text-red-800">
                                        Unable to load books
                                    </h3>
                                    <p className="text-xs sm:text-sm text-red-600 mt-1 break-words">
                                        {error}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!loading && books.length === 0 && !error && (
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                            <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center px-4 sm:px-6">
                                <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                    <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2 sm:mb-3">
                                    {query
                                        ? "No books found"
                                        : "Your shelf is empty"}
                                </h3>
                                <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed mb-6">
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
                        </div>
                    )}

                    {/* Books Grid */}
                    {!loading && books.length > 0 && (
                        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                            <div className="p-4 sm:p-6 lg:p-8">
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 lg:gap-6">
                                    {books.map((book) => (
                                        <Book key={book.id} book={book} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
