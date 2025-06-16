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
    }, [query, genreIds, session?.userSubId, status]); // Add session and status as dependencies

    // Show loading while session is being loaded
    if (status === "loading") {
        return (
            <div className="p-8">
                <p>Loading book....</p>
            </div>
        );
    }

    // Redirect to login if not authenticated
    if (status === "unauthenticated") {
        router.push("/login"); // Adjust the login route as needed
        return null;
    }

    return (
        <>
            <div className="p-8">
                <SearchAndFilterBar globalSearch={false} />
                <div className="flex justify-between">
                    {query ? (
                        <h1 className="text-xl font-bold mb-4">
                            Search Results for {query}
                        </h1>
                    ) : (
                        <TitleBar actionTitle="List Book" title="My Shelf" />
                    )}
                    <Button
                        onClick={() => router.push("/add-book")}
                        className="w-30 h-14 cursor-pointer"
                    >
                        List Book
                    </Button>
                </div>

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
