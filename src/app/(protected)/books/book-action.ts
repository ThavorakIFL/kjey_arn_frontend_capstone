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
        const url = `${process.env.NEXT_PUBLIC_API_URL}book/genres`;
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

// export async function updateBook(formData: FormData, bookId: string) {
//     const session = await getServerSession(authOptions);
//     const token = session?.accessToken;

//     try {
//         const response = await fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}book/edit/${bookId}/`,
//             {
//                 method: "POST",
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//                 body: formData,
//             }
//         );
//         const data = await response.json();

//         return {
//             success: data.success,
//             message: data.message || "Updated",
//             errors: data.error || null,
//         };
//     } catch (err: any) {
//         return {
//             success: false,
//             message: err.message || "An error occurred",
//             errors: null,
//         };
//     }
// }

export async function updateBook(formData: FormData, bookId: string) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            return {
                success: false,
                message:
                    "Authentication required. Please log in and try again.",
                errors: {
                    auth: ["You must be logged in to update a book"],
                },
            };
        }

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}book/edit/${bookId}/`,
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

        // Handle different HTTP status codes
        if (!response.ok) {
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                // Handle validation errors (422)
                if (response.status === 422) {
                    return {
                        success: false,
                        message:
                            data.message || "Please check the form for errors",
                        errors: data.errors || {
                            general: [
                                data.message ||
                                    "Validation failed. Please check your input.",
                            ],
                        },
                    };
                }

                // Handle unauthorized (401/403)
                if (response.status === 401 || response.status === 403) {
                    return {
                        success: false,
                        message:
                            "You don't have permission to update this book",
                        errors: {
                            auth: [data.message || "Unauthorized access"],
                        },
                    };
                }

                // Handle not found (404)
                if (response.status === 404) {
                    return {
                        success: false,
                        message: "Book not found",
                        errors: {
                            general: [
                                "The book you're trying to update doesn't exist",
                            ],
                        },
                    };
                }

                // Handle server errors (500)
                if (response.status >= 500) {
                    return {
                        success: false,
                        message: "Server error. Please try again later.",
                        errors: {
                            general: [
                                data.message ||
                                    "Internal server error occurred",
                            ],
                        },
                    };
                }

                // Handle other errors
                return {
                    success: false,
                    message:
                        data.message ||
                        `Server returned ${response.status} error`,
                    errors: data.errors || {
                        general: [
                            data.message ||
                                "An error occurred while processing your request",
                        ],
                    },
                };
            } else {
                return {
                    success: false,
                    message: `Server error (${response.status}). Please try again later.`,
                    errors: {
                        general: [
                            "The server encountered an error. Please try again.",
                        ],
                    },
                };
            }
        }

        // Success response
        const data = await response.json();
        if (!data.success) {
            return {
                success: false,
                message: data.message || "Failed to update book",
                errors: data.errors || {
                    general: ["An error occurred while updating the book"],
                },
            };
        }

        return {
            success: true,
            message: data.message || "Book updated successfully",
            data: data.data,
        };
    } catch (error) {
        console.error("Error updating book:", error);

        // Handle different types of errors
        if (error instanceof TypeError && error.message.includes("fetch")) {
            return {
                success: false,
                message:
                    "Network error. Please check your internet connection.",
                errors: {
                    network: [
                        "Unable to connect to the server. Please check your internet connection and try again.",
                    ],
                },
            };
        }

        if (error instanceof Error) {
            return {
                success: false,
                message: "An unexpected error occurred",
                errors: {
                    general: [
                        error.message ||
                            "An unexpected error occurred. Please try again.",
                    ],
                },
            };
        }

        return {
            success: false,
            message: "An unexpected error occurred",
            errors: {
                general: ["An unexpected error occurred. Please try again."],
            },
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

        // Get response as text first to see what we're actually receiving
        const responseText = await res.text();
        // Check if it's HTML (Laravel error page)
        if (
            responseText.trim().startsWith("<!DOCTYPE") ||
            responseText.trim().startsWith("<html")
        ) {
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
            // For validation errors (422) and other client errors (400-499)
            if (res.status >= 400 && res.status < 500) {
                // Handle Laravel validation errors specifically
                if (res.status === 422 && data.errors) {
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

        return { success: true, message: data.message };
    } catch (error: any) {
        // Only catch network errors or thrown server errors
        return {
            success: false,
            message: error.message || "Network error occurred",
            errors: null,
        };
    }
}
