"use client";

import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";
interface HistoryPageClientProps {
    historyBorrowEventData: BorrowEventType[];
}

export default function HistoryPageClient({
    historyBorrowEventData = [],
}: HistoryPageClientProps) {
    return (
        <div className="flex flex-col  p-8">
            <TitleBar title="History" />
            {historyBorrowEventData.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {historyBorrowEventData.slice(0, 4).map((event) => (
                        <Link href={`/history/${event.id} `} key={event.id}>
                            <BorrowEvent event={event} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
