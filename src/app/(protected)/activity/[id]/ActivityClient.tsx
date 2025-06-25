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
import TitleBar from "@/components/TitleBar";

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
    locationData: {
        success: boolean;
        message: string;
        data: any[];
    };
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
    locationData,
}: ActivityClientProps) {
    console.log("Borrow Event Data:", borrowEventData);
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
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedStartDate = `${year}-${month}-${day}`;
            const startDate = borrowEventData.meet_up_detail.start_date;
            console.log(startDate, formattedStartDate);
            setIsStartDate(formattedStartDate === startDate);
        };
        checkStartDate();
    }, [borrowEventData.meet_up_detail.start_date]);

    useEffect(() => {
        const checkReturnTimeAndDate = () => {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, "0");
            const day = String(currentDate.getDate()).padStart(2, "0");
            const formattedCurrentDate = `${year}-${month}-${day}`;
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
                    className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
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
                            className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
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
                            className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
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
                            className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[180px] text-xs sm:text-sm"
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
                    <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-xs sm:text-sm lg:text-base text-gray-600">
                        Loading activity details...
                    </p>
                </div>
            </div>
        );
    }

    const hasReport = () => {
        return borrowEventData.borrow_event_report !== null;
    };

    const bookDepositConfirmed = () => {
        return borrowEventData.borrow_event_report?.status;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="container mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 py-3 sm:py-4 md:py-6 lg:py-8">
                {/* Header */}
                <div className="mb-4 sm:mb-6 lg:mb-8">
                    <TitleBar
                        title="Borrow Request Details"
                        className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold text-gray-800"
                    />
                </div>

                {/* Main Content Layout - Mobile/Tablet stacked, Large Desktop grid */}
                <div className="space-y-4 sm:space-y-6 2xl:space-y-0 2xl:grid 2xl:grid-cols-12 2xl:gap-4 3xl:gap-6">
                    {/* Mobile/Tablet/Desktop: Book Image */}
                    <div className="2xl:hidden flex justify-center">
                        <div className="w-32 sm:w-40 md:w-48 lg:w-56">
                            <BookDisplayCard
                                bookImage={
                                    borrowEventData.book.pictures[0].picture
                                }
                            />
                        </div>
                    </div>

                    {/* Extra Large Desktop: Book Image */}
                    <div className="hidden 2xl:block 2xl:col-span-2">
                        <div className="sticky top-4">
                            <BookDisplayCard
                                bookImage={
                                    borrowEventData.book.pictures[0].picture
                                }
                            />
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div className="flex flex-col 2xl:col-span-7 space-y-3 sm:space-y-4 md:space-y-6">
                        {/* Mobile/Tablet/Desktop Guide Message */}
                        <div className="block 2xl:hidden mb-3 sm:mb-4 px-2 sm:px-4 md:px-2">
                            <GuideMessage
                                borrowEventData={borrowEventData}
                                userSubId={session?.userSubId}
                                isStartDate={isStartDate}
                                isTimeToReturn={isTimeToReturn}
                            />
                        </div>

                        {/* Borrow Activity Detail */}
                        <div className="mb-3 sm:mb-4 md:mb-6">
                            <BorrowActivityDetail
                                bookAuthor={borrowEventData.book.author}
                                bookTitle={borrowEventData.book.title}
                                borrowStatus={
                                    borrowEventData.borrow_status
                                        .borrow_status_id
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
                                endDate={
                                    borrowEventData.meet_up_detail.end_date
                                }
                            />
                        </div>

                        {/* Mobile/Tablet/Desktop: Meet Up Details - Full Width Below Request Details */}
                        <div className="2xl:hidden">
                            {/* Suggestion Detail */}
                            {borrowEventData.meet_up_detail.suggestions &&
                                showSuggestionDetail() && (
                                    <div className="mb-4 sm:mb-6">
                                        <SuggestMeetUpDetail
                                            startDate={
                                                borrowEventData.meet_up_detail
                                                    .start_date
                                            }
                                            endDate={
                                                borrowEventData.meet_up_detail
                                                    .end_date
                                            }
                                            suggestMeetUpTime={
                                                borrowEventData.meet_up_detail
                                                    .suggestions[0]
                                                    .suggested_time
                                            }
                                            suggestMeetUpLocation={
                                                borrowEventData.meet_up_detail
                                                    .suggestions[0]
                                                    .suggested_location
                                            }
                                            suggestedReason={
                                                borrowEventData.meet_up_detail
                                                    .suggestions[0]
                                                    .suggested_reason
                                            }
                                            suggestedByName={
                                                borrowEventData.meet_up_detail
                                                    .suggestions[0].user
                                                    ?.name || "Unknown"
                                            }
                                            suggestedByProfilePicture={
                                                borrowEventData.meet_up_detail
                                                    .suggestions[0].user
                                                    ?.picture ||
                                                "default-profile.png"
                                            }
                                        />
                                    </div>
                                )}

                            {/* Regular Meetup Detail */}
                            {!showSuggestionDetail() && !showReturnDetail() && (
                                <div className="mb-4 sm:mb-6">
                                    <MeetUpDetail
                                        startDate={
                                            borrowEventData.meet_up_detail
                                                .start_date
                                        }
                                        endDate={
                                            borrowEventData.meet_up_detail
                                                .end_date
                                        }
                                        meetUpLocation={
                                            borrowEventData.meet_up_detail
                                                .final_location
                                        }
                                        meetUpTime={
                                            borrowEventData.meet_up_detail
                                                .final_time
                                        }
                                        variant="standalone"
                                    />
                                </div>
                            )}

                            {/* Return Detail */}
                            {showReturnDetail() && (
                                <div className="mb-4 sm:mb-6">
                                    <ReturnDetail
                                        endDate={
                                            borrowEventData.meet_up_detail
                                                .end_date
                                        }
                                        startDate={
                                            borrowEventData.meet_up_detail
                                                .start_date
                                        }
                                        returnTime={
                                            borrowEventData.return_detail
                                                .return_time
                                        }
                                        returnLocation={
                                            borrowEventData.return_detail
                                                .return_location
                                        }
                                    />
                                </div>
                            )}
                        </div>

                        {/* Extra Large Desktop Guide Message */}
                        <div className="hidden 2xl:block">
                            <GuideMessage
                                borrowEventData={borrowEventData}
                                userSubId={session?.userSubId}
                                isStartDate={isStartDate}
                                isTimeToReturn={isTimeToReturn}
                            />
                        </div>

                        {/* Mobile/Tablet/Desktop Action Buttons */}
                        <div className="2xl:hidden flex flex-wrap gap-2 justify-center sm:justify-start">
                            {showCancelButton() && (
                                <CancelBorrowRequestDialog
                                    onCancel={handleCancelRequest}
                                    isLoading={isLoading}
                                />
                            )}
                            {canSuggestMeetUp() && (
                                <SuggestMeetupDialog
                                    onSuggest={handleSuggestSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                            {getMeetupActionButton()}
                            {showSetReturnDetailButton() && (
                                <ReturnDetailDialog
                                    locationData={locationData}
                                    isSubmitting={isSubmitting}
                                    onSubmit={handleReturnSubmit}
                                />
                            )}
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
                            {showOwnerReceiveBookButton() && (
                                <Button
                                    className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
                                    onClick={handleReceiveBook}
                                >
                                    Received Book
                                </Button>
                            )}
                        </div>

                        {/* Extra Large Desktop Action Buttons */}
                        <div className="hidden 2xl:flex 2xl:flex-wrap 2xl:gap-2 3xl:gap-3 2xl:justify-end 2xl:items-center">
                            {showCancelButton() && (
                                <CancelBorrowRequestDialog
                                    onCancel={handleCancelRequest}
                                    isLoading={isLoading}
                                />
                            )}
                            {canSuggestMeetUp() && (
                                <SuggestMeetupDialog
                                    onSuggest={handleSuggestSubmit}
                                    isSubmitting={isSubmitting}
                                />
                            )}
                            {getMeetupActionButton()}
                            {showSetReturnDetailButton() && (
                                <ReturnDetailDialog
                                    locationData={locationData}
                                    isSubmitting={isSubmitting}
                                    onSubmit={handleReturnSubmit}
                                />
                            )}
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
                            {showOwnerReceiveBookButton() &&
                                hasReport() &&
                                bookDepositConfirmed() && (
                                    <Button
                                        className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
                                        onClick={handleReceiveBook}
                                    >
                                        Received Book
                                    </Button>
                                )}
                            {showOwnerReceiveBookButton() && !hasReport() && (
                                <Button
                                    className="h-10 sm:h-11 md:h-12 w-full sm:w-auto sm:min-w-[140px] md:min-w-[160px] text-xs sm:text-sm"
                                    onClick={handleReceiveBook}
                                >
                                    Received Book
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="hidden 2xl:block 2xl:col-span-3 space-y-3 sm:space-y-4 md:space-y-6">
                        {borrowEventData.meet_up_detail.suggestions &&
                            showSuggestionDetail() && (
                                <div className="w-full">
                                    <SuggestMeetUpDetail
                                        startDate={
                                            borrowEventData.meet_up_detail
                                                .start_date
                                        }
                                        endDate={
                                            borrowEventData.meet_up_detail
                                                .end_date
                                        }
                                        suggestMeetUpTime={
                                            borrowEventData.meet_up_detail
                                                .suggestions[0].suggested_time
                                        }
                                        suggestMeetUpLocation={
                                            borrowEventData.meet_up_detail
                                                .suggestions[0]
                                                .suggested_location
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
                                </div>
                            )}

                        {!showSuggestionDetail() && !showReturnDetail() && (
                            <div className="w-full overflow-hidden">
                                <MeetUpDetail
                                    startDate={
                                        borrowEventData.meet_up_detail
                                            .start_date
                                    }
                                    endDate={
                                        borrowEventData.meet_up_detail.end_date
                                    }
                                    meetUpLocation={
                                        borrowEventData.meet_up_detail
                                            .final_location
                                    }
                                    meetUpTime={
                                        borrowEventData.meet_up_detail
                                            .final_time
                                    }
                                    variant="sidebar"
                                />
                            </div>
                        )}

                        {/* Return Detail */}
                        {showReturnDetail() && (
                            <div className="w-full">
                                <ReturnDetail
                                    endDate={
                                        borrowEventData.meet_up_detail.end_date
                                    }
                                    startDate={
                                        borrowEventData.meet_up_detail
                                            .start_date
                                    }
                                    returnTime={
                                        borrowEventData.return_detail
                                            .return_time
                                    }
                                    returnLocation={
                                        borrowEventData.return_detail
                                            .return_location
                                    }
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
