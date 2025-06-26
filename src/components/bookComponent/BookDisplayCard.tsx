import React from "react";
import { Book } from "lucide-react";

interface BookDisplayCardProps {
    bookImage: string;
}

export function BookDisplayCard({ bookImage }: BookDisplayCardProps) {
    return (
        <div className="w-full bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="bg-sidebarColor text-white p-3 sm:p-4 lg:p-5">
                <div className="flex items-center gap-2 sm:gap-3">
                    <Book className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 flex-shrink-0" />
                    <h2 className="text-sm sm:text-lg md:text-xl  font-semibold truncate">
                        Book Image
                    </h2>
                </div>
            </div>

            {/* Image Container */}
            <div className="p-3 sm:p-4 lg:p-6 xl:p-8">
                <div className="relative w-full max-w-sm mx-auto lg:max-w-none">
                    <img
                        className="w-full h-auto aspect-[2/3] sm:aspect-[3/4] md:aspect-[2/3] rounded-lg shadow-md object-cover bg-gray-100 transition-all duration-300 hover:shadow-xl"
                        src={`${
                            process.env.NEXT_PUBLIC_IMAGE_PATH || "/images/"
                        }${bookImage}`}
                        alt="Book Cover"
                        loading="lazy"
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const fallback =
                                target.nextElementSibling as HTMLDivElement;
                            if (fallback) fallback.style.display = "flex";
                        }}
                    />

                    {/* Fallback when image fails to load */}
                    <div
                        className="hidden w-full aspect-[2/3] sm:aspect-[3/4] md:aspect-[2/3] rounded-lg shadow-md bg-gray-100 items-center justify-center border-2 border-dashed border-gray-300"
                        style={{ display: "none" }}
                    >
                        <div className="text-center p-4 sm:p-6">
                            <Book className="w-8 h-8 sm:w-12 sm:h-12 lg:w-16 lg:h-16 text-gray-400 mx-auto mb-2 sm:mb-3" />
                            <p className="text-xs sm:text-sm lg:text-base text-gray-500 font-medium">
                                Book Image
                            </p>
                            <p className="text-[10px] sm:text-xs lg:text-sm text-gray-400 mt-1">
                                Image not available
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
