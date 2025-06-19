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
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [borrowEventData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Borrow History Details</h1>
            <div className="grid grid-cols-12 gap-8 items-start py-8">
                <div className="col-span-2">
                    <BookDisplayCard
                        bookImage={borrowEventData.book.pictures[0].picture}
                    />
                </div>
                <div className="col-span-7 flex flex-col space-y-6 h-full">
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
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden col-span-3">
                    <div className="bg-black text-white p-4">
                        <h2 className="text-2xl font-semibold">
                            Reason for{" "}
                            {borrowEventData.borrow_status.borrow_status_id ===
                            3
                                ? "rejection"
                                : "cancellation"}
                        </h2>
                    </div>
                    {(borrowEventData.borrow_event_reject_reason ||
                        borrowEventData.borrow_event_cancel_reason) && (
                        <div className="bg-white shadow-md p-4 rounded-lg h-full">
                            <h1 className="text-lg font-semibold"></h1>
                            <h3>
                                {borrowEventData.borrow_status
                                    .borrow_status_id === 3 ? (
                                    borrowEventData.borrow_event_reject_reason ? (
                                        <p>
                                            {
                                                borrowEventData
                                                    .borrow_event_reject_reason
                                                    .reason
                                            }
                                        </p>
                                    ) : (
                                        <p>No rejection reason provided</p>
                                    )
                                ) : borrowEventData.borrow_event_cancel_reason ? (
                                    <p>
                                        {
                                            borrowEventData
                                                .borrow_event_cancel_reason
                                                .reason
                                        }
                                    </p>
                                ) : (
                                    <p>No cancellation reason provided</p>
                                )}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
