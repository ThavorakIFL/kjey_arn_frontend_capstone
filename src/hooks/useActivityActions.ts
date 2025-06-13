"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UserActivityActionsProps {
    borrowEventId: string;
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
    reportBorrowEvent: (
        id: string,
        reason: string
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export function useActivityActions({
    borrowEventId,
    acceptSuggestion,
    suggestMeetUpRequest,
    confirmReceiveBook,
    setReturnDetail,
    acceptMeetUpRequest,
    cancelBorrowRequest,
    reportBorrowEvent,
}: UserActivityActionsProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleReceiveBook = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await confirmReceiveBook(borrowEventId);
            if (result.success) {
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error confirming receive book:", error);
            setError("Failed to confirm receive book. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReturnSubmit = async (returnData: {
        return_time: string;
        return_location: string;
    }) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("return_time", returnData.return_time);
            formData.append("return_location", returnData.return_location);

            const result = await setReturnDetail(borrowEventId, formData);
            if (result.success) {
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

    const handleSuggestSubmit = async (suggestData: {
        suggested_time: string;
        suggested_location: string;
        suggested_reason: string;
    }) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const formData = new FormData();
            formData.append("suggested_time", suggestData.suggested_time);
            formData.append(
                "suggested_location",
                suggestData.suggested_location
            );
            formData.append("suggested_reason", suggestData.suggested_reason);

            const result = await suggestMeetUpRequest(borrowEventId, formData);
            if (result.success) {
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

    const handleAcceptSuggestion = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await acceptSuggestion(borrowEventId);
            if (result.success) {
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error accepting suggestion:", error);
            setError("Failed to accept suggestion. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRequest = async (reason: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await cancelBorrowRequest(borrowEventId, reason);
            if (result.success) {
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

    const handleConfirmMeetUp = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await acceptMeetUpRequest(borrowEventId, 2);
            if (result.success) {
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

    const handleBorrowEventReport = async (reason: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const result = await reportBorrowEvent(borrowEventId, reason);
            console.log("Reporting borrow event with reason:", reason);
            console.log("Borrow event ID:", borrowEventId);
            if (result.success) {
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error reporting borrow event:", error);
            setError("Failed to report borrow event. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        isSubmitting,
        setError,
        handleReceiveBook,
        handleReturnSubmit,
        handleSuggestSubmit,
        handleAcceptSuggestion,
        handleCancelRequest,
        handleConfirmMeetUp,
        handleBorrowEventReport,
    };
}
