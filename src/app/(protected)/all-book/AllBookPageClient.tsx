"use client";

import { useEffect, useState } from "react";
import { fetchSearchData } from "./all-book-action";
import { useSearchParams } from "next/navigation";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import Book from "@/components/bookComponent/Book";
import TitleBar from "@/components/TitleBar";
import { BookOpen } from "lucide-react";
import BookCardSkeleton from "@/components/bookComponent/BookSkeleton";
import BookErrorState from "@/components/bookComponent/BookErrorState";
import BookEmptyState from "@/components/bookComponent/BookEmptyState";

export default function AllBookClient() {
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const genreIds = searchParams.get("genre_ids") || "";

    const [books, setBooks] = useState<any[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const handleSearch = async () => {
        const genre_ids = genreIds ? genreIds.split(",").map(Number) : [];
        setError("");
        setLoading(true);

        try {
            const res = await fetchSearchData({ title: query, genre_ids });

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
    }, [query, genreIds]);

    const handleRetry = () => {
        handleSearch();
    };

    return (
        <div>
            <div className="container mx-auto px-4 py-8">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <h1 className="text-2xl font-bold text-gray-900">
                                {query ? `Search Results` : "All Books"}
                            </h1>
                        </div>

                        <SearchAndFilterBar />

                        {query && (
                            <p className="text-gray-600 mt-1">
                                Showing results for{" "}
                                <span className="font-semibold text-blue-700">
                                    "{query}"
                                </span>
                            </p>
                        )}
                    </div>

                    {!loading && !error && (
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-4">
                            <BookOpen className="w-4 h-4" />
                            <span>
                                {books.length}{" "}
                                {books.length === 1 ? "book" : "books"} found
                            </span>
                        </div>
                    )}
                </div>

                {/* Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 ">
                    {loading &&
                        Array.from({ length: 12 }).map((_, index) => (
                            <BookCardSkeleton key={index} />
                        ))}

                    {!loading && error && (
                        <BookErrorState error={error} onRetry={handleRetry} />
                    )}

                    {!loading && !error && books.length === 0 && (
                        <BookEmptyState query={query} />
                    )}

                    {!loading &&
                        !error &&
                        books.length > 0 &&
                        books.map((book) => <Book key={book.id} book={book} />)}
                </div>
            </div>
        </div>
    );
}
