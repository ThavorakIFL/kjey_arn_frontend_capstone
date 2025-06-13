"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface RejectDialogProps {
    onReject: (reason: string) => void;
    isSubmitting: boolean;
}

export function RejectDialog({ onReject, isSubmitting }: RejectDialogProps) {
    const [rejectReason, setRejectReason] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const handleReject = () => {
        onReject(rejectReason || "");
        setIsOpen(false);
        setRejectReason(null);
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-30 h-14 cursor-pointer"
                    variant={"destructive"}
                >
                    Reject
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Reject Borrow Request</DialogTitle>
                    <DialogDescription>
                        Are you sure you want to reject this borrow request?
                        This action cannot be undone.
                    </DialogDescription>
                    <div className="w-full">
                        <label
                            htmlFor="rejectReason"
                            className="block text-sm font-medium mb-2"
                        >
                            Reason For Rejection
                        </label>
                        <input
                            className="w-full"
                            onChange={(e) => setRejectReason(e.target.value)}
                            id="rejectReason"
                            value={rejectReason || ""}
                            type="text"
                            placeholder="Enter Reason for Rejection"
                        />
                    </div>
                    <DialogFooter>
                        <Button
                            onClick={() => setIsOpen(false)}
                            className="w-30 h-14 cursor-pointer"
                            variant={"outline"}
                        >
                            Cancel
                        </Button>
                        <Button
                            disabled={isSubmitting || !rejectReason}
                            className="w-30 h-14 cursor-pointer"
                            onClick={handleReject}
                            variant={"destructive"}
                        >
                            {" "}
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
