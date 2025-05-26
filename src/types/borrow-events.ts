import { BorrowEvent } from "./borrow-event";

export type BorrowEvents = {
    lender_borrow_event?: BorrowEvent;
    borrower_borrow_event?: BorrowEvent;
};
