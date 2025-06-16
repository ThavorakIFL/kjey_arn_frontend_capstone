"use client";
import TitleBar from "@/components/TitleBar";
import { useRouter } from "next/navigation";
import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
interface BorrowRequestPageClientProps {
    userBorrowRequestData: BorrowEventType[];
}

export default function BorrowRequestPageClient({
    userBorrowRequestData,
}: BorrowRequestPageClientProps) {
    const router = useRouter();
    return (
        <div className="p-8">
            <TitleBar title="Borrow Requests" />

            {userBorrowRequestData.length > 0 ? (
                <div className="grid grid-cols-4 gap-4">
                    {" "}
                    {userBorrowRequestData.map((borrowEvent) => (
                        <div
                            onClick={() => {
                                router.push(
                                    `/borrow-request/${borrowEvent.id}`
                                );
                            }}
                            key={borrowEvent.id}
                        >
                            <BorrowEvent event={borrowEvent} />
                        </div>
                    ))}{" "}
                </div>
            ) : (
                <div className=" text-gray-500">No borrow requests found.</div>
            )}
        </div>
    );
}
