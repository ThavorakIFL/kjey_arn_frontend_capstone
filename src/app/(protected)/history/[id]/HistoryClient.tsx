"use client";
import HistoryDetail from "@/components/activityComponent/HistoryDetail";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";

interface HistoryClientProps {
    borrowEventData: BorrowEventType;
}

export default function HistoryClient({ borrowEventData }: HistoryClientProps) {
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
                        borrowerName={borrowEventData.borrower.name}
                        borrowerProfileImage={
                            borrowEventData.borrower.picture || ""
                        }
                    />
                    {(borrowEventData.borrow_event_reject_reason ||
                        borrowEventData.borrow_event_cancel_reason) && (
                        <div className="bg-white shadow-md p-4 rounded-lg h-full">
                            <h1 className="text-lg font-semibold">
                                Reason for{" "}
                                {borrowEventData.borrow_status
                                    .borrow_status_id === 3
                                    ? "rejection"
                                    : "cancellation"}
                            </h1>
                            <h3>
                                {borrowEventData.borrow_status
                                    .borrow_status_id === 3 ? (
                                    // Show reject reason if it exists
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
                                ) : // Show cancel reason if it exists
                                borrowEventData.borrow_event_cancel_reason ? (
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
