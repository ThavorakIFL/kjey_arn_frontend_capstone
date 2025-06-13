"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function fetchUserHistoryBorrowEventData() {
    const session = await getServerSession(authOptions);
    const token = session?.accessToken;
    try {
        const url = `${process.env.NEXT_PUBLIC_API_URL}history`;
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        if (!data.success) {
            throw new Error("Failed to fetch borrow event data");
        }
        return data;
    } catch (error) {
        console.error("Error fetching borrow event data:", error);
        return { data: [] };
    }
}
