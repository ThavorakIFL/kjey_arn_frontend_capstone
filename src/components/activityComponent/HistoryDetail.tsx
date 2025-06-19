import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";

interface HistoryDetailProps {
    borrowStatus: number;
    bookTitle: string;
    bookAuthor: string;
    borrowerProfileImage: string;
    lenderProfileImage: string;
    borrowerName: string;
    borrowerEmail: string;
    lenderName: string;
    lenderEmail: string;
}

export default function HistoryDetail({
    borrowStatus,
    bookTitle,
    bookAuthor,
    borrowerProfileImage,
    lenderProfileImage,
    borrowerName,
    borrowerEmail,
    lenderName,
    lenderEmail,
}: HistoryDetailProps) {
    return (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
            {/* Header */}
            <div className="bg-black text-white p-3 sm:p-4">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                    Request Details
                </h2>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                    {/* Book Info and Status */}
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="min-w-0 flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">
                                {bookTitle}
                            </h3>
                            <p className="text-base sm:text-lg text-gray-600 mt-1">
                                by {bookAuthor}
                            </p>
                        </div>
                        <div className="flex-shrink-0 self-start">
                            <BorrowStatus statusId={borrowStatus} />
                        </div>
                    </div>

                    {/* Borrower and Lender Section */}
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">
                        {/* Borrower */}
                        <div className="space-y-3 flex-1">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                Borrower
                            </h1>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <AvatarImage
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            borrowerProfileImage
                                        }
                                    />
                                    <AvatarFallback className="text-sm sm:text-lg font-semibold">
                                        {borrowerName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                                        {borrowerName}
                                    </h2>
                                    <h2 className="text-xs sm:text-sm text-gray-600 break-words">
                                        {borrowerEmail}
                                    </h2>
                                </div>
                            </div>
                        </div>

                        {/* Lender */}
                        <div className="space-y-3 flex-1">
                            <h1 className="text-lg sm:text-xl font-bold text-gray-900">
                                Lender
                            </h1>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <Avatar className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
                                    <AvatarImage
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            lenderProfileImage
                                        }
                                    />
                                    <AvatarFallback className="text-sm sm:text-lg font-semibold">
                                        {lenderName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <h2 className="font-medium text-sm sm:text-base text-gray-900 truncate">
                                        {lenderName}
                                    </h2>
                                    <h2 className="text-xs sm:text-sm text-gray-600 break-words">
                                        {lenderEmail}
                                    </h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
