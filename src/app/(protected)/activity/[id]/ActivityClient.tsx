"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

interface ActivityClientProps {
    borrowEventData: BorrowEventType;
    cancelBorrowRequest: (
        id: string,
        reason: string
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    acceptMeetUpRequest: (
        id: string,
        meet_up_status_id: number
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    setReturnDetail: (
        id: string,
        formData: FormData
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    confirmReceiveBook: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
    suggestMeetUpRequest: (
        id: string,
        formData: FormData
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    acceptSuggestion: (id: string) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export default function ActivityClient({
    acceptSuggestion,
    suggestMeetUpRequest,
    confirmReceiveBook,
    setReturnDetail,
    acceptMeetUpRequest,
    cancelBorrowRequest,
    borrowEventData,
}: ActivityClientProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isStartDate, setIsStartDate] = useState(false);
    const [returnFormData, setReturnFormData] = useState({
        return_time: "08:00",
        return_location: "",
    });
    const [suggestFormData, setSuggestFormData] = useState({
        suggested_time: "",
        suggested_location: "",
        suggested_reason: "",
    });

    const [reason, setReason] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    useEffect(() => {
        const checkStartDate = () => {
            const currentDate = new Date();
            const formattedStartDate = currentDate.toISOString().split("T")[0];
            const startDate = borrowEventData.meet_up_detail.start_date;
            setIsStartDate(formattedStartDate === startDate);
        };
        checkStartDate();
    }, [borrowEventData.meet_up_detail.start_date]);

    //For Displaying The receive Book Button and handle receive book
    const [isTimeToReceive, setisTimeToReceive] = useState(false);
    useEffect(() => {
        const checkReturnTimeAndDate = () => {
            const currentDate = new Date();
            const formattedCurrentDate = currentDate
                .toISOString()
                .split("T")[0];
            const returnDate = borrowEventData.return_detail.return_date;
            let returnTime;
            try {
                if (borrowEventData.return_detail.return_time !== null) {
                    returnTime = new Date(
                        `${borrowEventData.return_detail.return_time}`
                    );
                    if (isNaN(returnTime.getTime())) {
                        const [hours, minutes] =
                            borrowEventData.return_detail.return_time
                                .split(":")
                                .map(Number);
                        returnTime = new Date();
                        returnTime.setHours(hours, minutes, 0, 0);
                    }
                } else {
                    return;
                }
            } catch (error) {
                console.error("Error parsing return time:", error);
                return;
            }

            const oneHourAfterReturn = new Date(returnTime);
            oneHourAfterReturn.setHours(returnTime.getHours() + 1);
            // Check if current time is within the 1-hour window after return time AND it's the return date
            if (
                currentDate.getTime() >= returnTime.getTime() &&
                currentDate.getTime() <= oneHourAfterReturn.getTime() &&
                returnDate === formattedCurrentDate
            ) {
                setisTimeToReceive(true);
            } else {
                setisTimeToReceive(false);
            }
        };
        checkReturnTimeAndDate();
        const intervalId = setInterval(checkReturnTimeAndDate, 60000);
        return () => clearInterval(intervalId);
    }, [
        borrowEventData.return_detail.return_time,
        borrowEventData.return_detail.return_date,
    ]);
    const handleReceiveBook = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await confirmReceiveBook(borrowEventData.id);
            if (result.success) {
                alert("Book received successfully!");
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error confirming receive book:", error);
            setError("Failed to confirm receive book. Please try again.");
        }
    };

    //For Setting Up Return Detail
    const handleReturnTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setReturnFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleReturnSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setReturnFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleReturnSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const returnFormDataToSend = new FormData();
            returnFormDataToSend.append(
                "return_time",
                returnFormData.return_time
            );
            returnFormDataToSend.append(
                "return_location",
                returnFormData.return_location
            );
            const result = await setReturnDetail(
                borrowEventData.id,
                returnFormDataToSend
            );
            if (result.success) {
                alert(result.message);
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("An error occurred while submitting the form.");
        } finally {
            setIsSubmitting(false);
            router.push("/home");
        }
    };

    //For Suggesting New Meet Up
    const handleSuggestSelectChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setSuggestFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSuggestTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setSuggestFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleSuggestSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const suggestFormDataToSend = new FormData();
            suggestFormDataToSend.append(
                "suggested_time",
                suggestFormData.suggested_time
            );
            suggestFormDataToSend.append(
                "suggested_location",
                suggestFormData.suggested_location
            );
            suggestFormDataToSend.append(
                "suggested_reason",
                suggestFormData.suggested_reason
            );
            const result = await suggestMeetUpRequest(
                borrowEventData.id,
                suggestFormDataToSend
            );
            if (result.success) {
                alert(result.message);
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("An error occurred while submitting the form.");
        } finally {
            setIsSubmitting(false);
        }
    };

    //For Accepting Suggestion
    const handleAcceptSuggestion = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await acceptSuggestion(borrowEventData.id);
            if (result.success) {
                alert("Suggestion accepted successfully!");
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error accepting suggestion:", error);
            setError("Failed to accept suggestion. Please try again.");
        }
    };

