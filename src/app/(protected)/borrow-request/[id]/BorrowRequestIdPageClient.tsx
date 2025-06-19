"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import BorrowActivityDetail from "@/components/borrowComponent/BorrowActivityDetail";
import { BorrowRequestAction } from "@/components/borrowComponent/BorrowRequestAction";
import TitleBar from "@/components/TitleBar";
import { MeetUpDetail } from "@/components/activityComponent/MeetUpDetail";

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
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [borrowRequestData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
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
                router.push("/borrow-request");
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <TitleBar
                        title="Borrow Request Details"
                        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800"
                    />
                    <p className="text-sm sm:text-base text-gray-600 mt-2 sm:mt-3">
                        Review and respond to this borrowing request
                    </p>
                </div>

                {/* Content Layout */}
                <div className="space-y-6 lg:space-y-0">
                    {/* Mobile & Tablet Layout (Stacked) */}
                    <div className="lg:hidden space-y-6">
                        {/* Book Display */}
                        <div className="w-full max-w-sm mx-auto sm:mx-0">
                            <BookDisplayCard
                                bookImage={
                                    borrowRequestData.book.pictures[0].picture
                                }
                            />
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
