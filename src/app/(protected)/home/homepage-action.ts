"use server";
import { PaginatedBooks } from "@/types/paginated-books"; // Adjust import path
import { Book } from "@/types/book"; // Adjust import path

interface FetchBooksOptions {
    perPage?: number;
    genres?: number[];
    page?: number;
}

export async function fetchNewlyAddedBooks({
    limit = 20,
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
