"use client";

import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";
import Link from "next/link";
interface HistoryPageClientProps {
    historyBorrowEventData: BorrowEventType[];
}

export default function HistoryPageClient({
    historyBorrowEventData = [],
}: HistoryPageClientProps) {
    return (
        <div className="flex flex-col gap-4 p-8">
            <h1 className="text-2xl font-bold">History</h1>
            <p className="text-gray-500">
                This is the history page. You can view your past activities
                here.
            </p>
            {historyBorrowEventData.length > 0 && (
                <div>
                    {historyBorrowEventData.map((event) => (
                        <Link href={`/history/${event.id} `} key={event.id}>
                            <div
                                key={event.id}
                                className="p-4 border border-gray-300 rounded-lg shadow-sm flex space-x-2 items-center"
                            >
                                <div>
                                    <img
                                        className="w-32 h-48 object-cover rounded-lg"
                                        alt={event.book.title}
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            event.book.pictures[0]?.picture
                                        }
                                    />
                                </div>
                                <div>
                                    <h1>Book Title: {event.book.title}</h1>
                                    <h2>Borrower: {event.borrower.name}</h2>
                                    <h2>Lender: {event.lender.name}</h2>
                                    <BorrowStatus
                                        statusId={
                                            event.borrow_status.borrow_status_id
                                        }
                                    />
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
