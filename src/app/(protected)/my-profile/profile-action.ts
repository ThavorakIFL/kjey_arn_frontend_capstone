"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function getUserProfile() {
    const session = await getServerSession(authOptions);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${session?.userSubId}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        const profileData = await response.json();
        return await profileData;
    } catch (error) {
        throw error;
    }
}

export async function updateUserBio(bio: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${session?.userSubId}`,
            {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ bio }),
            }
        );

        if (!response.ok) {
            return {
                success: false,
                message: "Failed to update bio. Please try again.",
            };
        }

        return {
            success: true,
            message: "Bio updated successfully!",
        };
    } catch (error) {
        console.error("Error updating bio:", error);
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred",
        };
    }
}

export async function fetchUserBook() {
    const session = await getServerSession(authOptions);
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${session?.userSubId}/get-books`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        const data = await response.json();

        if (response.ok) {
            return {
                success: true,
                message: data.message || "Books retrieved successfully",
                data: data.data || [],
            };
        }

        if (data.message === "No books found for this user") {
            return {
                success: false,
                message: "No books found for this user",
                data: [],
            };
        }

        throw new Error(data.message || "Failed to fetch user books");
    } catch (error: any) {
        return {
            success: false,
            message:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
            data: [],
        };
    }
}
