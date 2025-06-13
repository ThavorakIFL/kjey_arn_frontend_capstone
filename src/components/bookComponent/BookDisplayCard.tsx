import React from "react";

interface BookDisplayCardProps {
    bookImage: string;
}

export function BookDisplayCard({ bookImage }: BookDisplayCardProps) {
    return (
        <div className="p-4 bg-white rounded-lg shadow-md  flex items-center justify-center">
            <img
                className="w-48 h-72 rounded-lg"
                src={process.env.NEXT_PUBLIC_IMAGE_PATH + bookImage}
                alt="Book Image"
            />
        </div>
    );
}
