"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
import { BookOpen, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import MobileBook from "@/components/bookComponent/MobileBook";

interface ProfilePageClientProps {
    initialUserData: User;
    userBookData: any[];
}

export default function ProfilePageClient({
    initialUserData,
    userBookData,
}: ProfilePageClientProps) {
    const { data: session } = useSession();
    const router = useRouter();
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
            <div className="min-h-screen ">
                <div className="flex items-center justify-center min-h-screen px-4">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-sm sm:text-base text-gray-600">
                            Loading your profile...
                        </p>
                    </div>
                </div>
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
        <div className="px-4 py-6 sm:px-6 md:px-8 lg:px-10 xl:px-4">
            <div className="flex flex-col space-y-4">
                {/* Profile Card */}
                <div className="bg-white rounded-lg shadow-lg p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-6">
                        {/* Profile Image */}
                        <div className="flex justify-center sm:justify-start">
                            <div className="rounded-full border">
                                <ProfileIcon
                                    className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 lg:w-48 lg:h-48"
                                    imageUrl={
                                        session?.user?.image || "ProfilePicture"
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
                                            <SelectValue placeholder="More Actions" />
                                        </SelectTrigger>
                                        <SelectContent
                                            className="z-50"
                                            side="bottom"
                                            align="end"
                                        >
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
                                <h2 className="text-xl sm:text-2xl font-semibold text-center sm:text-left">
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
                                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed text-center sm:text-left">
                                        {userData.bio || "No bio available."}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Books Section */}

                <TitleBar
                    onAction={() => {
                        router.push("/shelf");
                    }}
                    actionTitle="View Shelf"
                    title="My Shelf"
                    subTitle="Manage and showcase your book collection"
                />

                {/* Books Grid */}
                {userBookData.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
                        {userBookData.map((book) => (
                            <React.Fragment key={book.id}>
                                {/* Mobile component - hidden on sm and up */}
                                <div className="block sm:hidden">
                                    <MobileBook book={book} />
                                </div>

                                {/* Desktop component - hidden on mobile, shown on sm and up */}
                                <div className="hidden sm:block">
                                    <Book book={book} />
                                </div>
                            </React.Fragment>
                        ))}
                    </div>
                ) : (
                    /* Enhanced Empty State */
                    <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                        <div className="flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20 text-center px-4 sm:px-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                                <BookOpen className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg sm:text-xl lg:text-2xl font-medium text-gray-900 mb-2 sm:mb-3">
                                Your shelf is empty
                            </h3>
                            <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed mb-6">
                                Start building your personal library! Add books
                                to share with other readers and discover new
                                titles.
                            </p>
                            <Button
                                onClick={() =>
                                    (window.location.href = "/add-book")
                                }
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Your First Book
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        // </div>
    );
}
