import React from "react";
import { Book } from "lucide-react";

interface BookDisplayCardProps {
    bookImage: string;
}

export function BookDisplayCard({ bookImage }: BookDisplayCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-black text-white p-4">
                <div className="flex items-center gap-3">
                    <h2 className="text-xl font-semibold">Book Image</h2>
                </div>
            </div>
            <div className="p-6 flex items-center justify-center">
                <img
                    className="w-48 h-64 rounded-lg shadow-md object-cover"
                    src={process.env.NEXT_PUBLIC_IMAGE_PATH + bookImage}
                    alt="Book Image"
                />
            </div>
        </div>
    );
}
