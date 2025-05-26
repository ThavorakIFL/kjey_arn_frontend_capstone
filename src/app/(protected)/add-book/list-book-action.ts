"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
// Add a new book
export async function addBook(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}list-book`,
            {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${token}`,
                    // Note: Don't set Content-Type header when sending FormData
                },
                body: formData,
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to add book",
                errors: data.errors || {
                    general: ["An error occurred while adding the book"],
                },
            };
        }

        return {
            success: true,
            message: data.message || "Book added successfully",
            data: data.data,
        };
    } catch (error) {
        console.error("Error adding book:", error);

        return {
            success: false,
            message: "An unexpected error occurred",
            errors: {
                general: ["An unexpected error occurred. Please try again."],
            },
        };
    }
}
