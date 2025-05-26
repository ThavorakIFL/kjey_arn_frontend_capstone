"use client";
import Book from "@/components/bookComponent/Book";
import TitleBar from "@/components/TitleBar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useState } from "react";

interface OtherUserProfilePageProps {
    initialUserData: User;
    otherUserBookData: any[];
}

export default function OtherUserProfilePage({
    initialUserData,
    otherUserBookData,
}: OtherUserProfilePageProps) {
    const [userData, setUserData] = useState<User>(initialUserData);
    return (
        <>
            <div className="flex flex-col p-8">
                <div
                    style={{ minHeight: "10rem" }}
                    className="flex bg-white rounded-lg shadow-lg px-8 items-center"
                >
                    <div className="rounded-full my-auto">
                        <Avatar className="h-48 w-48">
                            <AvatarImage
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                    userData.picture
                                }
                            />
                            <AvatarFallback>NA</AvatarFallback>
                        </Avatar>
                    </div>

                    <div className="flex-grow flex-col px-4 my-8 space-y-8 py-6">
                        <div className="flex">
                            <div className="flex flex-col space-y-2">
                                <h1 className="text-4xl font-semibold">
                                    {userData.name}
                                </h1>
                                <h3 className="text-md text-gray-400">
                                    {userData.email}
                                </h3>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h1 className="text-2xl font-semibold">Bio</h1>
                            <p>{userData.bio}</p>
                        </div>
                    </div>
                </div>

                <TitleBar className="my-8" title={`${userData.name}'s Shelf`} />
                <div className="grid grid-cols-7 gap-4 mb-8">
                    {otherUserBookData.length > 0 ? (
                        otherUserBookData.map((book) => (
                            <Book key={book.id} book={book} />
                        ))
                    ) : (
                        <p className="text-gray-500">No books available.</p>
                    )}
                </div>
            </div>
        </>
    );
}
