export enum BorrowStatsEnum {
    Pending = "Pending",
    Accepted = "Accepted",
    Rejected = "Rejected",
    Cancelled = "Cancelled",
    OnGoing = "OnGoing",
    Return = "Return",
    Successful = "Successful",
    Delayed = "Delayed",
}

export type BorrowStatusType =
    (typeof BorrowStatsEnum)[keyof typeof BorrowStatsEnum];

export type BorrowStatus = {
    id: number;
    borrow_event_id: number;
    borrow_status_id: number; // Using the BorrowStatusType from the enum
    created_at: string;
    updated_at: string;
};

export const borrowStatusOptions = Object.values(BorrowStatsEnum);
