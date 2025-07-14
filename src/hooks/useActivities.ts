// hooks/useActivities.ts
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Activity {
    id: string;
    type: string;
    message: string;
    actor_name: string;
    book_title: string;
    time_ago: string;
    created_at: string;
    borrow_event_id: number;
}

export function useActivities() {
    const { data: session } = useSession();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newCount, setNewCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchActivities = async () => {
        if (!session?.accessToken) {
            setLoading(false);
            return;
        }
        setLoading(true);
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}activities`;
        try {
            const response = await fetch(apiUrl, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${session.accessToken}`,
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
            });
            // Check if we're getting HTML instead of JSON
            const contentType = response.headers.get("content-type");
            if (!response.ok) {
                const errorText = await response.text();
                console.error("Error response body:", errorText);
                throw new Error(
                    `HTTP ${response.status}: ${errorText.substring(0, 200)}...`
                );
            }

            // Check if response is actually JSON
            if (!contentType || !contentType.includes("application/json")) {
                const responseText = await response.text();
                console.error(
                    "Expected JSON but got:",
                    responseText.substring(0, 200)
                );
                throw new Error("Response is not JSON");
            }

            const data = await response.json();

            if (data.success) {
                setActivities(data.activities);
                calculateNewCount(data.activities);
            } else {
                console.error("API returned success: false", data);
            }
        } catch (error) {
            console.error("Failed to fetch activities:", error);
        } finally {
            setLoading(false);
        }
    };

    // In useActivities hook, modify calculateNewCount:
    const calculateNewCount = (activityList: Activity[]) => {
        const lastViewed = localStorage.getItem("activities_last_viewed");
        if (!lastViewed) {
            setNewCount(activityList.length);
            return;
        }
        const lastViewedDate = new Date(lastViewed);
        const newActivities = activityList.filter((activity) => {
            const activityDate = new Date(activity.created_at);
            const isNew = activityDate > lastViewedDate;
            return isNew;
        });
        setNewCount(newActivities.length);
    };

    const markAsViewed = () => {
        const now = new Date().toISOString();
        localStorage.setItem("activities_last_viewed", now);
        setNewCount(0);
    };

    useEffect(() => {
        if (session?.accessToken) {
            fetchActivities();

            // Check for new activities every 30 seconds
            const interval = setInterval(fetchActivities, 30000);

            return () => clearInterval(interval);
        }
    }, [session?.accessToken]);

    return {
        activities,
        newCount,
        loading,
        fetchActivities,
        markAsViewed,
    };
}
