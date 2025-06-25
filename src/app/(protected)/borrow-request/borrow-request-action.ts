"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchBorrowRequestData() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}borrow-requests`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const responseData = await response.json();
        if (responseData.success) {
            return {
                success: true,
                message: "Borrow request data fetched successfully",
                data: responseData.data,
            };
        }
    } catch (error: any) {
        console.error("Error fetching borrow request data:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch borrow request data",
            data: [],
        };
    }
}

export async function fetchLocationData() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}admin/locations`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data.success) {
            return {
                success: false,
                message: data.message || "Failed to fetch location data",
                data: [], // Add data property to match expected type
            };
        }
        return {
            success: true,
            message: "Location data fetched successfully",
            data: data.data || [],
        };
    } catch (error: any) {
        console.error("Error fetching location data:", error);
        // Add return statement in catch block
        return {
            success: false,
            message: "An error occurred while fetching location data",
            data: [], // Include data property
        };
    }
}
export async function sendMeetUpDetail(id: string, formData: FormData) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}borrow-events/set-meet-up/${id}`;
        const jsonData = {
            final_time: formData.get("final_time"),
            final_location: formData.get("final_location"),
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to set meet up detail",
                errors: data.errors || {
                    general: [
                        "An error occurred while setting the meet up detail",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Meet up detail set successfully",
        };
    } catch (error: any) {
        console.error("Error sending meet up detail:", error);
        return {
            success: false,
            message: error.message || "Failed to send meet up detail",
        };
    }
}

export async function rejectBorrowRequest(id: string, reason: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}reject-borrow-request/${id}`;
        const jsonData = {
            reason: reason,
        };
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to reject borrow request",
                errors: data.errors || {
                    general: [
                        "An error occurred while rejecting the borrow request",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Borrow request rejected successfully",
        };
    } catch (error: any) {
        console.error("Error rejecting borrow request:", error);
        return {
            success: false,
            message: error.message || "Failed to reject borrow request",
        };
    }
}
