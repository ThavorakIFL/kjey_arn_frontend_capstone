"use client";

import React from "react";

const BookCardSkeleton = () => (
    <div className="w-48 h-72 relative rounded-lg overflow-hidden bg-gray-200 animate-pulse">
        <div className="h-full w-full bg-gradient-to-b from-gray-200 to-gray-300"></div>
        <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-gray-800 to-transparent">
            <div className="space-y-2">
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
            </div>
        </div>
    </div>
);

export default BookCardSkeleton;
