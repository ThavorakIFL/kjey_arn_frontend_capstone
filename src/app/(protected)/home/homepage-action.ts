"use server";
import { PaginatedBooks } from "@/types/paginated-books";
import { Book } from "@/types/book";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { authenticatedFetch, publicFetch } from "@/lib/utils";

interface FetchBooksOptions {
    perPage?: number;
    genres?: number[];
    page?: number;
}

export async function fetchNewlyAddedBooks({
    limit = 14,
}: {
    limit?: number;
} = {}): Promise<{ books: Book[]; error: string | null }> {
    try {
        const params = new URLSearchParams();
        params.append("limit", limit.toString());

        const data = await publicFetch(`newly-added-books?${params}`);
        return { books: data.data, error: null };
    } catch (error) {
        return {
            books: [],
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function fetchBooks({
    perPage = 20,
    genres = [],
    page = 1,
}: FetchBooksOptions): Promise<{ books: Book[]; error: string | null }> {
    try {
        const params = new URLSearchParams();
        params.append("per_page", perPage.toString());
        params.append("page", page.toString());

        if (genres.length > 0) {
            genres.forEach((genreId) =>
                params.append("genres[]", genreId.toString())
            );
        }
        const data: PaginatedBooks = await publicFetch(`all-books?${params}`);
        return { books: data.data.books, error: null };
    } catch (error) {
        return {
            books: [],
            error: error instanceof Error ? error.message : String(error),
        };
    }
}

export async function checkBorrowEvent() {
    try {
        return await authenticatedFetch("check-borrow-event");
    } catch (error) {
        throw error;
    }
}

export async function checkUnconfirmedMeetups() {
    try {
        return await authenticatedFetch("check-unconfirmed-meetups");
    } catch (error) {
        throw error;
    }
}

export async function checkUnacceptedBorrowRequests() {
    try {
        return await authenticatedFetch("check-unaccepted-borrow-requests");
    } catch (error) {
        throw error;
    }
}

export async function checkForOverdueAcceptedEvents() {
    try {
        return await authenticatedFetch("check-overdue-accepted-borrow-events");
    } catch (error) {
        throw error;
    }
}
export async function checkForOverdueReturnEvents() {
    try {
        return await authenticatedFetch("check-overdue-return-events");
    } catch (error) {
        throw error;
    }
}

export async function checkUserStatus(userId: string, accessToken: string) {
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}check-user-status/${userId}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.status; // Assuming backend returns { status: 0 | 1 }
    } catch (error) {
        console.error("Error checking user status:", error);
        return null; // Return null on error to avoid disrupting the flow
    }
}
