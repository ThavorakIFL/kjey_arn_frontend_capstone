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
    startDate,
    endDate,
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
        <div className="w-full max-w-4xl mx-auto space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-6 px-2 sm:px-4 lg:px-0">
            {/* Book Information */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-black text-white p-2 sm:p-3 lg:p-4 xl:p-6">
                    <h2 className="text-sm sm:text-base lg:text-lg xl:text-xl font-semibold">
                        Request Details
                    </h2>
                </div>
                <div className="p-2 sm:p-3 lg:p-4 xl:p-6">
                    <div className="space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-6">
                        {/* Title and Status */}
                        <div className="flex flex-col gap-2 sm:gap-3">
                            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-2 sm:gap-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 leading-tight">
                                        {bookTitle}
                                    </h3>
                                    <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-0.5 sm:mt-1">
                                        by {bookAuthor}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 self-start xs:self-center">
                                    <BorrowStatus statusId={borrowStatus} />
                                </div>
                            </div>
                        </div>

                        {/* Users Information */}
                        <div className="space-y-2 sm:space-y-3 lg:space-y-4 xl:space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 xl:gap-8">
                                {/* Borrower */}
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                        Borrower
                                    </h4>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-lg">
                                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                                            <AvatarImage
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    borrowerProfileImage
                                                }
                                                alt={`${borrowerName}'s profile`}
                                            />
                                            <AvatarFallback className="text-xs sm:text-sm lg:text-base font-semibold">
                                                {borrowerName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h5 className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 truncate">
                                                {borrowerName}
                                            </h5>
                                            <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                                                <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gray-500 flex-shrink-0" />
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                    {borrowerEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lender */}
                                <div className="space-y-1 sm:space-y-2">
                                    <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-800 flex items-center gap-1 sm:gap-2">
                                        <User className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                                        Lender
                                    </h4>
                                    <div className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 lg:p-4 bg-gray-50 rounded-lg">
                                        <Avatar className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 flex-shrink-0">
                                            <AvatarImage
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    lenderProfileImage
                                                }
                                                alt={`${lenderName}'s profile`}
                                            />
                                            <AvatarFallback className="text-xs sm:text-sm lg:text-base font-semibold">
                                                {lenderName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h5 className="text-xs sm:text-sm lg:text-base font-medium text-gray-800 truncate">
                                                {lenderName}
                                            </h5>
                                            <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                                                <Mail className="w-2.5 h-2.5 sm:w-3 sm:h-3 lg:w-4 lg:h-4 text-gray-500 flex-shrink-0" />
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
            </div>
        </div>
    );
}
