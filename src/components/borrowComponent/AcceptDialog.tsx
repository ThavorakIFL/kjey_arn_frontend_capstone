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
import { MeetupForm } from "./MeetupForm";

interface AcceptDialogProps {
    onAccept: (formData: {
        final_time: string;
        final_location: string;
    }) => void;
    isSubmitting: boolean;
}

export function AcceptDialog({ onAccept, isSubmitting }: AcceptDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const handleAccept = (formData: {
        final_time: string;
        final_location: string;
    }) => {
        onAccept(formData);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button
                    className="w-30 h-14 cursor-pointer"
                    disabled={isSubmitting}
                >
                    Accept
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Meet Up Details</DialogTitle>
                    <DialogDescription>
                        Please set meet up time and location
                    </DialogDescription>
                    <MeetupForm
                        onSubmit={handleAccept}
                        isSubmitting={isSubmitting}
                    />
                    <DialogFooter>
                        <div className="flex space-x-4">
                            <Button
                                onClick={() => setIsOpen(false)}
                                className="w-30 h-14 cursor-pointer"
                                variant={"destructive"}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                form="meetupForm"
                                className="w-30 h-14 cursor-pointer"
                                disabled={isSubmitting}
                                variant={"default"}
                            >
                                Confirm
                            </Button>
                        </div>
                    </DialogFooter>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
