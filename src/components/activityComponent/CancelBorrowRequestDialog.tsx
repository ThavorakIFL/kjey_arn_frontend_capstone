import React, { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface CancelBorrowRequestDialogProps {
    onCancel: (reason: string) => void;
    isLoading: boolean;
}

export function CancelBorrowRequestDialog({
    onCancel,
    isLoading,
}: CancelBorrowRequestDialogProps) {
    const [reason, setReason] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const handleCancel = () => {
        onCancel(reason);
        setIsOpen(false);
        setReason("");
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className=" h-12 w-full xl:w-56  cursor-pointer"
                    variant="destructive"
                >
                    Cancel Borrowing
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-2xl">
                        Reason for Cancellation{" "}
                    </DialogTitle>
                    <DialogDescription className=" text-black text-md ">
                        Please provide a reason for cancelling the borrowing
                        request.
                    </DialogDescription>
                    <div className="w-full">
                        <input
                            className="w-full h-10 p-4 rounded-lg"
                            onChange={(e) => setReason(e.target.value)}
                            id="reason"
                            value={reason}
                            type="text"
                            placeholder="Enter Reason"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={handleCancel}
                            disabled={isLoading || !reason.trim()}
                        >
                            {isLoading ? "Cancelling..." : "Confirm Cancel"}
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
