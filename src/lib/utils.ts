import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

function handleApiError(response: Response, data: any): never {
    console.error("API Error:", {
        status: response.status,
        statusText: response.statusText,
        data: data,
    });

    // Extract error message from various possible formats
    const errorMessage =
        data?.message ||
        data?.error ||
        response.statusText ||
        "An error occurred";

    // Simple, general error handling
    if (response.status >= 500) {
        throw new Error(`Server error: ${errorMessage}`);
    } else if (response.status >= 400) {
        throw new Error(`Request failed: ${errorMessage}`);
    } else {
        throw new Error(`Unexpected error: ${errorMessage}`);
    }
}

export async function authenticatedFetch(
    endpoint: string,
    options: RequestInit = {}
) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
            method: "POST",
            ...options,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
                ...options.headers,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        handleApiError(response, data);
    }
    return data;
}

export async function publicFetch(endpoint: string, options: RequestInit = {}) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
        {
            method: "GET",
            ...options,
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        handleApiError(response, errorData);
    }

    return response.json();
}
