import { BorrowStatus } from "./borrow-status";
import { Book } from "./book";
import { User } from "./user";
import { MeetUpDetail } from "./meet-up-detail";
import { ReturnDetail } from "./return-detail";
import { RejectReason } from "./reject-reason";
import { CancelReason } from "./cancel-reason";

export type BorrowEvent = {
    id: string;
    borrower: User;
    lender: User;
    book: Book;
    borrow_status: BorrowStatus;
    meet_up_detail: MeetUpDetail;
    return_detail: ReturnDetail;
    borrower_id?: number;
    lender_id?: number;
    created_at?: string;
    updated_at?: string;
    borrow_event_reject_reason?: RejectReason;
    borrow_event_cancel_reason?: CancelReason;
};
