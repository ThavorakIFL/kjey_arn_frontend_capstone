// "use server";

// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";

// export async function fetchUserHistoryBorrowEventData() {
//     const session = await getServerSession(authOptions);
//     const token = session?.accessToken;

//     // Handle case where user is not authenticated
//     if (!token) {
//         console.warn("No authentication token found");
//         return { success: false, data: [], error: "Not authenticated" };
//     }

//     try {
//         const url = `${process.env.NEXT_PUBLIC_API_URL}history`;
//         const response = await fetch(url, {
//             method: "GET",
//             headers: {
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}`,
//             },
//         });

//         if (!response.ok) {
//             throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const data = await response.json();

//         if (!data.success) {
//             console.warn("API returned unsuccessful response:", data);
//             return {
//                 success: false,
//                 data: [],
//                 error: data.message || "Failed to fetch borrow event data",
//             };
//         }

//         // Handle case where API returns success but no data or empty data
//         return {
//             success: true,
//             data: Array.isArray(data.data) ? data.data : [],
//             error: null,
//         };
//     } catch (error) {
//         console.error("Error fetching borrow event data:", error);
//         return {
//             success: false,
//             data: [],
//             error:
//                 error instanceof Error
//                     ? error.message
//                     : "Unknown error occurred",
//         };
//     }
// }

// server-actions.ts
"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface FetchHistoryParams {
    page?: number;
    status?: string;
    per_page?: number;
}

export async function fetchUserHistoryBorrowEventData({
    page = 1,
    status = "all",
    per_page = 12,
}: FetchHistoryParams = {}) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;

    // Handle case where user is not authenticated
    if (!token) {
        console.warn("No authentication token found");
        return {
            success: false,
            data: [],
            pagination: null,
            error: "Not authenticated",
        };
    }

    try {
        // Build query parameters
        const params = new URLSearchParams({
            page: page.toString(),
            per_page: per_page.toString(),
        });

        // Add status filter if not "all"
        if (status && status !== "all") {
            params.append("status", status);
        }

        const url = `${
            process.env.NEXT_PUBLIC_API_URL
        }history?${params.toString()}`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("API response data:", data);
        if (!data.success) {
            console.warn("API returned unsuccessful response:", data);
            return {
                success: false,
                data: [],
                pagination: null,
                error: data.message || "Failed to fetch borrow event data",
            };
        }

        // Handle case where API returns success but no data or empty data
        return {
            success: true,
            data: Array.isArray(data.data) ? data.data : [],
            pagination: data.pagination || null,
            error: null,
        };
    } catch (error) {
        console.error("Error fetching borrow event data:", error);
        return {
            success: false,
            data: [],
            pagination: null,
            error:
                error instanceof Error
                    ? error.message
                    : "Unknown error occurred",
        };
    }
}
