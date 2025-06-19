"use client";

import { Search } from "lucide-react";
import React from "react";

interface EmptyStateProps {
    query?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ query }) => {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No users found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
                {query
                    ? `We couldn't find any users matching "${query}". Try adjusting your search terms.`
                    : "No users are currently available."}
            </p>
        </div>
    );
};

export default EmptyState;
