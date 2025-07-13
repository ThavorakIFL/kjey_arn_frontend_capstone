"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { Book as bookType } from "@/types/book";
import TitleBar from "@/components/TitleBar";
import Book from "@/components/bookComponent/Book";
import SearchAndFilterBar from "@/components/SearchAndFilterBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import MobileBook from "@/components/bookComponent/MobileBook";

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
        return <LoadingSpinner message="Loading your homepage..." />;
    }

    return (
        <>
            <SearchAndFilterBar globalSearch={true} />
            {!error && books.length > 0 && (
                <div>
                    <TitleBar
                        onAction={() => {
                            router.push("/all-book");
                        }}
                        actionTitle="See All Book"
                        title="Newly Added Books"
                        subTitle="Explore the latest additions to our collection"
                    />
                    <div className="my-4 sm:my-6 relative py-2">
                        {books.length === 0 && (
                            <div className="text-center text-gray-500 text-sm sm:text-base">
                                No books available.
                            </div>
                        )}
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                            {books.map((book) => (
                                <React.Fragment key={book.id}>
                                    <div className="block sm:hidden">
                                        <MobileBook book={book} />
                                    </div>

                                    <div className="hidden sm:block">
                                        <Book book={book} />
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomePageClient;
