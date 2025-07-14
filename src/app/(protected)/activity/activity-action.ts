"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchBorrowEventByStatus(statusId: string) {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = statusId
            ? `${process.env.NEXT_PUBLIC_API_URL}borrow-events?borrow_status_id=${statusId}`
            : `${process.env.NEXT_PUBLIC_API_URL}borrow-events`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data) {
            console.error("No data returned from API");
            throw new Error("No data found.");
        }
        return data;
    } catch (error: any) {
        console.error("Error fetching borrow request data:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch borrow request data",
            data: [],
        };
    }
}

export const fetchBorrowRequest = async (id: number) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}borrow-events/${id}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await response.json();
        if (!data) {
            throw new Error("No data found.");
        }
        return data;
    } catch (error: any) {
        console.error("Error fetching borrow request data:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch borrow request data",
            data: [],
        };
    }
};

export const cancelBorrowRequest = async (id: string, reason: string) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}borrow-events/${id}/cancel`,
            {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ reason }),
            }
        );
        const data = await response.json();
        if (data.success) {
            return {
                success: true,
                message: "Borrow request cancelled successfully",
            };
        } else {
            console.error("Failed to cancel borrow request:", data.message);
            return {
                success: false,
                message: data.message || "Failed to cancel borrow request",
                data: [],
            };
        }
    } catch (error: any) {
        console.error("Error cancelling borrow request:", error);
        return {
            success: false,
            message: error.message || "Failed to cancel borrow request",
            data: [],
        };
    }
};

export const acceptMeetUpRequest = async (
    id: string,
    meet_up_status_id: number
) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    const jsonData = {
        meet_up_status_id: meet_up_status_id,
    };
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}borrow-events/set-meet-up/confirm-meet-up/${id}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
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
            message: "Meet up request accepted successfully",
        };
    } catch (error: any) {
        console.error("Error accepting meet up request:", error);
        return {
            success: false,
            message: error.message || "Failed to accept meet up request",
            data: [],
        };
    }
};

export const setReturnDetail = async (id: string, formData: FormData) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}set-return-date/${id}`;
        const jsonData = {
            return_time: formData.get("return_time"),
            return_location: formData.get("return_location"),
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
                message: data.message || "Failed to set return detail",
                errors: data.errors || {
                    general: [
                        "An error occurred while setting the return detail",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Return detail set successfully",
        };
    } catch (error: any) {
        console.error("Error setting return detail:", error);
        return {
            success: false,
            message: error.message || "Failed to set return detail",
            data: [],
        };
    }
};

export const confirmReceiveBook = async (id: string) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}confirm-receive-book/${id}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to confirm receive book",
                errors: data.errors || {
                    general: [
                        "An error occurred while confirming the receive book",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Book received successfully",
        };
    } catch (error: any) {
        console.error("Error confirming receive book:", error);
        return {
            success: false,
            message: error.message || "Failed to confirm receive book",
            data: [],
        };
    }
};

export const suggestMeetUpRequest = async (id: string, formData: FormData) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}set-meet-up/${id}/suggest-meet-up`;
        const jsonData = {
            suggested_time: formData.get("suggested_time"),
            suggested_location: formData.get("suggested_location"),
            suggested_reason: formData.get("suggested_reason"),
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
                message: data.message || "Failed to suggest meet up",
                errors: data.errors || {
                    general: ["An error occurred while suggesting the meet up"],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Meet up suggested successfully",
        };
    } catch (error: any) {
        console.error("Error suggesting meet up request:", error);
        return {
            success: false,
            message: error.message || "Failed to suggest meet up",
            data: [],
        };
    }
};

export const acceptSuggestion = async (id: string) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}set-meet-up/${id}/suggest-meet-up-confirmation`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to accept suggestion",
                errors: data.errors || {
                    general: [
                        "An error occurred while accepting the suggestion",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Suggestion accepted successfully",
        };
    } catch (error: any) {
        console.error("Error accepting suggestion:", error);
        return {
            success: false,
            message: error.message || "Failed to accept suggestion",
            data: [],
        };
    }
};

export const reportBorrowEvent = async (id: string, reason: string) => {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}report-borrow-event/${id}`;
        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ reason }),
        });
        const data = await response.json();
        if (!response.ok) {
            return {
                success: false,
                message: data.message || "Failed to report borrow event",
                errors: data.errors || {
                    general: [
                        "An error occurred while reporting the borrow event",
                    ],
                },
            };
        }
        return {
            success: true,
            message: data.message || "Borrow event reported successfully",
        };
    } catch (error: any) {
        console.error("Error reporting borrow event:", error);
        return {
            success: false,
            message: error.message || "Failed to report borrow event",
            data: [],
        };
    }
};
