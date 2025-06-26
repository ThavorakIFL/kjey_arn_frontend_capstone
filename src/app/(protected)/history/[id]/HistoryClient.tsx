"use client";
import HistoryDetail from "@/components/activityComponent/HistoryDetail";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { useEffect, useState } from "react";

interface HistoryClientProps {
    borrowEventData: BorrowEventType;
}

export default function HistoryClient({ borrowEventData }: HistoryClientProps) {
    const [loading, setLoading] = useState(true);

    const hasCancelorReject = () => {
        return (
            borrowEventData.borrow_event_cancel_reason ||
            borrowEventData.borrow_event_reject_reason
        );
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [borrowEventData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading history details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 text-center sm:text-left">
                        Borrow History Details
                    </h1>
                </div>

                {/* Main Content Layout */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
                    {/* Mobile/Tablet: Book Image */}
                    <div className="lg:hidden flex justify-center">
                        <div className="w-48 sm:w-56">
                            <BookDisplayCard
                                bookImage={
                                    borrowEventData.book.pictures[0].picture
                                }
                            />
                        </div>
                    </div>

                    {/* Desktop: Book Image */}
                    <div className="hidden lg:block lg:col-span-2">
                        <BookDisplayCard
                            bookImage={borrowEventData.book.pictures[0].picture}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-7">
                        <HistoryDetail
                            bookAuthor={borrowEventData.book.author}
                            bookTitle={borrowEventData.book.title}
                            borrowStatus={
                                borrowEventData.borrow_status.borrow_status_id
                            }
                            borrowerEmail={borrowEventData.borrower.email}
                            lenderEmail={borrowEventData.lender.email}
                            borrowerName={borrowEventData.borrower.name}
                            lenderName={borrowEventData.lender.name}
                            borrowerProfileImage={
                                borrowEventData.borrower.picture || ""
                            }
                            lenderProfileImage={
                                borrowEventData.lender.picture || ""
                            }
                        />
                    </div>

                    {hasCancelorReject() && (
                        <div className="lg:col-span-3">
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                {/* Header */}
                                <div className="bg-black text-white p-3 sm:p-4">
                                    <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                                        Reason for{" "}
                                        {borrowEventData.borrow_status
                                            .borrow_status_id === 3
                                            ? "rejection"
                                            : "cancellation"}
                                    </h2>
                                </div>

                                {/* Content */}
                                {(borrowEventData.borrow_event_reject_reason ||
                                    borrowEventData.borrow_event_cancel_reason) && (
                                    <div className="p-3 sm:p-4">
                                        <div className="text-sm sm:text-base text-gray-800 leading-relaxed">
                                            {borrowEventData.borrow_status
                                                .borrow_status_id === 3 ? (
                                                borrowEventData.borrow_event_reject_reason ? (
                                                    <p className="break-words">
                                                        {
                                                            borrowEventData
                                                                .borrow_event_reject_reason
                                                                .reason
                                                        }
                                                    </p>
                                                ) : (
                                                    <p className="text-gray-500 italic">
                                                        No rejection reason
                                                        provided
                                                    </p>
                                                )
                                            ) : borrowEventData.borrow_event_cancel_reason ? (
                                                <p className="break-words">
                                                    {
                                                        borrowEventData
                                                            .borrow_event_cancel_reason
                                                            .reason
                                                    }
                                                </p>
                                            ) : (
                                                <p className="text-gray-500 italic">
                                                    No cancellation reason
                                                    provided
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* No Reason State */}
                                {!borrowEventData.borrow_event_reject_reason &&
                                    !borrowEventData.borrow_event_cancel_reason && (
                                        <div className="p-3 sm:p-4">
                                            <p className="text-sm sm:text-base text-gray-500 italic">
                                                No reason provided for this{" "}
                                                {borrowEventData.borrow_status
                                                    .borrow_status_id === 3
                                                    ? "rejection"
                                                    : "cancellation"}
                                            </p>
                                        </div>
                                    )}
                            </div>
                        </div>
                    )}
                    {/* Reason Card */}
                </div>
            </div>
        </div>
    );
}
