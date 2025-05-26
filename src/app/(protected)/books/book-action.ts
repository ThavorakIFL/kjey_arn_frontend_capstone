"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const fetchBookData = async (id: string) => {
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}get-books/${id}`;
        const response = await fetch(url);
        if (!response.ok) {
            const errorMessage = `Failed to fetch book data. Status: ${response.status}`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
        const data = await response.json();
        if (!data) {
            console.error("No data returned from API");
            throw new Error("No data found.");
        }
        return data.data;
    } catch (error) {
        throw error;
    }
};

export async function updateBook(formData: FormData, bookId: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}book/edit/${bookId}/`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            }
        );
        const data = await response.json();

        return {
            success: data.success,
            message: data.message || "Updated",
            errors: data.error || null,
        };
    } catch (err: any) {
        return {
            success: false,
            message: err.message || "An error occurred",
            errors: null,
        };
    }
}

export async function deleteBook(bookId: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}book/delete/${bookId}`,
            {
                method: "DELETE",
                credentials: "include",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const data = await res.json();

        if (!res.ok) {
            throw new Error(data.message || "Failed to delete book");
        }

        return { success: true, message: data.message };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred",
        };
    }
}

export async function requestBorrow(formData: FormData) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}borrow-event`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    book_id: formData.get("book_id"),
                    start_date: formData.get("start_date"),
                    end_date: formData.get("end_date"),
                }),
            }
        );
        const data = await res.json();
        if (!res.ok) {
            throw new Error(data.message || "Failed to request book borrow");
        }
        return { success: true, message: data.message };
    } catch (error: any) {
        return {
            success: false,
            message: error.message || "An error occurred",
            errors: error.errors || null,
        };
    }
}
