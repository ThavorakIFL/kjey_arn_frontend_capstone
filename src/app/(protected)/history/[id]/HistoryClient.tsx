"use client";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";

interface HistoryClientProps {
    borrowEventData: BorrowEventType;
}

export default function HistoryClient({ borrowEventData }: HistoryClientProps) {
    return (
        <div className="flex flex-col gap-4 p-8">
            <h1>{borrowEventData.book.title}</h1>
        </div>
    );
}
