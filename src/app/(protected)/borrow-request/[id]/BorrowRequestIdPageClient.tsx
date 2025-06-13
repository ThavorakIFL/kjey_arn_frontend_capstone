"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import BorrowActivityDetail from "@/components/borrowComponent/BorrowActivityDetail";
import { BorrowRequestAction } from "@/components/borrowComponent/BorrowRequestAction";
interface BorrowRequestIdPageClientProps {
    borrowRequestData: BorrowEventType;
    setMeetUpDetail: (
        id: string,
        formData: FormData
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    rejectBorrowRequest: (
        id: string,
        reason: string
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export default function BorrowRequestIdPageClient({
    borrowRequestData,
    setMeetUpDetail,
    rejectBorrowRequest,
}: BorrowRequestIdPageClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleAccept = async (meetUpData: {
        final_time: string;
        final_location: string;
    }) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("final_time", meetUpData.final_time);
            formDataToSend.append("final_location", meetUpData.final_location);
            const result = await setMeetUpDetail(
                borrowRequestData.id,
                formDataToSend
            );

            if (result.success) {
                router.push("/activity");
            } else {
                setError(result.message);
            }
        } catch (err) {
            console.error("Error setting meet up details:", err);
            setError("Failed to set meet up details. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReject = async (reason: string) => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await rejectBorrowRequest(
                borrowRequestData.id,
                reason
            );
            if (result.success) {
                alert(result.message);
                router.push("/home");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error rejecting borrow request:", error);
            setError("An error occurred while rejecting the borrow request.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Borrow Request Details</h1>
            <div className="grid grid-cols-12 gap-8 items-start py-8">
                <div className="col-span-2">
                    <BookDisplayCard
                        bookImage={borrowRequestData.book.pictures[0].picture}
                    />
                </div>
                <div className="col-span-6 space-y-4 ">
                    <BorrowActivityDetail
                        borrowStatus={
                            borrowRequestData.borrow_status.borrow_status_id
                        }
                        bookTitle={borrowRequestData.book.title}
                        bookAuthor={borrowRequestData.book.author}
                        borrowerProfileImage={
                            borrowRequestData.borrower.picture || ""
                        }
                        borrowerName={borrowRequestData.borrower.name}
                        borrowerEmail={borrowRequestData.borrower.email}
                        startDate={borrowRequestData.meet_up_detail.start_date}
                        endDate={borrowRequestData.meet_up_detail.end_date}
                    />
                    <BorrowRequestAction
                        onAccept={handleAccept}
                        onReject={handleReject}
                        isSubmitting={isSubmitting}
                    />
                </div>
                <div className="col-span-4"></div>
            </div>
        </div>
    );
}
