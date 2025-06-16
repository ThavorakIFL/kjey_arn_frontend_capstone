import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";

interface HistoryDetailProps {
    borrowStatus: number;
    bookTitle: string;
    bookAuthor: string;
    borrowerProfileImage: string;
    borrowerName: string;
    borrowerEmail: string;
}

export default function HistoryDetail({
    borrowStatus,
    bookTitle,
    bookAuthor,
    borrowerProfileImage,
    borrowerName,
    borrowerEmail,
}: HistoryDetailProps) {
    return (
        <div className=" bg-white shadow-md p-4 rounded-lg h-auto flex flex-col space-y-4">
            <div>
                <div className="flex justify-between">
                    {" "}
                    <h2 className="text-2xl font-bold">History</h2>
                    <BorrowStatus statusId={borrowStatus} />
                </div>

                <div className="flex flex-col">
                    <h3>{bookTitle}</h3>
                    <h3 className="text-gray-400">By: {bookAuthor}</h3>
                </div>
            </div>

            <div className="flex space-x-2">
                <Avatar className="w-12 h-12">
                    <AvatarImage
                        src={
                            process.env.NEXT_PUBLIC_IMAGE_PATH! +
                            borrowerProfileImage
                        }
                    />
                    <AvatarFallback>PF</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <h1 className="text-lg font-medium">{borrowerName}</h1>
                    <h2 className="text-sm text-gray-500">{borrowerEmail}</h2>
                </div>
            </div>
        </div>
    );
}
