"use client";

import { Book as BookType } from "@/types/book";
import Link from "next/link";
import React from "react";
import StatusIndicator from "../StatusIndicator";

type MobileBookProps = {
    book: BookType;
};

const MobileBook: React.FC<MobileBookProps> = ({ book }) => {
    return (
        <Link href={`/books/${book.id}`}>
            <div className="w-40 aspect-[4/6] relative group rounded-lg overflow-hidden bg-gray-200">
                <img
                    className="text-center h-full w-full object-cover"
                    src="https://th.bing.com/th/id/OIP.rb6aTeGCgJp_H4hAi-DMCwHaL0?rs=1&pid=ImgDetMain"
                    alt={`${book.title} cover`}
                />
            </div>
            <p>{book.title}</p>
            <div>
                {book.genres.map((genre) => (
                    <span key={genre.id}>{genre.genre}</span>
                ))}
            </div>
        </Link>
    );
};

export default MobileBook;
