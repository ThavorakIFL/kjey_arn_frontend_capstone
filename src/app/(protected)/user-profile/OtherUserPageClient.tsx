"use client";
import Book from "@/components/bookComponent/Book";
import TitleBar from "@/components/TitleBar";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { User } from "@/types/user";
import { AvatarFallback } from "@radix-ui/react-avatar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

interface OtherUserProfilePageProps {
    initialUserData: User;
    otherUserBookData: any[];
}

export default function OtherUserProfilePage({
    initialUserData,
    otherUserBookData,
}: OtherUserProfilePageProps) {
    const [userData, setUserData] = useState<User>(initialUserData);
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [initialUserData]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                            Loading profile...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="flex flex-col space-y-6 sm:space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
                            {/* Profile Image */}
                            <div className="flex justify-center sm:justify-start">
                                <div className="rounded-full border">
                                    <Avatar className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48">
                                        <AvatarImage
                                            src={
                                                process.env
                                                    .NEXT_PUBLIC_IMAGE_PATH! +
                                                userData.picture
                                            }
                                        />
                                        <AvatarFallback className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold">
                                            {userData.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "NA"}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-grow space-y-4 sm:space-y-6">
                                {/* Header with name */}
                                <div className="space-y-1 sm:space-y-2">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center sm:text-left">
                                        {userData.name}
                                    </h1>
                                    <h3 className="text-sm sm:text-base md:text-lg text-gray-600 text-center sm:text-left">
                                        {userData.email}
                                    </h3>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
                                        Bio
                                    </h2>
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                                        {userData.bio || "No bio available."}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Section */}
                    <div>
                        <div className="mb-4 sm:mb-6">
                            <TitleBar
                                title={`${userData.name}'s Shelf`}
                                className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800"
                            />
                            <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
                                Explore {userData.name?.split(" ")[0]}'s book
                                collection
                            </p>
                        </div>

                        {/* Books Grid */}
                        {otherUserBookData.length > 0 ? (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="p-4 sm:p-6 lg:p-8">
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                        {otherUserBookData.map((book) => (
                                            <Book key={book.id} book={book} />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                                <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center px-4 sm:px-6">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                        <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2 sm:mb-3">
                                        No books available
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed">
                                        {userData.name?.split(" ")[0]} hasn't
                                        added any books to their shelf yet.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
