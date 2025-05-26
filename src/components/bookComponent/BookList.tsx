"use client";

import { useState, useEffect, useRef } from "react";
import { Book as BookType } from "@/types/book";
import Book from "./Book";
import ArrowLeft from "@/assets/icons/arrow-left-icon.svg";
import ArrowRight from "@/assets/icons/arrow-right-icon.svg";

type BookListProps = {
    books: BookType[];
};

const BookList: React.FC<BookListProps> = ({ books }) => {
    const [page, setPage] = useState(0);
    const bookPerPage = 6;
    const startIndex = page * bookPerPage;
    const endIndex = startIndex + bookPerPage;
    const visibleBooks = books.slice(startIndex, endIndex);

    const listRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        listRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [page]);

    return (
        <div>
            <div
                ref={listRef}
                className="flex flex-wrap gap-4 p-4 bg-white rounded-lg shadow-md justify-between items-center"
            >
                <div
                    onClick={
                        page === 0
                            ? undefined
                            : () => setPage((prev) => prev - 1)
                    }
                    className={`bg-secondary shadow-md rounded-full w-8 h-8 flex items-center justify-center transition ${
                        page === 0
                            ? "pointer-events-none cursor-not-allowed"
                            : "cursor-pointer hover:bg-backgroundColor"
                    }`}
                >
                    <ArrowLeft />
                </div>
                <div className="grid grid-cols-6 gap-8">
                    {visibleBooks.map((book) => (
                        <Book key={book.id} book={book} />
                    ))}
                </div>
                <div
                    onClick={
                        endIndex >= books.length
                            ? undefined
                            : () => setPage((prev) => prev + 1)
                    }
                    className={`bg-secondary shadow-md rounded-full w-8 h-8 flex items-center justify-center transition ${
                        endIndex >= books.length
                            ? "pointer-events-none cursor-not-allowed"
                            : "cursor-pointer hover:bg-backgroundColor"
                    }`}
                >
                    <ArrowRight />
                </div>
            </div>

            <div className="flex justify-center space-x-4 mt-4"></div>
        </div>
    );
};

export default BookList;
