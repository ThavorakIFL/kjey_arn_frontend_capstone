// HistoryPageClient.tsx
"use client";

import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";
import { History } from "lucide-react";
import { useEffect, useState } from "react";

interface HistoryPageClientProps {
    historyBorrowEventData: BorrowEventType[];
    error?: string | null;
    isLoading?: boolean;
}

export default function HistoryPageClient({
    historyBorrowEventData = [],
    error = null,
    isLoading = false,
}: HistoryPageClientProps) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [historyBorrowEventData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading your history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="container px-3 sm:px-4  py-4 sm:py-6 lg:py-8">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <TitleBar
                        title="All History"
                        subTitle=" View all your past borrowing activities"
                    />

                    {/* Loading State */}
                    {isLoading && (
                        <div className="flex justify-center items-center py-8 sm:py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                                <div className="text-sm sm:text-base text-gray-600">
                                    Loading your history...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
                            <div className="text-red-800 font-medium text-sm sm:text-base">
                                Unable to load history
                            </div>
                            <div className="text-red-600 text-xs sm:text-sm mt-1 break-words">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading &&
                        !error &&
                        historyBorrowEventData.length === 0 && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                <div className="flex flex-col items-center justify-center py-12  text-center px-4 sm:px-6">
                                    <div className="text-gray-400 mb-4 sm:mb-6 bg-gray-100 rounded-full h-24 w-24  flex items-center justify-between">
                                        <svg
                                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-14 lg:h-14 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
                                        No borrowing history yet
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed">
                                        Once you start borrowing items, your
                                        history will appear here. You'll be able
                                        to track all your past and current
                                        borrowing activities.
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* History Content */}
                    {!isLoading &&
                        !error &&
                        historyBorrowEventData.length > 0 && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                {/* Header */}
                                <div className="bg-black text-white p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <History className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                                            All Borrowing Histories
                                        </h2>
                                    </div>
                                    <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                        These are borrowing requests that you
                                        have made or received. You can click on
                                        each event to view more details about
                                        the borrowing activity.
                                    </p>
                                </div>

                                {/* Grid Content */}
                                <div className="p-3 sm:p-4 lg:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-3 sm:gap-4 lg:gap-6">
                                        {historyBorrowEventData.map((event) => (
                                            <Link
                                                href={`/history/${event.id}`}
                                                key={event.id}
                                                className="block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <BorrowEvent event={event} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
