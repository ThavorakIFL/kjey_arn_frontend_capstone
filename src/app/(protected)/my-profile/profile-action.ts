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
        console.error("Error fetching user profile", error);
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
            throw new Error("Failed to update bio");
        }
    } catch (error) {
        console.error("Error updating user bio:", error);
        throw error;
    }
}

export async function fetchUserBook() {
    const session = await getServerSession(authOptions);
    console.log("User Sub Id in FetchUserBook", session?.userSubId);
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
        if (!response.ok) {
            throw new Error("Failed to fetch user books");
        }
        const data = await response.json();
        return data;
    } catch (error: any) {
        console.error("Error fetching user books:", error.message);
        return {
            success: false,
            message: error.message,
            data: [],
        };
    }
}
