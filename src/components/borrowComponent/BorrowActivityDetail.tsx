import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Mail, Calendar, Clock } from "lucide-react";
import BorrowStatus from "./BorrowStatus";

interface BorrowActivityDetailProps {
    borrowStatus: number;
    bookTitle: string;
    bookAuthor: string;
    borrowerProfileImage: string;
    lenderProfileImage: string;
    borrowerName: string;
    borrowerEmail: string;
    lenderName: string;
    lenderEmail: string;
    startDate: string;
    endDate: string;
}

export default function BorrowActivityDetail({
    borrowStatus,
    bookTitle,
    bookAuthor,
    borrowerProfileImage,
    lenderProfileImage,
    borrowerName,
    borrowerEmail,
    lenderName,
    lenderEmail,
}: BorrowActivityDetailProps) {
    const formatDate = (dateString: string) => {
        if (!dateString) return "Not specified";
        return new Date(dateString).toLocaleDateString("en-US", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Book Information */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-black text-white p-3 sm:p-4">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">
                        Request Details
                    </h2>
                </div>
                <div className="p-4 sm:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Title and Status */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                            <div className="min-w-0 flex-1">
                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 line-clamp-2">
                                    {bookTitle}
                                </h3>
                                <p className="text-base sm:text-lg text-gray-600 mt-1">
                                    by {bookAuthor}
                                </p>
                            </div>
                            <div className="flex-shrink-0">
                                <BorrowStatus statusId={borrowStatus} />
                            </div>
                        </div>

                        {/* Users Information */}
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6 sm:gap-8 lg:gap-12">
                            {/* Borrower */}
                            <div className="space-y-2 sm:space-y-3 flex-1">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                                    Borrower
                                </h4>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                        <AvatarImage
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_IMAGE_PATH +
                                                borrowerProfileImage
                                            }
                                        />
                                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                                            {borrowerName
                                                .charAt(0)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h5 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                                            {borrowerName}
                                        </h5>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            {borrowerEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Divider - Hidden on mobile, shown as vertical line on desktop */}
                            <div className="hidden lg:block w-px bg-gray-200 self-stretch"></div>
                            <div className="lg:hidden border-t border-gray-200"></div>

                            {/* Lender */}
                            <div className="space-y-2 sm:space-y-3 flex-1">
                                <h4 className="text-lg sm:text-xl font-bold text-gray-800">
                                    Lender
                                </h4>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                        <AvatarImage
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_IMAGE_PATH +
                                                lenderProfileImage
                                            }
                                        />
                                        <AvatarFallback className="text-sm sm:text-lg font-semibold">
                                            {lenderName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="min-w-0 flex-1">
                                        <h5 className="text-sm sm:text-base font-medium text-gray-800 truncate">
                                            {lenderName}
                                        </h5>
                                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                                            {lenderEmail}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
