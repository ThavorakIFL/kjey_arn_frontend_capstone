"use server";
import { PaginatedBooks } from "@/types/paginated-books"; // Adjust import path
import { Book } from "@/types/book"; // Adjust import path
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}newly-added-books?${params}`,
            {
                method: "GET",
            }
        );

        if (!response.ok) {
            return { books: [], error: "Failed to fetch newly added books." };
        }

        const data = await response.json();
        return { books: data.data, error: null };
    } catch (error) {
        console.error("Error fetching newly added books:", error);
        return {
            books: [],
            error: "An error occurred while fetching newly added books.",
        };
    }
}

export async function fetchBooks({
    perPage = 20,
    genres = [],
    page = 1,
}: FetchBooksOptions): Promise<{ books: Book[]; error: string | null }> {
    const params = new URLSearchParams();

    params.append("per_page", perPage.toString());
    params.append("page", page.toString());

    if (genres.length > 0) {
        genres.forEach((genreId) =>
            params.append("genres[]", genreId.toString())
        );
    }

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}all-books`,
        {
            method: "GET",
        }
    );
    if (!response.ok) {
        return { books: [], error: "Failed to fetch books." }; // Return empty books and error
    }

    const data: PaginatedBooks = await response.json();
    return { books: data.data.books, error: null }; // Return books and no error
}

export async function checkBorrowEvent() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}check-borrow-event`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            // Only treat actual errors as errors
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                data: data,
            });

            switch (response.status) {
                case 401:
                    throw new Error("Authentication required");
                case 500:
                    throw new Error("Server error occurred");
                default:
                    throw new Error(
                        `Request failed: ${data.message || response.statusText}`
                    );
            }
        }

        // All 200 responses are successful, regardless of data content
        return data;
    } catch (error) {
        console.error("Error checking borrow event", error);
        throw error;
    }
}

export async function checkUnconfirmedMeetups() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}check-unconfirmed-meetups`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            // Only treat actual errors as errors
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                data: data,
            });

            switch (response.status) {
                case 401:
                    throw new Error("Authentication required");
                case 500:
                    throw new Error("Server error occurred");
                default:
                    throw new Error(
                        `Request failed: ${data.message || response.statusText}`
                    );
            }
        }

        return data;
    } catch (error) {
        console.error("Error checking unconfirmed meetups", error);
        throw error;
    }
}

export async function checkUnacceptedBorrowRequests() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}check-unaccepted-borrow-requests`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const data = await response.json();

        if (!response.ok) {
            // Only treat actual errors as errors
            console.error("API Error:", {
                status: response.status,
                statusText: response.statusText,
                data: data,
            });

            switch (response.status) {
                case 401:
                    throw new Error("Authentication required");
                case 500:
                    throw new Error("Server error occurred");
                default:
                    throw new Error(
                        `Request failed: ${data.message || response.statusText}`
                    );
            }
        }

        return data;
    } catch (error) {
        console.error("Error checking unaccepted borrow requests", error);
        throw error;
    }
}
