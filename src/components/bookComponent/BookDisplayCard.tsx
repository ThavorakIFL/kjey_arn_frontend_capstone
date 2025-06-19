import React from "react";
import { Book } from "lucide-react";

interface BookDisplayCardProps {
    bookImage: string;
}

export function BookDisplayCard({ bookImage }: BookDisplayCardProps) {
    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-black text-white p-3 sm:p-4">
                <div className="flex items-center gap-2 sm:gap-3">
                    <h2 className="text-lg sm:text-xl font-semibold">
                        Book Image
                    </h2>
                </div>
            </div>
            <div className="p-4 sm:p-6 flex items-center justify-center">
                <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
                    <img
                        className="w-full aspect-[3/4] rounded-lg shadow-md object-cover"
                        src={process.env.NEXT_PUBLIC_IMAGE_PATH + bookImage}
                        alt="Book Image"
                    />
                </div>
            </div>
        </div>
    );
}
