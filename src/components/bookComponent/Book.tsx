"use client";

import { Book as BookType } from "@/types/book";
import React from "react";
import StatusIndicator from "../StatusIndicator";
import Link from "next/link";

type BookProps = {
    book: BookType;
};

const Book: React.FC<BookProps> = ({ book }) => {
    console.log(book.pictures);

    return (
        <Link href={`/books/${book.id}`}>
            <div className="w-full aspect-[3/4] relative group rounded-lg overflow-hidden bg-gray-200 cursor-pointer card-shadow transition-transform duration-200 hover:scale-105">
                <div className="bg-black w-full h-full z-0 absolute opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className="z-10 absolute w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 sm:p-3 space-y-2 sm:space-y-4">
                    <div className="flex-grow">
                        <h1 className="text-sm sm:text-base md:text-lg text-white font-medium leading-tight">
                            Title:{" "}
                            <span className="font-normal">{book.title}</span>
                        </h1>
                        <div className="text-white mt-1 sm:mt-2">
                            {book.genres.map((genre, index) => (
                                <span
                                    key={genre.id}
                                    className="text-xs sm:text-sm text-gray-300"
                                >
                                    {genre.genre}
                                    {index < book.genres.length - 1 && ", "}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-end w-full">
                        <StatusIndicator
                            isAvailable={book.availability?.availability_id}
                        />
                    </div>
                </div>

                <img
                    className="h-full w-full object-cover"
                    src={
                        process.env.NEXT_PUBLIC_IMAGE_PATH +
                        book.pictures[0]?.picture
                    }
                    alt={`${book.title} cover`}
                />
            </div>
        </Link>
    );
};

export default Book;
