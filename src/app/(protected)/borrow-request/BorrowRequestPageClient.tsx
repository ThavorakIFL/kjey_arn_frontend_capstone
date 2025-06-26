"use client";

import React, { useEffect, useState } from "react";
import TitleBar from "@/components/TitleBar";
import { useRouter } from "next/navigation";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import {
    Calendar,
    User,
    Book,
    Search,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface BorrowRequestPageClientProps {
    userBorrowRequestData: BorrowEventType[];
}

// Status configurations
const statusConfig = {
    1: {
        label: "Pending",
        color: "bg-yellow-500",
        icon: Clock,
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700",
    },
    2: {
        label: "Approved",
        color: "bg-green-500",
        icon: CheckCircle,
        bgColor: "bg-green-50",
        textColor: "text-green-700",
    },
    3: {
        label: "Rejected",
        color: "bg-red-500",
        icon: XCircle,
        bgColor: "bg-red-50",
        textColor: "text-red-700",
    },
    4: {
        label: "Borrowed",
        color: "bg-blue-500",
        icon: Book,
        bgColor: "bg-blue-50",
        textColor: "text-blue-700",
    },
    5: {
        label: "Returned",
        color: "bg-gray-500",
        icon: CheckCircle,
        bgColor: "bg-gray-50",
        textColor: "text-gray-700",
    },
};

export default function BorrowRequestPageClient({
    userBorrowRequestData,
}: BorrowRequestPageClientProps) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);

    const filteredData = userBorrowRequestData.filter((event) => {
        const matchesSearch =
            event.book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.borrower.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());

        return matchesSearch;
    });

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusInfo = (statusId: number) => {
        return (
            statusConfig[statusId as keyof typeof statusConfig] ||
            statusConfig[1]
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [userBorrowRequestData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen px-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="">
            <div className="container px-4 py-6 sm:py-8">
                <TitleBar
                    title="Borrow Requests"
                    subTitle="  Manage requests from borrowers who want to borrow your books"
                />

                {/* Content */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                        {filteredData.map((borrowEvent) => {
                            const statusInfo = getStatusInfo(
                                borrowEvent.borrow_status.borrow_status_id
                            );
                            const StatusIcon = statusInfo.icon;

                            return (
                                <div
                                    key={borrowEvent.id}
                                    onClick={() =>
                                        router.push(
                                            `/borrow-request/${borrowEvent.id}`
                                        )
                                    }
                                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] sm:hover:scale-105 hover:border-blue-400 group"
                                >
                                    {/* Image Header */}
                                    <div className="relative h-36 sm:h-48 overflow-hidden">
                                        <img
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_IMAGE_PATH +
                                                borrowEvent.book.pictures[0]
                                                    ?.picture
                                            }
                                            alt={borrowEvent.book.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                                        {/* Status Badge */}
                                        <div className="absolute top-2 sm:top-3 right-2 sm:right-3">
                                            <div
                                                className={`${statusInfo.bgColor} ${statusInfo.textColor} px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                                            >
                                                <StatusIcon className="h-3 w-3" />
                                                <span className="hidden xs:inline">
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <div className="absolute bottom-2 sm:bottom-3 right-2 sm:right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white rounded-full p-1.5 sm:p-2 shadow-lg">
                                                <Eye className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4 sm:p-6">
                                        {/* Book Title */}
                                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2 sm:mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                            {borrowEvent.book.title}
                                        </h3>

                                        {/* Details */}
                                        <div className="space-y-2 sm:space-y-3">
                                            {/* Borrower */}
                                            <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                                <div className="flex items-center gap-1 sm:gap-2 text-gray-600 min-w-0">
                                                    <User className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="font-medium">
                                                        Requested by:
                                                    </span>
                                                </div>
                                                <span className="text-gray-800 font-medium min-w-0 flex-1">
                                                    {borrowEvent.borrower.name}
                                                </span>
                                            </div>

                                            {/* Your Book */}
                                            <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                                <div className="flex items-center gap-1 sm:gap-2 text-gray-600 min-w-0">
                                                    <Book className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="font-medium">
                                                        Your book:
                                                    </span>
                                                </div>
                                                <span className="text-gray-800 font-medium line-clamp-1 min-w-0 flex-1">
                                                    {borrowEvent.book.title}
                                                </span>
                                            </div>

                                            {/* Dates */}
                                            {borrowEvent.meet_up_detail
                                                .start_date &&
                                                borrowEvent.meet_up_detail
                                                    .end_date && (
                                                    <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                                        <div className="flex items-center gap-1 sm:gap-2 text-gray-600 min-w-0">
                                                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                            <span className="font-medium">
                                                                Period:
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-800 min-w-0 flex-1">
                                                            {formatDate(
                                                                borrowEvent
                                                                    .meet_up_detail
                                                                    .start_date
                                                            )}{" "}
                                                            -{" "}
                                                            {formatDate(
                                                                borrowEvent
                                                                    .meet_up_detail
                                                                    .end_date
                                                            )}
                                                        </span>
                                                    </div>
                                                )}

                                            {/* Created Date */}
                                            <div className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm">
                                                <div className="flex items-center gap-1 sm:gap-2 text-gray-600 min-w-0">
                                                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                                                    <span className="font-medium">
                                                        Requested:
                                                    </span>
                                                </div>
                                                <span className="text-gray-600 min-w-0 flex-1">
                                                    {formatDate(
                                                        borrowEvent.created_at ||
                                                            ""
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Hint */}
                                        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-100">
                                            <p className="text-xs text-gray-500 text-center">
                                                Click to view details
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    /* Empty State */
                    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="p-8 sm:p-12 text-center">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <Book className="h-8 w-8 sm:h-12 sm:w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                                {userBorrowRequestData.length === 0
                                    ? "No Borrow Requests Received"
                                    : "No Results Found"}
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-sm mx-auto">
                                {userBorrowRequestData.length === 0
                                    ? "You haven't received any borrow requests yet. Share your books to start receiving requests!"
                                    : "Try adjusting your search terms or filters to find what you're looking for."}
                            </p>
                            {userBorrowRequestData.length > 0 &&
                                filteredData.length === 0 && (
                                    <Button
                                        onClick={() => setSearchTerm("")}
                                        variant="outline"
                                        className="text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                                    >
                                        Clear Search
                                    </Button>
                                )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
