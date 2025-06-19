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
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-black text-white p-4">
                <h2 className="text-2xl font-semibold">Request Details</h2>
            </div>
            <div className="p-6">
                <div className="space-y-4">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-800">
                                {bookTitle}
                            </h3>
                            <p className="text-lg text-gray-600">
                                by {bookAuthor}
                            </p>
                        </div>
                        <BorrowStatus statusId={borrowStatus} />
                    </div>
                    <div className="flex items-center space-x-12">
                        <div className="space-y-2">
                            <h1 className="text-xl font-bold">Borrower </h1>
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            borrowerProfileImage
                                        }
                                    />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {borrowerName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-medium">
                                        {borrowerName}
                                    </h2>
                                    <h2>{borrowerEmail}</h2>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <h1 className="text-xl font-bold">Lender </h1>
                            <div className="flex items-center space-x-4">
                                <Avatar className="w-12 h-12">
                                    <AvatarImage
                                        src={
                                            process.env.NEXT_PUBLIC_IMAGE_PATH +
                                            lenderProfileImage
                                        }
                                    />
                                    <AvatarFallback className="text-lg font-semibold">
                                        {lenderName.charAt(0).toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <h2 className="font-medium">
                                        {lenderName}
                                    </h2>
                                    <h2>{lenderEmail}</h2>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
