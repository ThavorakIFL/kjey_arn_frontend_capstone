"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { BackendGenre, GenreResponse, GenreType } from "@/types/genre";
import { createGenreMapping } from "@/utils/GenreHelper";
export async function fetchGenres(): Promise<{
    backendGenres: BackendGenre[];
    genreMap: Record<string, number>;
    reverseMap: Record<number, GenreType>;
}> {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;
        const url = `${process.env.NEXT_PUBLIC_API_URL}admin/genres`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result: GenreResponse = await response.json();

        if (!result.success) {
            throw new Error(result.message || "Failed to fetch genres");
        }

        const { genreMap, reverseMap } = createGenreMapping(result.data);

        return {
            backendGenres: result.data,
            genreMap,
            reverseMap,
        };
    } catch (error) {
        console.error("Error fetching genres:", error);

        // Fallback to your existing enum structure
        const fallbackGenreMap: Record<string, number> = {
            Horror: 1,
            Romance: 2,
            Adventure: 3,
            "Science Fiction": 4,
            Fantasy: 5,
            Mystery: 6,
            Thriller: 7,
            "Historical Fiction": 8,
            Biography: 9,
            "Self-Help": 10,
            Philosophy: 11,
            Poetry: 12,
            "Young Adult": 13,
            "Children's": 14,
            Dystopian: 15,
            "Non-Fiction": 16,
            Memoir: 17,
            Crime: 18,
            Classic: 19,
            "Comic Book/Graphic Novel": 20,
            Notes: 21,
            "Research Paper": 22,
        };

        const fallbackReverseMap: Record<number, GenreType> = {};
        Object.entries(fallbackGenreMap).forEach(([genre, id]) => {
            fallbackReverseMap[id] = genre as GenreType;
        });

        const fallbackBackendGenres: BackendGenre[] = Object.entries(
            fallbackGenreMap
        ).map(([genre, id]) => ({
            id,
            genre,
        }));

        return {
            backendGenres: fallbackBackendGenres,
            genreMap: fallbackGenreMap,
            reverseMap: fallbackReverseMap,
        };
    }
}

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

    // Debug logging
    console.log("=== DEBUG INFO ===");
    console.log("API URL:", `${process.env.NEXT_PUBLIC_API_URL}borrow-event`);
    console.log("Token:", token ? "Present" : "Missing");
    console.log("Form data:", {
        book_id: formData.get("book_id"),
        start_date: formData.get("start_date"),
        end_date: formData.get("end_date"),
    });

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

        // Debug response details
        console.log("=== RESPONSE DEBUG ===");
        console.log("Status:", res.status);
        console.log("Status Text:", res.statusText);
        console.log("Headers:", Object.fromEntries(res.headers.entries()));

        // Get response as text first to see what we're actually receiving
        const responseText = await res.text();
        console.log("=== RAW RESPONSE ===");
        console.log("Response length:", responseText.length);
        console.log("First 1000 characters:", responseText.substring(0, 1000));

        // Check if it's HTML (Laravel error page)
        if (
            responseText.trim().startsWith("<!DOCTYPE") ||
            responseText.trim().startsWith("<html")
        ) {
            console.log("=== LARAVEL ERROR DETECTED ===");

            // Try to extract error message from HTML
            const errorMatch = responseText.match(
                /<title[^>]*>([^<]+)<\/title>/i
            );
            const errorTitle = errorMatch
                ? errorMatch[1]
                : "Unknown Laravel Error";

            // Look for error message in the page
            const messageMatch =
                responseText.match(
                    /<h1[^>]*class="exception_title"[^>]*>([^<]+)<\/h1>/i
                ) ||
                responseText.match(
                    /<div[^>]*class="exception-message"[^>]*>([^<]+)<\/div>/i
                ) ||
                responseText.match(
                    /<pre[^>]*class="sf-dump-search-wrapper sf-dump-search-wrapper-small"[^>]*>([^<]+)<\/pre>/i
                );

            const errorMessage = messageMatch
                ? messageMatch[1].trim()
                : errorTitle;

            console.log("Laravel Error Title:", errorTitle);
            console.log("Laravel Error Message:", errorMessage);

            return {
                success: false,
                message: `Laravel Error: ${errorMessage}`,
                errors: null,
            };
        }

        // Try to parse as JSON
        let data;
        try {
            data = JSON.parse(responseText);
            console.log("=== PARSED JSON ===");
            console.log("Parsed data:", data);
        } catch (parseError) {
            console.error("=== JSON PARSE ERROR ===");
            console.error("Parse error:", parseError);

            return {
                success: false,
                message:
                    "Server returned invalid response (not JSON). Check console for details.",
                errors: null,
            };
        }

        if (!res.ok) {
            console.log("=== NON-OK RESPONSE ===");
            // For validation errors (422) and other client errors (400-499)
            if (res.status >= 400 && res.status < 500) {
                // Handle Laravel validation errors specifically
                if (res.status === 422 && data.errors) {
                    console.log("=== VALIDATION ERROR ===");
                    console.log("Validation errors:", data.errors);

                    // Extract first validation error message
                    const firstError = Object.values(data.errors)[0];
                    const errorMessage = Array.isArray(firstError)
                        ? firstError[0]
                        : firstError;
                    return {
                        success: false,
                        message:
                            errorMessage || data.message || "Validation failed",
                        errors: data.errors,
                    };
                }

                return {
                    success: false,
                    message: data.message || "Failed to request book borrow",
                    errors: data.errors || null,
                };
            }
            // For server errors (500+)
            throw new Error(data.message || "Server error occurred");
        }

        console.log("=== SUCCESS RESPONSE ===");
        return { success: true, message: data.message };
    } catch (error: any) {
        console.error("=== NETWORK/FETCH ERROR ===");
        console.error("Error:", error);
        // Only catch network errors or thrown server errors
        return {
            success: false,
            message: error.message || "Network error occurred",
            errors: null,
        };
    }
}
