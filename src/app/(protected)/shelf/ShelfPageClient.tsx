"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { fetchSearchData } from "../all-book/all-book-action";
import { useSession } from "next-auth/react";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";

export default function ShelfPage({}) {
    const { data: session } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const query = searchParams.get("q") || "";
    const type = searchParams.get("type") || "book";
    const genreIds = searchParams.get("genre_ids") || "";

    const [books, setBooks] = React.useState<any[]>([]);
    const [error, setError] = React.useState("");
    const [loading, setLoading] = useState(true);

    const handleSearch = async () => {
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
    }, [query, genreIds]);

    return (
        <>
            <div className="p-8">
                <SearchAndFilterBar searchTitle="shelf" />
                <TitleBar
                    actionTitle="List Book"
                    onAction={() => {
                        router.push("/add-book");
                    }}
                    title="My Shelf"
                />
                <div className="">
                    {loading && <p>Loading...</p>}
                    {error && <p className="text-red-500">{error}</p>}
                    {!loading && books.length === 0 && !error && (
                        <p>No books found.</p>
                    )}

                    <div className="grid grid-cols-7 gap-4">
                        {books.map((book) => (
                            <Book key={book.id} book={book} />
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
