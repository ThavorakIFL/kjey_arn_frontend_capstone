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
            <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
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
            <div className="p-8">
                <div className="flex flex-col">
                    <div
                        style={{ minHeight: "10rem" }}
                        className="flex bg-white rounded-lg shadow-lg px-8 items-center"
                    >
                        <div className="rounded-full my-auto border ">
                            <ProfileIcon
                                className="w-48 h-48"
                                imageUrl={
                                    session?.user?.image || "ProfilePicture"
                                }
                            />
                        </div>

                        <div className="flex-grow flex-col px-4 my-8 space-y-8 py-6">
                            <div className="flex">
                                <div className="flex flex-col space-y-2">
                                    <h1 className="text-4xl font-semibold">
                                        {userData.name}
                                    </h1>
                                    <h3 className="text-md">
                                        {userData.email}
                                    </h3>
                                </div>

                                <div className="ml-auto">
                                    <Select
                                        value={selectAction}
                                        onValueChange={handleAction}
                                    >
                                        <SelectTrigger>
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
                            <div className="flex-grow">
                                <h1 className="text-2xl font-semibold">Bio</h1>
                                {editingBio ? (
                                    <div className="w-full flex flex-col space-y-4">
                                        <textarea
                                            onChange={(e) =>
                                                setBio(e.target.value)
                                            }
                                            value={bio}
                                            className="flex-grow shadow-xl border rounded-lg p-2"
                                            rows={4}
                                        />
                                        <div className="flex space-x-4">
                                            <button
                                                className="w-auto border border-black shadow-md bg-white px-4 py-2 rounded-md cursor-pointer transition"
                                                onClick={handleCancel}
                                                disabled={isSubmitting}
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                className="w-auto bg-primary text-white px-4 py-2 rounded-md transition cursor-pointer"
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
                                    <p>{userData.bio}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <TitleBar className="my-8" title="My Shelf" />
                    <div className="grid grid-cols-7 gap-4 mb-8">
                        {userBookData.length > 0 ? (
                            userBookData.map((book) => (
                                <Book key={book.id} book={book} />
                            ))
                        ) : (
                            <p className="text-gray-500">No books available.</p>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
