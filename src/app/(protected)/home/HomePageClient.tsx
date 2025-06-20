"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Book as bookType } from "@/types/book";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";

interface HomePageClientProps {
    books: bookType[];
    error: string | null;
}

const HomePageClient: React.FC<HomePageClientProps> = ({ books, error }) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [books]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen px-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <>
            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <SearchAndFilterBar globalSearch={true} />
                {!error && books.length > 0 && (
                    <>
                        <TitleBar
                            onAction={() => {
                                router.push("/all-book");
                            }}
                            actionTitle="See All Book"
                            title="Newly Added Books"
                        />
                        <div className="my-4 sm:my-6 relative py-2">
                            {books.length === 0 && (
                                <div className="text-center text-gray-500 text-sm sm:text-base">
                                    No books available.
                                </div>
                            )}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                {books.map((book) => (
                                    <Book key={book.id} book={book} />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default HomePageClient;
