import type { BorrowEvent } from "@/types/borrow-event";
import BorrowStatus from "./BorrowStatus";

interface BorrowEventProps {
    event: BorrowEvent;
    onClick?: (event: BorrowEvent) => void;
}

export default function BorrowEvent({ event, onClick }: BorrowEventProps) {
    return (
        <div
            onClick={() => {
                onClick && onClick(event);
            }}
            key={event.id}
            className="cursor-pointer flex p-3 sm:p-4 rounded-lg w-full bg-white border border-gray-200 transition-all duration-300 hover:shadow-lg hover:border-blue-300 hover:scale-[1.02] active:scale-[0.98]"
        >
            {/* Image Container - Consistent Compact Size */}
            <div className="flex-shrink-0 w-16 sm:w-20">
                <div className="aspect-[3/4] w-full">
                    <img
                        className="w-full h-full object-cover rounded-md shadow-sm"
                        alt={event.book.title}
                        src={
                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                            event.book.pictures[0].picture
                        }
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col justify-between ml-3 sm:ml-4 min-w-0">
                {/* Book Information */}
                <div className="space-y-1 sm:space-y-2">
                    <h1 className="font-semibold text-sm sm:text-base lg:text-lg text-gray-900 line-clamp-2 leading-tight">
                        {event.book.title}
                    </h1>
                    <div className="space-y-1">
                        <div className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Lender:</span>{" "}
                            {event.lender.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">
                            <span className="font-medium">Borrower:</span>{" "}
                            {event.borrower.name}
                        </div>
                    </div>
                </div>

                {/* Status Container */}
                <div className="flex justify-end mt-2 sm:mt-3">
                    <BorrowStatus
                        statusId={event.borrow_status.borrow_status_id}
                    />
                </div>
            </div>
        </div>
    );
}
