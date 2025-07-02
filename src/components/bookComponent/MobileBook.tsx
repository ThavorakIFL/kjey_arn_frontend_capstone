"use client";

import { Book as BookType } from "@/types/book";
import React from "react";
import StatusIndicator from "../StatusIndicator";
import Link from "next/link";

type BookProps = {
    book: BookType;
};

const MobileBook: React.FC<BookProps> = ({ book }) => {
    return (
        <Link href={`/books/${book.id}`}>
            <div className="w-full bg-white rounded-lg overflow-hidden card-shadow transition-transform duration-200 hover:scale-105 cursor-pointer">
                {/* Book Cover Image */}
                <div className="w-full aspect-[3/4] relative bg-gray-200">
                    <img
                        className="h-full w-full object-cover"
                        src={
                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                            book.pictures[0]?.picture
                        }
                        alt={`${book.title} cover`}
                    />

                    {/* Status Indicator Overlay */}
                    <div className="absolute top-2 right-2">
                        <StatusIndicator
                            isAvailable={book.availability?.availability_id}
                        />
                    </div>
                </div>

                {/* Book Information */}
                <div className="p-3 space-y-2">
                    {/* Title */}
                    <h3 className="text-sm font-medium text-gray-900 leading-tight line-clamp-2">
                        {book.title}
                    </h3>

                    {/* Genres */}
                    <div className="flex flex-wrap gap-1">
                        {book.genres.slice(0, 2).map((genre, index) => (
                            <span
                                key={genre.id}
                                className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full"
                            >
                                {genre.genre}
                            </span>
                        ))}
                        {book.genres.length > 2 && (
                            <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-500 rounded-full">
                                +{book.genres.length - 2}
                            </span>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MobileBook;
