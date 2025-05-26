import { BorrowEvent } from "@/types/borrow-event";
import { Users } from "@/data/users";
import { Books } from "@/data/books";
import { BorrowStatus } from "@/types/borrow-status";

export const BorrowEvents: BorrowEvent[] = [
    {
        id: "1",
        borrowerId: Users[0],
        lenderId: Users[1],
        bookId: Books[2],
        startDate: "18/04/2025",
        endDate: "22/04/2025",
        meetUpTile: "",
        meetUpLocation: "",
        borrowStatus: BorrowStatus.Pending,
    },
];
