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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className=" bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-8">
                    <TitleBar
                        title="Borrow Requests"
                        className="text-4xl font-bold text-gray-800"
                    />
                    <p className="text-gray-600 mt-2">
                        Manage requests from borrowers who want to borrow your
                        books
                    </p>
                </div>

                {/* Search */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-black text-white p-4">
                        <div className="flex items-center gap-3">
                            <Search className="h-6 w-6" />
                            <h2 className="text-xl font-semibold">
                                Search Requests
                            </h2>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Search by book title or borrower name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                            />
                        </div>

                        {/* Results count */}
                        <div className="mt-4 text-sm text-gray-600">
                            {searchTerm
                                ? `Showing ${filteredData.length} of ${userBorrowRequestData.length} requests`
                                : `${
                                      userBorrowRequestData.length
                                  } pending request${
                                      userBorrowRequestData.length !== 1
                                          ? "s"
                                          : ""
                                  }`}
                        </div>
                    </div>
                </div>

                {/* Content */}
                {filteredData.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                                    className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-blue-400 group"
                                >
                                    {/* Image Header */}
                                    <div className="relative h-48 overflow-hidden">
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
                                        <div className="absolute top-3 right-3">
                                            <div
                                                className={`${statusInfo.bgColor} ${statusInfo.textColor} px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1`}
                                            >
                                                <StatusIcon className="h-3 w-3" />
                                                {statusInfo.label}
                                            </div>
                                        </div>

                                        {/* View Button */}
                                        <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            <div className="bg-white rounded-full p-2 shadow-lg">
                                                <Eye className="h-4 w-4 text-gray-600" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {/* Book Title */}
                                        <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
                                            {borrowEvent.book.title}
                                        </h3>

                                        {/* Details */}
                                        <div className="space-y-3">
                                            {/* Borrower (main focus since you're the lender) */}
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <User className="h-4 w-4" />
                                                    <span className="font-medium">
                                                        Requested by:
                                                    </span>
                                                </div>
                                                <span className="text-gray-800 font-medium">
                                                    {borrowEvent.borrower.name}
                                                </span>
                                            </div>

                                            {/* Your Book */}
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Book className="h-4 w-4" />
                                                    <span className="font-medium">
                                                        Your book:
                                                    </span>
                                                </div>
                                                <span className="text-gray-800 font-medium line-clamp-1">
                                                    {borrowEvent.book.title}
                                                </span>
                                            </div>

                                            {/* Dates */}
                                            {borrowEvent.meet_up_detail
                                                .start_date &&
                                                borrowEvent.meet_up_detail
                                                    .end_date && (
                                                    <div className="flex items-center gap-3 text-sm">
                                                        <div className="flex items-center gap-2 text-gray-600">
                                                            <Calendar className="h-4 w-4" />
                                                            <span className="font-medium">
                                                                Period:
                                                            </span>
                                                        </div>
                                                        <span className="text-gray-800">
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
                                            <div className="flex items-center gap-3 text-sm">
                                                <div className="flex items-center gap-2 text-gray-600">
                                                    <Clock className="h-4 w-4" />
                                                    <span className="font-medium">
                                                        Requested:
                                                    </span>
                                                </div>
                                                <span className="text-gray-600">
                                                    {formatDate(
                                                        borrowEvent.created_at ||
                                                            ""
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Action Hint */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
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
                        <div className="p-12 text-center">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Book className="h-12 w-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {userBorrowRequestData.length === 0
                                    ? "No Borrow Requests Received"
                                    : "No Results Found"}
                            </h3>
                            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
                                {userBorrowRequestData.length === 0
                                    ? "You haven't received any borrow requests yet. Share your books to start receiving requests!"
                                    : "Try adjusting your search terms or filters to find what you're looking for."}
                            </p>
                            {userBorrowRequestData.length === 0 && (
                                <Button
                                    onClick={() => router.push("/add-book")}
                                    className="bg-black text-white hover:bg-gray-800"
                                >
                                    List Your Books
                                </Button>
                            )}
                            {userBorrowRequestData.length > 0 &&
                                filteredData.length === 0 && (
                                    <Button
                                        onClick={() => setSearchTerm("")}
                                        variant="outline"
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
