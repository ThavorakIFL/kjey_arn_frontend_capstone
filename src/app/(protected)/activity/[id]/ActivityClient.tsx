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
    const [isTimeToReceive, setisTimeToReceive] = useState(false);
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

    const showOwnerReceiveBookButton = () => {
        return (
            session?.userSubId === borrowEventData.lender.sub && isTimeToReceive
        );
    };

    const showSuggestionDetail = () => {
        return (
            borrowEventData.meet_up_detail.suggestions &&
            borrowEventData.meet_up_detail.suggestions!.length > 0 &&
            borrowEventData.meet_up_detail.suggestions![0].suggestion_status
                ?.suggestion_status_id === 1
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
                setisTimeToReceive(true);
            } else {
                setisTimeToReceive(false);
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
                    className="h-12 w-40"
                    onClick={handleConfirmMeetUp}
                    variant={"default"}
                >
                    Accept Meet Up
                </Button>
            );
        }

        // Case 2: Exactly 1 suggestion
        if (suggestions.length === 1) {
            const firstSuggestion = suggestions[0];
            const firstSuggestedByBorrower =
                String(firstSuggestion.user?.sub) ===
                String(borrowEventData.borrower.sub);

            if (firstSuggestedByBorrower) {
                // Borrower made first suggestion → Lender's turn to accept or counter-suggest
                if (isLender) {
                    return (
                        <Button
                            className="h-12 w-40"
                            onClick={handleAcceptSuggestion}
                            variant={"default"}
                        >
                            Accept Suggestion
                        </Button>
                    );
                }
            } else {
                // Edge case: Lender made first suggestion → Borrower should accept
                if (isBorrower) {
                    return (
                        <Button
                            className="h-12 w-40"
                            onClick={handleAcceptSuggestion}
                            variant={"default"}
                        >
                            Accept Suggestion
                        </Button>
                    );
                }
            }
        }

        // Case 3: Exactly 2 suggestions (borrower suggested, then lender counter-suggested)
        if (suggestions.length === 2) {
            const firstSuggestedByBorrower =
                String(suggestions[0].user?.sub) ===
                String(borrowEventData.borrower.sub);
            const secondSuggestedByLender =
                String(suggestions[1].user?.sub) ===
                String(borrowEventData.lender.sub);

            if (firstSuggestedByBorrower && secondSuggestedByLender) {
                if (isBorrower) {
                    return (
                        <Button
                            className="h-12 w-full"
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
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Borrow Request Details</h1>
            <div className="grid grid-cols-12 gap-8 items-start py-8">
                <div className="col-span-2">
                    <BookDisplayCard
                        bookImage={borrowEventData.book.pictures[0].picture}
                    />
                </div>
                <div className="col-span-7 flex flex-col space-y-6 h-full">
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
                        startDate={borrowEventData.meet_up_detail.start_date}
                        endDate={borrowEventData.meet_up_detail.end_date}
                    />
                    <GuideMessage />
                </div>
                <div className="col-span-3 flex flex-col space-y-6 h-full">
                    {borrowEventData.meet_up_detail.suggestions &&
                        showSuggestionDetail() && (
                            <SuggestMeetUpDetail
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
                                        .suggestions[0].user?.name || "Unknown"
                                }
                                suggestedByProfilePicture={
                                    borrowEventData.meet_up_detail
                                        .suggestions[0].user?.picture ||
                                    "default-profile.png"
                                }
                            />
                        )}

                    {!borrowEventData.meet_up_detail.suggestions &&
                        !borrowEventData.return_detail && (
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

                    {borrowEventData.return_detail && (
                        <ReturnDetail
                            endDate={borrowEventData.meet_up_detail.end_date}
                            startDate={
                                borrowEventData.meet_up_detail.start_date
                            }
                            returnTime={
                                borrowEventData.return_detail.return_time
                            }
                            returnLocation={
                                borrowEventData.return_detail.return_location
                            }
                        />
                    )}

                    {showSetReturnDetailButton() && (
                        <ReturnDetailDialog
                            isSubmitting={isSubmitting}
                            onSubmit={handleReturnSubmit}
                        />
                    )}

                    {showSetReturnDetailButton() ||
                        (isTimeToReceive &&
                            borrowEventData.borrow_status.borrow_status_id ==
                                7 && (
                                <ReportDialog
                                    isTimeToReceive={isTimeToReceive}
                                    sub={borrowEventData.borrower.sub || ""}
                                    isLoading={isLoading}
                                    onReport={
                                        isTimeToReceive
                                            ? handleBorrowEventReport
                                            : handleCancelRequest
                                    }
                                />
                            ))}

                    {showCancelButton() && (
                        <CancelBorrowRequestDialog
                            onCancel={handleCancelRequest}
                            isLoading={isLoading}
                        />
                    )}
                    {showOwnerReceiveBookButton() && (
                        <Button className="h-12" onClick={handleReceiveBook}>
                            Received Book
                        </Button>
                    )}
                    <div className="flex justify-between">
                        {canSuggestMeetUp() && (
                            <SuggestMeetupDialog
                                onSuggest={handleSuggestSubmit}
                                isSubmitting={isSubmitting}
                            />
                        )}
                        {getMeetupActionButton()}
                    </div>
                </div>
            </div>
        </div>
    );
}
