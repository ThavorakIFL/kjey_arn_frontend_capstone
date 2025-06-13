import React from "react";
import { RejectDialog } from "./RejectDialog";
import { AcceptDialog } from "./AcceptDialog";

interface BorrowRequestActionProps {
    onAccept: (formData: {
        final_time: string;
        final_location: string;
    }) => void;
    onReject: (reason: string) => void;
    isSubmitting: boolean;
}

export function BorrowRequestAction({
    onAccept,
    onReject,
    isSubmitting,
}: BorrowRequestActionProps) {
    return (
        <div className="flex justify-end space-x-8">
            <RejectDialog onReject={onReject} isSubmitting={isSubmitting} />
            <AcceptDialog onAccept={onAccept} isSubmitting={isSubmitting} />
        </div>
    );
}
