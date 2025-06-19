"use client";
import { AlertCircle } from "lucide-react";
import React from "react";

interface BookErrorStateProps {
    error: string;
    onRetry: () => void;
}

const BookErrorState: React.FC<BookErrorStateProps> = ({ error, onRetry }) => (
    <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
            Something went wrong
        </h3>
        <p className="text-gray-500 text-center max-w-md mb-4">
            We encountered an error while loading the books. Please try again.
        </p>
        <button
            onClick={onRetry}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
        >
            Try Again
        </button>
    </div>
);
export default BookErrorState;
