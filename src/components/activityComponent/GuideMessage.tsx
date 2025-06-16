import React from "react";
import { Icon } from "@iconify/react";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";

interface GuideMessageProps {
    borrowEventData: BorrowEventType;
    userSubId?: string;
    isStartDate: boolean;
    isTimeToReturn: boolean;
}

export function GuideMessage({
    borrowEventData,
    userSubId,
    isStartDate,
    isTimeToReturn,
}: GuideMessageProps) {
    const getGuideMessage = (): string => {
        const isBorrower = userSubId === borrowEventData.borrower.sub;
        const isLender = userSubId === borrowEventData.lender.sub;
        const borrowStatus = borrowEventData.borrow_status.borrow_status_id;
        const meetupStatus =
            borrowEventData.meet_up_detail.meet_up_detail_meet_up_status
                ?.meet_up_status_id;
        const suggestions = borrowEventData.meet_up_detail.suggestions || [];
        const hasActiveSuggestions =
            suggestions.length > 0 &&
            suggestions[0].suggestion_status?.[0].suggestion_status_id === 1;

        // Borrow request pending approval
        if (borrowStatus === 1) {
            if (isBorrower) {
                return "Your borrow request is pending. Wait for the lender to approve your request.";
            }
            return "Review the borrow request and decide whether to approve or decline.";
        }

        // Borrow request approved, meetup coordination phase
        if (borrowStatus === 2 && meetupStatus === 1) {
            // Handle suggestion flow
            if (hasActiveSuggestions) {
                const latestSuggestion = suggestions[0];
                const suggestedByBorrower =
                    String(latestSuggestion.user?.sub) ===
                    String(borrowEventData.borrower.sub);

                if (suggestions.length === 1) {
                    if (suggestedByBorrower && isLender) {
                        return "The borrower has suggested new meetup details. Review and accept or suggest alternatives.";
                    } else if (!suggestedByBorrower && isBorrower) {
                        return "The lender has suggested new meetup details. Review and accept or suggest alternatives.";
                    } else if (suggestedByBorrower && isBorrower) {
                        return "You've suggested new meetup details. Wait for the lender's response.";
                    } else {
                        return "You've suggested new meetup details. Wait for the borrower's response.";
                    }
                } else if (suggestions.length === 2) {
                    const latestByLender =
                        String(suggestions[0].user?.sub) ===
                        String(borrowEventData.lender.sub);
                    const previousByBorrower =
                        String(suggestions[1].user?.sub) ===
                        String(borrowEventData.borrower.sub);

                    if (latestByLender && previousByBorrower && isBorrower) {
                        return "This is the final meetup suggestion. Please accept to confirm the meetup details.";
                    } else if (
                        latestByLender &&
                        previousByBorrower &&
                        isLender
                    ) {
                        return "You've made the final suggestion. Wait for the borrower to accept.";
                    }
                }
            } else {
                // No suggestions, original meetup details
                if (isBorrower) {
                    return "Review the meetup details and accept to confirm, or suggest changes if needed.";
                }
                return "Wait for the borrower to confirm the meetup details or suggest changes.";
            }
        }

        // Meetup confirmed, waiting for start date
        if (borrowStatus === 2 && meetupStatus === 2 && !isStartDate) {
            return `Meetup confirmed! The borrowing period starts on ${borrowEventData.meet_up_detail.start_date}.`;
        }

        // Borrowing period active
        if (
            borrowStatus === 2 &&
            meetupStatus === 2 &&
            isStartDate &&
            !borrowEventData.return_detail.return_time
        ) {
            if (isBorrower) {
                return "The borrowing period has started! Please set your return details when you're ready.";
            }
            return "The borrowing period has started. The borrower will set return details soon.";
        }

        // Return details set, waiting for return time
        if (borrowEventData.return_detail && !isTimeToReturn) {
            return `Return details confirmed. Book should be returned on ${borrowEventData.return_detail.return_date} at ${borrowEventData.return_detail.return_time}.`;
        }

        // Time to return
        if (isTimeToReturn && borrowStatus === 7) {
            if (isLender) {
                return "It's time for the book return! Confirm when you receive the book back.";
            }
            return "It's time to return the book! Please meet at the agreed location and time.";
        }

        // Borrow completed
        if (borrowStatus === 3) {
            return "Borrow completed successfully! Thank you for using our service.";
        }

        // Cancelled states
        if (borrowStatus === 4) {
            return "This borrow request has been cancelled.";
        }

        if (borrowStatus === 5) {
            return "This borrow request was declined by the lender.";
        }

        // Reported/Disputed
        if (borrowStatus === 6) {
            return "This borrow event has been reported and is under review.";
        }

        // Default fallback
        return "Please follow the instructions and available actions to proceed.";
    };

    const getIconColor = (): string => {
        const borrowStatus = borrowEventData.borrow_status.borrow_status_id;
        if (borrowStatus === 5) return "text-green-600"; // Completed
        if (borrowStatus === 3 || borrowStatus === 8 || borrowStatus === 6)
            return "text-red-600"; // Cancelled/Declined/Reported
        if (isTimeToReturn) return "text-orange-600"; // Urgent
        return "text-white"; // Default
    };

    return (
        <div className="w-full h-12 rounded-lg bg-white border-black border-2 flex overflow-clip">
            <div className="bg-black font-medium text-white px-4 flex h-full items-center justify-center space-x-4">
                <Icon
                    className={`h-6 w-6 ${getIconColor()}`}
                    icon="lucide:lightbulb"
                />
                <p>Guide Message</p>
            </div>
            <div className="h-auto flex flex-col items-center justify-center px-4">
                <p className="text-sm">{getGuideMessage()}</p>
            </div>
        </div>
    );
}