    //For Cancelling Requests
    const handleCancelRequest = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await cancelBorrowRequest(
                borrowEventData.id,
                reason
            );
            if (result.success) {
                alert("Borrow request canceled successfully!");
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error canceling borrow request:", error);
            setError("Failed to cancel borrow request. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };
    const handleReasonCancel = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setReason(value);
    };

    //For Confirming Meet Up
    const handleConfirmMeetUp = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await acceptMeetUpRequest(borrowEventData.id, 2);
            if (result.success) {
                alert("Meet up confirmed successfully!");
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error confirming meet up:", error);
            setError("Failed to confirm meet up. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const statusTitle = (status: number) => {
        switch (status) {
            case 1:
                return "Pending";
            case 2:
                return "Approved";
            case 4:
                return "In Progress";
        }
    };

    const statusDetail = (status: number) => {
        switch (status) {
            case 1:
                return "Waiting for lender to accept";
            case 2:
                return "Approved";
            case 4:
                return "In Progress Borrow Requests";
        }
    };

    const canSuggestMeetUp = () => {
        if (
            borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                ?.meet_up_status_id !== 1 ||
            borrowEventData.borrow_status.borrow_status_id !== 2
        ) {
            return false;
        }

        const suggestions = borrowEventData.meet_up_detail.suggestions || [];
        const userIsBorrower =
            session?.userSubId === borrowEventData.borrower.sub;
        const userHasSuggested = suggestions.some(
            (suggestion) => suggestion.user?.sub === session?.userSubId
        );

        if (suggestions.length === 0) {
            return userIsBorrower;
        }

        // If suggestions exist, any user who hasn't suggested can make a suggestion
        return !userHasSuggested;
    };

    const getMeetupActionButton = () => {
        const isBorrower = session?.userSubId === borrowEventData.borrower.sub;
        const isLender = session?.userSubId === borrowEventData.lender.sub;
        const isApprovedBorrowStatus =
            borrowEventData.borrow_status.borrow_status_id === 2;
        const isPendingMeetupStatus =
            borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                ?.meet_up_status_id === 1;
        const suggestions = borrowEventData.meet_up_detail.suggestions || [];
        const hasSuggestions = suggestions.length > 0;

        // Determine whose turn it is based on specific rules
        let isLenderTurn = false;
        let isBorrowerTurn = false;

        if (!hasSuggestions) {
            // If no suggestions yet, borrower initiates (but this shouldn't happen in your UI flow)
            isBorrowerTurn = true;
            isLenderTurn = false;
        } else {
            // Get the last suggestion to determine whose turn it is next
            const lastSuggestion = suggestions[suggestions.length - 1];
            const lastSuggestedUserSub = String(lastSuggestion.user?.sub);
            const borrowerSub = String(borrowEventData.borrower.sub);
            const lastSuggestedByBorrower =
                lastSuggestedUserSub === borrowerSub;

            if (suggestions.length === 1 && lastSuggestedByBorrower) {
                // If only one suggestion and it's from borrower, it's lender's turn
                isLenderTurn = true;
                isBorrowerTurn = false;
            } else if (suggestions.length >= 2) {
                // If there are 2+ suggestions:
                // - If last was from borrower, lender accepts/counters
                // - If last was from lender, borrower accepts (final step)
                isLenderTurn = lastSuggestedByBorrower;
                isBorrowerTurn = !lastSuggestedByBorrower;
            }

            console.log("Borrower sub:", borrowerSub);
            console.log("Lender sub:", String(borrowEventData.lender.sub));
            console.log("Current user sub:", session?.userSubId);
            console.log("All suggestions:");
            suggestions.forEach((suggestion, index) => {
                console.log(`Suggestion ${index + 1}:`);
                console.log(`  User sub: ${suggestion.user?.sub}`);
                console.log(
                    `  Is from borrower: ${
                        String(suggestion.user?.sub) === borrowerSub
                    }`
                );
                console.log(
                    `  Content: ${suggestion.suggested_time}, ${suggestion.suggested_location}`
                );
            });
        }

        // Original condition for "Accept Meet Up" button - initial setup with no suggestions
        if (
            isApprovedBorrowStatus &&
            isBorrower &&
            isPendingMeetupStatus &&
            !hasSuggestions
        ) {
            return (
                <Button onClick={handleConfirmMeetUp} variant={"default"}>
                    Accept Meet Up
                </Button>
            );
        }

        // Borrower's turn to accept suggestion from lender
        if (
            isApprovedBorrowStatus &&
            isPendingMeetupStatus &&
            hasSuggestions &&
            isBorrower &&
            isBorrowerTurn
        ) {
            return (
                <Button onClick={handleAcceptSuggestion} variant={"default"}>
                    Accept Suggestion
                </Button>
            );
        }

        // Lender's turn to accept suggestion from borrower
        if (
            isApprovedBorrowStatus &&
            isPendingMeetupStatus &&
            hasSuggestions &&
            isLender &&
            isLenderTurn
        ) {
            return (
                <Button onClick={handleAcceptSuggestion} variant={"default"}>
                    Accept Suggestion
                </Button>
            );
        }

        // Return null if no conditions match
        return null;
    };

    return (
        <div className="p-8">
            <div>
                <h1 className="font-bold text-3xl">
                    {statusTitle(
                        borrowEventData.borrow_status.borrow_status_id
                    )}{" "}
                    Request
                </h1>
                <h1 className="font-bold">
                    {statusDetail(
                        borrowEventData.borrow_status.borrow_status_id
                    )}{" "}
                </h1>
                <Avatar>
                    <AvatarImage
                        src={
                            (process.env.NEXT_PUBLIC_IMAGE_PATH || "") +
                            (borrowEventData?.lender?.picture || "")
                        }
                    />
                    <AvatarFallback>
                        {borrowEventData.lender.name
                            .split(" ")
                            .filter(Boolean)
                            .map((name) => name[0])
                            .slice(0, 2)
                            .join("")}
                    </AvatarFallback>
                </Avatar>
                <h1>{borrowEventData.lender.name}</h1>
                <h1>{borrowEventData.lender.email}</h1>
                <h1>{borrowEventData.book.title}</h1>
                <div className="bg-red-200 flex justify-between">
                    <h1>Borrow Duration:</h1>
                    <h1>
                        Start Date: {borrowEventData.meet_up_detail.start_date}
                    </h1>
                    <h1>End Date: {borrowEventData.meet_up_detail.end_date}</h1>
                </div>
                {borrowEventData.borrow_status.borrow_status_id !== 4 ? (
                    <div className="flex justify-evenly">
                        <h1>Meet Up Details:</h1>
                        <h1>
                            Meet Up Time:{" "}
                            {borrowEventData.meet_up_detail.final_time}
                        </h1>
                        <h1> Meet Up Location: </h1>
                        <h1>{borrowEventData.meet_up_detail.final_location}</h1>
                    </div>
                ) : (
                    <div className="flex justify-evenly">
                        <h1>Return Details:</h1>
                        <h1>
                            Return Time:{" "}
                            {borrowEventData.return_detail.return_time}
                        </h1>
                        <h1> Return Location: </h1>
                        <h1>{borrowEventData.return_detail.return_location}</h1>
                    </div>
                )}
                {borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                    ?.meet_up_status_id === 1 &&
                    session?.userSubId === borrowEventData.borrower.sub && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    className="w-full md:w-auto"
                                    variant="destructive"
                                >
                                    Cancel Borrowing
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Cancel Borrow Request
                                    </DialogTitle>
                                    <DialogDescription>
                                        Are you sure you want to cancel this
                                        borrow request? This action cannot be
                                        undone.
                                    </DialogDescription>
                                    <div className="w-full">
                                        <label
                                            htmlFor="reason"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Reason For Cancelation
                                        </label>
                                        <input
                                            className="w-full"
                                            onChange={handleReasonCancel}
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
                                            onClick={() => {}}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="destructive"
                                            onClick={handleCancelRequest}
                                            disabled={isLoading}
                                        >
                                            {isLoading
                                                ? "Cancelling..."
                                                : "Confirm Cancel"}
                                        </Button>
                                    </DialogFooter>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                    )}

                {canSuggestMeetUp() && (
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>Suggest New Meet Up Time</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>
                                    Suggest New Meet Up Time
                                </DialogTitle>
                                <DialogDescription>
                                    Please provide your suggested time and
                                    location for the meet up.
                                </DialogDescription>
                                <form onSubmit={handleSuggestSubmit}>
                                    <div>
                                        <label
                                            htmlFor="suggested_time"
                                            className="block text-sm font-medium mb-2"
                                        >
                                            Suggest Time:
                                        </label>
                                        <select
                                            name="suggested_time"
                                            id="suggested_time"
                                            onChange={handleSuggestSelectChange}
                                            value={
                                                suggestFormData.suggested_time
                                            }
                                        >
                                            {Array.from(
                                                { length: 10 },
                                                (_, i) => {
                                                    const hour = i + 8; // Start from 8
                                                    const displayHour =
                                                        hour > 12
                                                            ? hour - 12
                                                            : hour;
                                                    const amPm =
                                                        hour < 12 ? "AM" : "PM";
                                                    const value = `${hour
                                                        .toString()
                                                        .padStart(2, "0")}:00`;

                                                    return (
                                                        <option
                                                            key={hour}
                                                            value={value}
                                                        >
                                                            {displayHour}
                                                            :00 {amPm}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                        <div className="mb-4">
                                            <label htmlFor="suggested_location">
                                                Suggest Location
                                            </label>
                                            <input
                                                onChange={
                                                    handleSuggestTextChange
                                                }
                                                value={
                                                    suggestFormData.suggested_location
                                                }
                                                id="suggested_location"
                                                name="suggested_location"
                                                type="text"
                                                className="border border-gray-300 rounded-md p-2 w-full"
                                                placeholder="Suggest location"
                                            />
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="suggested_reason">
                                                Reason for Suggestion
                                            </label>
                                            <input
                                                onChange={
                                                    handleSuggestTextChange
                                                }
                                                value={
                                                    suggestFormData.suggested_reason
                                                }
                                                id="suggested_reason"
                                                name="suggested_reason"
                                                className="border border-gray-300 rounded-md p-2 w-full"
                                                placeholder="Enter reason"
                                                type="text"
                                            />
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="default"
                                            disabled={isSubmitting}
                                        >
                                            Suggest New Meet Up
                                        </Button>
                                    </div>
                                </form>
                            </DialogHeader>
                        </DialogContent>
                    </Dialog>
                )}

                {getMeetupActionButton()}

                {session?.userSubId === borrowEventData.lender.sub && (
                    <Button onClick={handleReceiveBook}>
                        {" "}
                        Owner Confirm Received Book{" "}
                    </Button>
                )}

                {borrowEventData.meet_up_detail.suggestions && (
                    <div className="bg-blue-200">
                        {borrowEventData.meet_up_detail.suggestions.map(
                            (suggestion) => {
                                return (
                                    <div key={suggestion.id}>
                                        <h1>
                                            Suggested By:{" "}
                                            {suggestion.user?.name}
                                        </h1>
                                        <h1>
                                            Suggested Time:{" "}
                                            {suggestion.suggested_time}
                                        </h1>
                                        <h1>
                                            Suggested Location:{" "}
                                            {suggestion.suggested_location}
                                        </h1>
                                        <h1>
                                            Suggested Reason:{" "}
                                            {suggestion.suggested_reason}
                                        </h1>
                                    </div>
                                );
                            }
                        )}
                    </div>
                )}

                {isStartDate &&
                    borrowEventData.borrow_status.borrow_status_id === 2 && (
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>Confirm Received Book</Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>
                                        Confirm Received Book and Return Detail
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please confirm that you have received
                                        the book and provide return details.
                                    </DialogDescription>
                                </DialogHeader>

                                <form action="">
                                    <div className="mb-4">
                                        <label
                                            className="block text-sm font-medium mb-2"
                                            htmlFor="return_time"
                                        >
                                            Return Time:
                                        </label>
                                        <select
                                            name="return_time"
                                            id="return_time"
                                            onChange={handleReturnSelectChange}
                                            value={returnFormData.return_time}
                                        >
                                            {Array.from(
                                                { length: 10 },
                                                (_, i) => {
                                                    const hour = i + 8; // Start from 8
                                                    const displayHour =
                                                        hour > 12
                                                            ? hour - 12
                                                            : hour;
                                                    const amPm =
                                                        hour < 12 ? "AM" : "PM";
                                                    const value = `${hour
                                                        .toString()
                                                        .padStart(2, "0")}:00`;

                                                    return (
                                                        <option
                                                            key={hour}
                                                            value={value}
                                                        >
                                                            {displayHour}
                                                            :00 {amPm}
                                                        </option>
                                                    );
                                                }
                                            )}
                                        </select>
                                    </div>
                                    <div className="mb-4">
                                        <label htmlFor="return_location">
                                            Return Location
                                        </label>
                                        <input
                                            onChange={handleReturnTextChange}
                                            value={
                                                returnFormData.return_location
                                            }
                                            id="return_location"
                                            name="return_location"
                                            type="text"
                                            className="border border-gray-300 rounded-md p-2 w-full"
                                            placeholder="Enter location"
                                        />
                                    </div>
                                    <Button
                                        type="button"
                                        variant="default"
                                        onClick={handleReturnSubmit}
                                        disabled={isSubmitting}
                                    >
                                        Set Return Detail
                                    </Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    )}
            </div>
        </div>
    );
}
