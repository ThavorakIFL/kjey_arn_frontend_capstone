import type { BorrowEvent } from "@/types/borrow-event";
import BorrowStatus from "./BorrowStatus";

interface BorrowEventProps {
    event: BorrowEvent;
    onClick?: (event: BorrowEvent) => void;
}

export default function BorrowEvent({ event, onClick }: BorrowEventProps) {
    console.log("BorrowEvent Status", event.borrow_status.borrow_status_id);
    return (
        <div
            onClick={() => {
                onClick && onClick(event);
            }}
            key={event.id}
            className=" cursor-pointer space-x-2 flex p-2 rounded-md max-w-96 max-h-40 bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:scale-105"
        >
            <img
                className="rounded-md max-h-30"
                alt={event.book.title}
                src={
                    process.env.NEXT_PUBLIC_IMAGE_PATH +
                    event.book.pictures[0].picture
                }
            />
            <div className="flex-grow flex flex-col justify-between">
                <div>
                    <h1 className="font-medium">{event.book.title}</h1>
                    <div>Lender: {event.lender.name}</div>
                    <div>Borrower: {event.borrower.name}</div>
                </div>
                <div className="flex-grow flex w-full items-end justify-end ">
                    <BorrowStatus
                        statusId={event.borrow_status.borrow_status_id}
                    />
                </div>
            </div>
        </div>
    );
}
