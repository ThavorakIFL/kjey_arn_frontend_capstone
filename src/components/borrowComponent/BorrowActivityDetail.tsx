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
        <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6 px-4 sm:px-0">
            {/* Book Information */}
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="bg-black text-white p-3 sm:p-4 lg:p-6">
                    <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold">
                        Request Details
                    </h2>
                </div>
                <div className="p-3 sm:p-4 lg:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {/* Title and Status */}
                        <div className="flex flex-col gap-3 sm:gap-4">
                            <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 leading-tight">
                                        {bookTitle}
                                    </h3>
                                    <p className="text-sm sm:text-base md:text-lg text-gray-600 mt-1 sm:mt-2">
                                        by {bookAuthor}
                                    </p>
                                </div>
                                <div className="flex-shrink-0 self-start xs:self-center">
                                    <BorrowStatus statusId={borrowStatus} />
                                </div>
                            </div>
                        </div>

                        {/* Users Information */}
                        <div className="space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                {/* Borrower */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Borrower
                                    </h4>
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                                            <AvatarImage
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    borrowerProfileImage
                                                }
                                                alt={`${borrowerName}'s profile`}
                                            />
                                            <AvatarFallback className="text-sm sm:text-base lg:text-lg font-semibold">
                                                {borrowerName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h5 className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                                {borrowerName}
                                            </h5>
                                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">
                                                    {borrowerEmail}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Lender */}
                                <div className="space-y-2 sm:space-y-3">
                                    <h4 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 flex items-center gap-2">
                                        <User className="w-4 h-4 sm:w-5 sm:h-5" />
                                        Lender
                                    </h4>
                                    <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
                                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 flex-shrink-0">
                                            <AvatarImage
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    lenderProfileImage
                                                }
                                                alt={`${borrowerName}'s profile`}
                                            />
                                            <AvatarFallback className="text-sm sm:text-base lg:text-lg font-semibold">
                                                {lenderName
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="min-w-0 flex-1">
                                            <h5 className="text-sm sm:text-base lg:text-lg font-medium text-gray-800 truncate">
                                                {lenderName}
                                            </h5>
                                            <div className="flex items-center gap-1 sm:gap-2 mt-1">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
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
