"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export async function getOtherUserProfile(id: string) {
    const session = await getServerSession(authOptions);

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${id}`
        );
        if (!response.ok) {
            throw new Error("Failed to fetch profile");
        }
        const profile = await response.json();

        if (profile.sub === session?.userSubId) {
            redirect("/my-profile");
        }
        return profile;
    } catch (error) {
        console.error("Error fetching user profile", error);
        throw error;
    }
}

export async function getOtherUserBooks(sub: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}user-profile/${sub}/get-books`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
                cache: "no-store",
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to fetch user books");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching user books", error);
        throw error;
    }
}
