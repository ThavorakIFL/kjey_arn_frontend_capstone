"use client";

import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BookDisplayCard } from "@/components/bookComponent/BookDisplayCard";
import BorrowActivityDetail from "@/components/borrowComponent/BorrowActivityDetail";
import { MeetUpDetail } from "@/components/activityComponent/MeetUpDetail";
import { useActivityActions } from "@/hooks/useActivityActions";
import { CancelBorrowRequestDialog } from "@/components/activityComponent/CancelBorrowRequestDialog";
import { SuggestMeetupDialog } from "@/components/activityComponent/SuggestMeetupDialog";
import { ReturnDetailDialog } from "@/components/activityComponent/ReturnDetailDialog";
import { GuideMessage } from "@/components/activityComponent/GuideMessage";
import { SuggestMeetUpDetail } from "@/components/activityComponent/SuggestMeetUpDetail";
import { ReportDialog } from "@/components/activityComponent/ReportDialog";
import { ReturnDetail } from "@/components/activityComponent/ReturnDetail";

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
    reportBorrowEvent: (
        id: string,
        reason: string
    ) => Promise<{
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
    reportBorrowEvent,
    borrowEventData,
}: ActivityClientProps) {
    const { data: session } = useSession();
    const [isStartDate, setIsStartDate] = useState(false);
    const [isTimeToReturn, setisTimeToReturn] = useState(false);
    const [loading, setLoading] = useState(true);

    const {
        isLoading,
        error,
        isSubmitting,
        setError,
        handleReceiveBook,
        handleReturnSubmit,
        handleSuggestSubmit,
        handleAcceptSuggestion,
        handleConfirmMeetUp,
        handleCancelRequest,
        handleBorrowEventReport,
    } = useActivityActions({
        borrowEventId: borrowEventData.id,
        cancelBorrowRequest,
        acceptMeetUpRequest,
        setReturnDetail,
        confirmReceiveBook,
        suggestMeetUpRequest,
        acceptSuggestion,
        reportBorrowEvent,
    });

    const showCancelButton = () => {
        return (
            borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                ?.meet_up_status_id === 1 &&
            session?.userSubId === borrowEventData.borrower.sub
        );
    };

    const showSetReturnDetailButton = () => {
        return (
            isStartDate &&
            borrowEventData.borrow_status.borrow_status_id === 2 &&
            session?.userSubId === borrowEventData.borrower.sub
        );
    };

    const showSuggestionDetail = () => {
        return (
            borrowEventData.meet_up_detail.suggestions &&
            borrowEventData.meet_up_detail.suggestions!.length > 0 &&
            borrowEventData.meet_up_detail.suggestions![0].suggestion_status![0]
                .suggestion_status_id === 1
        );
    };

    const showReturnDetail = () => {
        return (
            borrowEventData.return_detail &&
            borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                ?.meet_up_status_id === 2 &&
            isStartDate &&
            borrowEventData.return_detail.return_time
        );
    };

    const showOwnerReceiveBookButton = () => {
        return (
            session?.userSubId === borrowEventData.lender.sub && isTimeToReturn
        );
    };

    useEffect(() => {
        const checkStartDate = () => {
            const currentDate = new Date();
            const formattedStartDate = currentDate.toISOString().split("T")[0];
            const startDate = borrowEventData.meet_up_detail.start_date;
            setIsStartDate(formattedStartDate === startDate);
        };
        checkStartDate();
    }, [borrowEventData.meet_up_detail.start_date]);

    useEffect(() => {
        const checkReturnTimeAndDate = () => {
            const currentDate = new Date();
            const formattedCurrentDate = currentDate
                .toISOString()
                .split("T")[0];

            const returnDate = borrowEventData.return_detail.return_date;
            if (returnDate === formattedCurrentDate) {
                setisTimeToReturn(true);
            } else {
                setisTimeToReturn(false);
            }
        };
        checkReturnTimeAndDate();
    }, [borrowEventData.return_detail.return_date]);

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

        // Only proceed if borrow is approved and meetup is pending
        if (!isApprovedBorrowStatus || !isPendingMeetupStatus) {
            return null;
        }

        // Case 1: No suggestions yet - show original "Accept Meet Up" for borrower
        if (!hasSuggestions && isBorrower) {
            return (
                <Button
                    className="h-10 sm:h-12 w-full sm:w-40"
                    onClick={handleConfirmMeetUp}
                    variant={"default"}
                >
                    Accept Meet Up
                </Button>
            );
        }

        // Case 2: Exactly 1 suggestion (latest one will be suggestions[0])
        if (suggestions.length === 1) {
            const latestSuggestion = suggestions[0];
            const suggestedByBorrower =
                String(latestSuggestion.user?.sub) ===
                String(borrowEventData.borrower.sub);

            if (suggestedByBorrower) {
                // Borrower made latest suggestion → Lender's turn
                if (isLender) {
                    return (
                        <Button
                            className="h-10 sm:h-12 w-full sm:w-40"
                            onClick={handleAcceptSuggestion}
                            variant={"default"}
                        >
                            Accept Suggestion
                        </Button>
                    );
                }
            } else {
                // Lender made latest suggestion → Borrower's turn
                if (isBorrower) {
                    return (
                        <Button
                            className="h-10 sm:h-12 w-full sm:w-40"
                            onClick={handleAcceptSuggestion}
                            variant={"default"}
                        >
                            Accept Suggestion
                        </Button>
                    );
                }
            }
        }

        // Case 3: Exactly 2 suggestions (latest is suggestions[0], previous is suggestions[1])
        if (suggestions.length === 2) {
            const latestSuggestedByLender =
                String(suggestions[0].user?.sub) ===
                String(borrowEventData.lender.sub);
            const previousSuggestedByBorrower =
                String(suggestions[1].user?.sub) ===
                String(borrowEventData.borrower.sub);

            if (latestSuggestedByLender && previousSuggestedByBorrower) {
                if (isBorrower) {
                    return (
                        <Button
                            className="h-10 sm:h-12 w-full"
                            onClick={handleAcceptSuggestion}
                            variant={"default"}
                        >
                            Accept Final Suggestion
                        </Button>
                    );
                }
            }
        }

        return null;
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [borrowEventData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading activity details...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        Borrow Request Details
                    </h1>
                </div>

                {/* Main Content Layout */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-12 lg:gap-6 xl:gap-8">
                    {/* Mobile/Tablet: Book Image */}
                    <div className="lg:hidden flex justify-center">
                        <div className="w-48 sm:w-56">
                            <BookDisplayCard
                                bookImage={
                                    borrowEventData.book.pictures[0].picture
                                }
                            />
                        </div>
                    </div>

                    {/* Desktop: Book Image */}
                    <div className="hidden lg:block lg:col-span-2">
                        <BookDisplayCard
                            bookImage={borrowEventData.book.pictures[0].picture}
                        />
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-7 space-y-4 sm:space-y-6">
                        <BorrowActivityDetail
                            bookAuthor={borrowEventData.book.author}
                            bookTitle={borrowEventData.book.title}
                            borrowStatus={
                                borrowEventData.borrow_status.borrow_status_id
                            }
                            borrowerEmail={borrowEventData.borrower.email}
                            borrowerName={borrowEventData.borrower.name}
                            borrowerProfileImage={
                                borrowEventData.borrower.picture || ""
                            }
                            lenderProfileImage={
                                borrowEventData.lender.picture || ""
                            }
                            lenderEmail={borrowEventData.lender.email}
                            lenderName={borrowEventData.lender.name}
                            startDate={
                                borrowEventData.meet_up_detail.start_date
                            }
                            endDate={borrowEventData.meet_up_detail.end_date}
                        />
                        <GuideMessage
                            borrowEventData={borrowEventData}
                            userSubId={session?.userSubId}
                            isStartDate={isStartDate}
                            isTimeToReturn={isTimeToReturn}
                        />
                    </div>

                    {/* Sidebar/Actions Area */}
                    <div className="lg:col-span-3 space-y-4 sm:space-y-6">
                        {/* Suggestion Detail */}
                        {borrowEventData.meet_up_detail.suggestions &&
                            showSuggestionDetail() && (
                                <SuggestMeetUpDetail
                                    startDate={
                                        borrowEventData.meet_up_detail
                                            .start_date
                                    }
                                    endDate={
                                        borrowEventData.meet_up_detail.end_date
                                    }
                                    suggestMeetUpTime={
                                        borrowEventData.meet_up_detail
                                            .suggestions[0].suggested_time
                                    }
                                    suggestMeetUpLocation={
                                        borrowEventData.meet_up_detail
                                            .suggestions[0].suggested_location
                                    }
                                    suggestedReason={
                                        borrowEventData.meet_up_detail
                                            .suggestions[0].suggested_reason
                                    }
                                    suggestedByName={
                                        borrowEventData.meet_up_detail
                                            .suggestions[0].user?.name ||
                                        "Unknown"
                                    }
                                    suggestedByProfilePicture={
                                        borrowEventData.meet_up_detail
                                            .suggestions[0].user?.picture ||
                                        "default-profile.png"
                                    }
                                />
                            )}

                        {/* Regular Meetup Detail */}
                        {!showSuggestionDetail() && !showReturnDetail() && (
                            <MeetUpDetail
                                startDate={
                                    borrowEventData.meet_up_detail.start_date
                                }
                                endDate={
                                    borrowEventData.meet_up_detail.end_date
                                }
                                meetUpLocation={
                                    borrowEventData.meet_up_detail
                                        .final_location
                                }
                                meetUpTime={
                                    borrowEventData.meet_up_detail.final_time
                                }
                            />
                        )}

                        {/* Return Detail */}
                        {showReturnDetail() && (
                            <ReturnDetail
                                endDate={
                                    borrowEventData.meet_up_detail.end_date
                                }
                                startDate={
                                    borrowEventData.meet_up_detail.start_date
                                }
                                returnTime={
                                    borrowEventData.return_detail.return_time
                                }
                                returnLocation={
                                    borrowEventData.return_detail
                                        .return_location
                                }
                            />
                        )}

                        {/* Return Detail Dialog */}
                        {showSetReturnDetailButton() && (
                            <ReturnDetailDialog
                                isSubmitting={isSubmitting}
                                onSubmit={handleReturnSubmit}
                            />
                        )}

                        {/* Report Dialog */}
                        {(showSetReturnDetailButton() ||
                            (isTimeToReturn &&
                                borrowEventData.borrow_status
                                    .borrow_status_id === 7)) && (
                            <ReportDialog
                                isTimeToReturn={isTimeToReturn}
                                sub={borrowEventData.borrower.sub || ""}
                                isLoading={isLoading}
                                onReport={
                                    isTimeToReturn
                                        ? handleBorrowEventReport
                                        : handleCancelRequest
                                }
                            />
                        )}

                        {/* Cancel Button */}
                        {showCancelButton() && (
                            <CancelBorrowRequestDialog
                                onCancel={handleCancelRequest}
                                isLoading={isLoading}
                            />
                        )}

                        {/* Receive Book Button */}
                        {showOwnerReceiveBookButton() && (
                            <Button
                                className="h-10 sm:h-12 w-full"
                                onClick={handleReceiveBook}
                            >
                                Received Book
                            </Button>
                        )}

                        {/* Action Buttons Row */}
                        <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 sm:gap-4">
                            {canSuggestMeetUp() && (
                                <div className="flex-1">
                                    <SuggestMeetupDialog
                                        onSuggest={handleSuggestSubmit}
                                        isSubmitting={isSubmitting}
                                    />
                                </div>
                            )}
                            {getMeetupActionButton() && (
                                <div
                                    className={
                                        canSuggestMeetUp() ? "flex-1" : "w-full"
                                    }
                                >
                                    {getMeetupActionButton()}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
