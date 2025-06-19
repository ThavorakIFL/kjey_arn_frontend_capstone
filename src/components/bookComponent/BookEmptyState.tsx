import { BookOpen } from "lucide-react";
import React from "react";

interface BookEmptyStateProps {
    query?: string;
}

const BookEmptyState: React.FC<BookEmptyStateProps> = ({ query }) => {
    return (
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
                No books found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
                {query
                    ? `We couldn't find any books matching "${query}". Try adjusting your search terms or filters.`
                    : "No books are currently available."}
            </p>
        </div>
    );
};

export default BookEmptyState;
