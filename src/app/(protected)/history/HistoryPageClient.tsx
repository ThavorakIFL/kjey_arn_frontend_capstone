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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <TitleBar title="All History" />

                {isLoading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="text-gray-600">
                            Loading your history...
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="text-red-800 font-medium">
                            Unable to load history
                        </div>
                        <div className="text-red-600 text-sm mt-1">{error}</div>
                    </div>
                )}

                {!isLoading &&
                    !error &&
                    historyBorrowEventData.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="text-gray-400 mb-4">
                                <svg
                                    className="w-16 h-16 mx-auto"
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
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                No borrowing history yet
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-md">
                                Once you start borrowing items, your history
                                will appear here. You'll be able to track all
                                your past and current borrowing activities.
                            </p>
                        </div>
                    )}

                {!isLoading && !error && historyBorrowEventData.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="bg-black text-white p-6 space-y-4">
                            <div className="flex items-center gap-3">
                                <History className="h-6 w-6" />
                                <h2 className="text-2xl font-semibold">
                                    Pending Requests
                                </h2>
                            </div>
                            <p className="text-gray-300 text-sm mt-1">
                                Requests waiting for response
                            </p>
                        </div>
                        <div className="p-6">
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                {historyBorrowEventData.map((event) => (
                                    <Link
                                        href={`/history/${event.id}`}
                                        key={event.id}
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
    );
}
