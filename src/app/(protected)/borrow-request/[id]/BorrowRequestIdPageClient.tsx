"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import BorrowActivityDetail from "@/components/borrowComponent/BorrowActivityDetail";
import { BorrowRequestAction } from "@/components/borrowComponent/BorrowRequestAction";
import TitleBar from "@/components/TitleBar";
import { MeetUpDetail } from "@/components/activityComponent/MeetUpDetail";
import { toast } from "sonner";

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
    locationData: {
        success: boolean;
        message: string;
        data: any[];
    };
}

export default function BorrowRequestIdPageClient({
    locationData,
    borrowRequestData,
    setMeetUpDetail,
    rejectBorrowRequest,
}: BorrowRequestIdPageClientProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [borrowRequestData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center ">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

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
                toast.success(
                    result.message || "Meet up details set successfully!"
                );
                router.push("/activity");
            } else {
                toast.error(result.message || "Failed to set meet up details");
            }
        } catch (err) {
            toast.error(
                err instanceof Error
                    ? err.message
                    : "Failed to set meet up details. Please try again."
            );
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
                toast.success(
                    result.message || "Borrow request rejected successfully!"
                );
                router.push("/borrow-request");
            } else {
                toast.error(
                    result.message || "Failed to reject borrow request"
                );
            }
        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An error occurred while rejecting the borrow request."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="">
                {/* Header Section */}
                <div className="mb-4 sm:mb-8">
                    <TitleBar
                        title="Borrow Request Details"
                        subTitle="View and manage the details of this borrow request"
                    />
                </div>

                {/* Content Layout */}
                <div className="space-y-6 lg:space-y-0">
                    {/* Mobile & Tablet Layout (Stacked) */}
                    <div className="lg:hidden space-y-6">
                        <div className="lg:hidden flex justify-center">
                            {/* Book Display */}
                            <div className="w-48 sm:w-56">
                                <BookDisplayCard
                                    bookImage={
                                        borrowRequestData.book.pictures[0]
                                            .picture
                                    }
                                />
                            </div>
                        </div>

                        {/* Main Details */}
                        <div className="space-y-6">
                            <BorrowActivityDetail
                                borrowStatus={
                                    borrowRequestData.borrow_status
                                        .borrow_status_id
                                }
                                bookTitle={borrowRequestData.book.title}
                                bookAuthor={borrowRequestData.book.author}
                                borrowerProfileImage={
                                    borrowRequestData.borrower.picture || ""
                                }
                                lenderProfileImage={
                                    borrowRequestData.lender.picture || ""
                                }
                                borrowerSubId={borrowRequestData.borrower.sub}
                                lenderSubId={borrowRequestData.lender.sub}
                                borrowerName={borrowRequestData.borrower.name}
                                borrowerEmail={borrowRequestData.borrower.email}
                                lenderName={borrowRequestData.lender.name}
                                lenderEmail={borrowRequestData.lender.email}
                                startDate={
                                    borrowRequestData.meet_up_detail.start_date
                                }
                                endDate={
                                    borrowRequestData.meet_up_detail.end_date
                                }
                            />

                            {/* MeetUp Details */}
                            <MeetUpDetail
                                startDate={
                                    borrowRequestData.meet_up_detail.start_date
                                }
                                endDate={
                                    borrowRequestData.meet_up_detail.end_date
                                }
                            />

                            {/* Action or Warning */}
                            {borrowRequestData.book.availability
                                .availability_id === 1 ? (
                                <BorrowRequestAction
                                    locationData={locationData}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    isSubmitting={isSubmitting}
                                />
                            ) : (
                                <div className="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-500 mt-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                Request Already Exists
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                This book has already been
                                                confirmed.
                                            </p>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Try browsing other titles while
                                                you wait.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-red-600 text-sm font-medium">
                                        {error}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Desktop Layout (Grid) */}
                    <div className="hidden lg:grid lg:grid-cols-12 lg:gap-8">
                        {/* Book Display - Left Column */}
                        <div className="lg:col-span-2">
                            <BookDisplayCard
                                bookImage={
                                    borrowRequestData.book.pictures[0].picture
                                }
                            />
                        </div>

                        {/* Details and Actions - Center Columns */}
                        <div className="lg:col-span-7 space-y-6">
                            <BorrowActivityDetail
                                borrowStatus={
                                    borrowRequestData.borrow_status
                                        .borrow_status_id
                                }
                                bookTitle={borrowRequestData.book.title}
                                bookAuthor={borrowRequestData.book.author}
                                borrowerProfileImage={
                                    borrowRequestData.borrower.picture || ""
                                }
                                borrowerSubId={borrowRequestData.borrower.sub}
                                lenderSubId={borrowRequestData.lender.sub}
                                lenderProfileImage={
                                    borrowRequestData.lender.picture || ""
                                }
                                borrowerName={borrowRequestData.borrower.name}
                                borrowerEmail={borrowRequestData.borrower.email}
                                lenderName={borrowRequestData.lender.name}
                                lenderEmail={borrowRequestData.lender.email}
                                startDate={
                                    borrowRequestData.meet_up_detail.start_date
                                }
                                endDate={
                                    borrowRequestData.meet_up_detail.end_date
                                }
                            />

                            {borrowRequestData.book.availability
                                .availability_id === 1 ? (
                                <BorrowRequestAction
                                    locationData={locationData}
                                    onAccept={handleAccept}
                                    onReject={handleReject}
                                    isSubmitting={isSubmitting}
                                />
                            ) : (
                                <div className="bg-white border-l-4 border-red-500 rounded-lg p-4 shadow-sm">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0">
                                            <svg
                                                className="h-5 w-5 text-red-500 mt-0.5"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-medium text-gray-900">
                                                Request Already Exists
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-600">
                                                This book has already been
                                                confirmed.
                                            </p>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Try browsing other titles while
                                                you wait.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Error Display */}
                            {error && (
                                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                    <div className="text-red-600 text-sm font-medium">
                                        {error}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* MeetUp Details - Right Column */}
                        <div className="lg:col-span-3">
                            <MeetUpDetail
                                startDate={
                                    borrowRequestData.meet_up_detail.start_date
                                }
                                endDate={
                                    borrowRequestData.meet_up_detail.end_date
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
