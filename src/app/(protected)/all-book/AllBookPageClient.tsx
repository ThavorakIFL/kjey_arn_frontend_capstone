"use client";

import { useEffect, useState } from "react";
import { fetchSearchData } from "./all-book-action";
import { useSearchParams } from "next/navigation";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import Book from "@/components/bookComponent/Book";

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

    return (
        <div className="mb-4 p-8">
            <SearchAndFilterBar searchTitle="all-book" />
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-xl font-bold">
                    {query ? `Search Results for "${query}"` : "All Books"}
                </h1>
            </div>

            {loading && <p>Loading...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && books.length === 0 && !error && <p>No books found.</p>}

            <div className="grid grid-cols-7 gap-4">
                {books.map((book) => (
                    <Book key={book.id} book={book} />
                ))}
            </div>
        </div>
    );
}
