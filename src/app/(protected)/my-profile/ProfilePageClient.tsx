"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import ProfileIcon from "@/components/ProfileIcon";
import TitleBar from "@/components/TitleBar";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { updateUserBio } from "./profile-action";
import { User } from "@/types/user";
import Book from "@/components/bookComponent/Book";

interface ProfilePageClientProps {
    initialUserData: User;
    userBookData: any[];
}

export default function ProfilePageClient({
    initialUserData,
    userBookData,
}: ProfilePageClientProps) {
    const { data: session } = useSession();

    const [loading, setLoading] = useState(true);

    const [userData, setUserData] = useState<User>(initialUserData);
    const [bio, setBio] = useState(initialUserData.bio || "");
    const [editingBio, setEditingBio] = useState(false);
    const [selectAction, setSelectAction] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [userBookData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen px-4">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleAction = (value: string) => {
        setSelectAction(value);
        if (value === "edit_bio") {
            setEditingBio(true);
        }
    };

    const handleSave = async () => {
        try {
            setIsSubmitting(true);
            await updateUserBio(bio);
            setUserData((prev) => ({
                ...prev,
                bio,
            }));
            setSelectAction("");
            setEditingBio(false);
        } catch (error) {
            console.error("Failed to save bio:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setBio(userData.bio || "");
        setSelectAction("");
        setEditingBio(false);
    };

    return (
        <>
            <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-12">
                <div className="flex flex-col space-y-6 sm:space-y-8">
                    {/* Profile Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
                            {/* Profile Image */}
                            <div className="flex justify-center sm:justify-start">
                                <div className="rounded-full border">
                                    <ProfileIcon
                                        className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
                                        imageUrl={
                                            session?.user?.image ||
                                            "ProfilePicture"
                                        }
                                    />
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="flex-grow space-y-4 sm:space-y-6">
                                {/* Header with name and actions */}
                                <div className="flex flex-col sm:flex-row sm:items-start space-y-4 sm:space-y-0">
                                    <div className="flex-grow space-y-1 sm:space-y-2">
                                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center sm:text-left">
                                            {userData.name}
                                        </h1>
                                        <h3 className="text-sm sm:text-base md:text-lg text-gray-600 text-center sm:text-left">
                                            {userData.email}
                                        </h3>
                                    </div>

                                    <div className="flex justify-center sm:justify-end">
                                        <Select
                                            value={selectAction}
                                            onValueChange={handleAction}
                                        >
                                            <SelectTrigger className="w-full sm:w-auto">
                                                <SelectValue
                                                    className="bg-indigo-400"
                                                    placeholder="More Actions"
                                                />
                                            </SelectTrigger>
                                            <SelectContent className="bg-indigo-400">
                                                <SelectGroup>
                                                    <SelectItem value="edit_bio">
                                                        Edit Bio
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                {/* Bio Section */}
                                <div className="space-y-3 sm:space-y-4">
                                    <h2 className="text-xl sm:text-2xl font-semibold">
                                        Bio
                                    </h2>
                                    {editingBio ? (
                                        <div className="space-y-3 sm:space-y-4">
                                            <textarea
                                                onChange={(e) =>
                                                    setBio(e.target.value)
                                                }
                                                value={bio}
                                                className="w-full shadow-xl border rounded-lg p-3 sm:p-4 text-sm sm:text-base resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows={4}
                                                placeholder="Tell us about yourself..."
                                            />
                                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                                <button
                                                    className="w-full sm:w-auto border border-gray-300 shadow-md bg-white px-4 py-2 rounded-md cursor-pointer transition hover:bg-gray-50 text-sm sm:text-base"
                                                    onClick={handleCancel}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    className="w-full sm:w-auto bg-primary text-white px-4 py-2 rounded-md transition cursor-pointer hover:bg-primary/90 text-sm sm:text-base"
                                                    onClick={handleSave}
                                                    disabled={isSubmitting}
                                                >
                                                    {isSubmitting
                                                        ? "Saving..."
                                                        : "Save"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
                                            {userData.bio ||
                                                "No bio available."}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Books Section */}
                    <div>
                        <TitleBar title="My Shelf" />
                        <div className="mt-4 sm:mt-6">
                            {userBookData.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                                    {userBookData.map((book) => (
                                        <Book key={book.id} book={book} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 sm:py-12">
                                    <p className="text-gray-500 text-sm sm:text-base">
                                        No books available.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
