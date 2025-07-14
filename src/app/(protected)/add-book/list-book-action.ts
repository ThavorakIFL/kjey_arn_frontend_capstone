"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// Add a new book
export async function addBook(formData: FormData) {
    try {
        const session = await getServerSession(authOptions);
        const token = session?.accessToken;

        if (!token) {
            return {
                success: false,
                message:
                    "Authentication required. Please log in and try again.",
                errors: {
                    auth: ["You must be logged in to list a book"],
                },
            };
        }
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
                                "Validation failed. Please check your input.",
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
