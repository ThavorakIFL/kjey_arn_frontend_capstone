"use client";

import { Book as BookType } from "@/types/book";
import React from "react";
import StatusIndicator from "../StatusIndicator";
import Link from "next/link";
// import ProfileIcon from "../ProfileIcon";
type BookProps = {
    book: BookType;
};

const Book: React.FC<BookProps> = ({ book }) => {
    console.log(book.pictures);

    return (
        <Link href={`/books/${book.id}`}>
            <div className="w-48 h-72 relative group  rounded-lg overflow-hidden bg-gray-200 cursor-pointer card-shadow">
                <div className=" bg-black w-full h-full z-0 absolute opacity-0 group-hover:opacity-80 transition-opacity duration-300"></div>
                <div className=" z-10 absolute  w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-2 space-y-6">
                    <div className="flex-grow">
                        <h1 className="text-lg text-white ">
                            Title: <span>{book.title}</span>
                        </h1>
                        <h1 className="text-white">
                            {book.genres.map((genre) => (
                                <span
                                    key={genre.id}
                                    className="text-sm text-gray-300"
                                >
                                    {genre.genre}
                                    {book.genres.length > 1 && ", "}
                                </span>
                            ))}
                        </h1>
                    </div>
                    <div className="flex justify-end w-full">
                        <StatusIndicator
                            isAvailable={book.availability?.availability_id}
                        />
                    </div>
                </div>

                <img
                    className="h-full w-full "
                    src={
                        process.env.NEXT_PUBLIC_IMAGE_PATH +
                        book.pictures[0]?.picture
                    }
                    alt="Image"
                />
            </div>
        </Link>
    );
};

export default Book;
