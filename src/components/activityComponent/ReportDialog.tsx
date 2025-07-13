import React, { useState, useEffect, useMemo } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { useSession } from "next-auth/react";

interface ReportDialogProps {
    isTimeToReturn?: boolean;
    sub: string;
    onReport: (reason: string) => void;
    isLoading: boolean;
}

export function ReportDialog({
    onReport,
    isLoading,
    sub,
    isTimeToReturn,
}: ReportDialogProps) {
    const { data: session } = useSession();
    const [reason, setReason] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [isChecked, setIsChecked] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [isSecondAlertOpen, setIsSecondAlertOpen] = useState(false);

    const isBorrower = useMemo(() => {
        return sub === session?.userSubId;
    }, [sub, session?.userSubId]);

    const reportMessage = useMemo(() => {
        return isBorrower
            ? "Lender didn't show up. "
            : "Borrower didn't show up.";
    }, [isBorrower]);

    const reportMessageForReturn = useMemo(() => {
        return isBorrower
            ? "Lender didn't show up. Borrower has reqeuest to deposit book in the library."
            : "Borrower didn't show up. Lender has reequest book to be deposit in the library.";
    }, [isBorrower]);

    const handleReport = () => {
        if (isChecked) {
            if (isTimeToReturn) {
                onReport(reportMessageForReturn);
            } else {
                onReport(reason);
            }
            setIsOpen(false);
            setReason("");
            setIsChecked(false);
        }
    };

    const handleAlertConfirm = () => {
        if (isTimeToReturn) {
            setIsSecondAlertOpen(true);
        }
        setIsAlertOpen(true);
    };

    const handleAlertCancel = (): void => {
        setIsAlertOpen(false);
    };

    const handleSecondAlertCancel = (): void => {
        setIsSecondAlertOpen(false);
        setIsOpen(false);
        setReason("");
        setIsChecked(false);
    };

    const handleSecondAlertConfirm = () => {
        setIsAlertOpen(true);
    };

    const handleCheckBoxChange = (checked: boolean) => {
        setIsChecked(checked);
        if (checked) {
            setReason(reportMessage);
        } else {
            setReason("");
        }
    };

    return (
        <div className="w-full md:w-auto">
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                    <Button
                        className="w-full md:w-40 h-12 cursor-pointer whitespace-normal text-sm leading-tight"
                        variant="destructive"
                    >
                        {isTimeToReturn ? "Report" : "Cancel"}
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">
                            Reason for Cancellation
                        </DialogTitle>
                    </DialogHeader>
                    <div className="w-full">
                        <Label className="hover:bg-accent/50 flex items-center gap-3 rounded-lg border p-3 has-[[aria-checked=true]]:border-red-600">
                            <Checkbox
                                checked={isChecked}
                                onCheckedChange={handleCheckBoxChange}
                                className="w-6 h-6 data-[state=checked]:border-red-600 data-[state=checked]:bg-red-600 data-[state=checked]:text-white dark:data-[state=checked]:border-red-700 dark:data-[state=checked]:bg-red"
                            />
                            <div className="font-medium">
                                <p className="text-lg leading-none">
                                    {reportMessage}
                                </p>
                            </div>
                        </Label>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <Button
                            onClick={() => setIsOpen(false)}
                            variant="outline"
                            className="h-12 w-36"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAlertConfirm}
                            disabled={!isChecked || isLoading}
                            className="h-12 w-36"
                        >
                            {isLoading ? "Confirming..." : "Confirm"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Confirm Report</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isTimeToReturn
                                ? isBorrower
                                    ? "Please deposit the book in the library and notify the librarian."
                                    : "The borrower have been notified please don't forget to get the book and confirm the deposit."
                                : "Would you like to cancel this borrow activity?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleSecondAlertCancel}
                            className="h-12 w-36"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleReport}
                            className="h-12 w-36"
                        >
                            {isLoading ? "Confirming..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog
                open={isSecondAlertOpen}
                onOpenChange={setIsSecondAlertOpen}
            >
                <AlertDialogTrigger asChild></AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Deposit Book</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isBorrower
                                ? "Would you like to deposit the book?"
                                : "Would you like to request a book deposit?"}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel
                            onClick={handleAlertCancel}
                            className="h-12 w-36"
                        >
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleSecondAlertConfirm}
                            className="h-12 w-36"
                        >
                            {isLoading ? "Confirming..." : "Confirm"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
