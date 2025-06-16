// components/ActivityBell.tsx
"use client";

import { Bell } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useActivities } from "@/hooks/useActivities";

export default function ActivityBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({
        top: 0,
        right: 0,
    });
    const [mounted, setMounted] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { activities, newCount, loading, fetchActivities, markAsViewed } =
        useActivities();

    // Debug: Log the values
    useEffect(() => {
        console.log("ActivityBell - newCount:", newCount);
        console.log("ActivityBell - activities length:", activities.length);
        console.log("ActivityBell - activities:", activities);

        // Check localStorage
        const lastViewed = localStorage.getItem("activities_last_viewed");
        console.log("Last viewed timestamp:", lastViewed);

        if (activities.length > 0) {
            console.log("Latest activity time:", activities[0]?.created_at);
            if (lastViewed) {
                console.log(
                    "Time comparison:",
                    new Date(activities[0]?.created_at) > new Date(lastViewed)
                );
            }
        }
    }, [activities, newCount]);

    // Ensure we're mounted before using portal
    useEffect(() => {
        setMounted(true);
    }, []);

    const handleClick = () => {
        if (!isOpen && buttonRef.current) {
            // Calculate position relative to viewport
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8, // 8px below the button
                right: window.innerWidth - rect.right, // Align to right edge of button
            });
        }

        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchActivities();
            markAsViewed();
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleEscape);
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen]);

    return (
        <>
            {/* Bell Icon */}
            <button
                ref={buttonRef}
                onClick={handleClick}
                className="relative p-2"
            >
                <Bell className="h-6 w-6" />
                {/* Debug: Show the count even if it's 0 for testing */}
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[18px] text-center">
                    {newCount > 99 ? "99+" : newCount}
                </span>
                {/* Original conditional badge - uncomment after debugging
                {newCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5 min-w-[18px] text-center">
                        {newCount > 99 ? "99+" : newCount}
                    </span>
                )}
                */}
            </button>

            {/* Portal for dropdown - renders outside the normal DOM tree */}
            {isOpen &&
                mounted &&
                createPortal(
                    <div
                        className="fixed w-80 bg-white rounded-lg shadow-xl border z-[99999] max-h-96 overflow-hidden"
                        style={{
                            top: dropdownPosition.top,
                            right: dropdownPosition.right,
                        }}
                    >
                        <div className="p-3 border-b bg-gray-50">
                            <h3 className="font-medium text-gray-900">
                                Recent Activity
                            </h3>
                            {/* Debug info */}
                            <p className="text-xs text-gray-500">
                                Count: {newCount} | Total: {activities.length}
                            </p>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {loading ? (
                                <div className="p-4 text-center text-gray-500">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto"></div>
                                    <p className="mt-2">Loading...</p>
                                </div>
                            ) : activities.length === 0 ? (
                                <div className="p-8 text-center text-gray-500">
                                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                    <p>No recent activity</p>
                                </div>
                            ) : (
                                activities.map((activity, index) => (
                                    <div
                                        key={activity.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${
                                            index !== activities.length - 1
                                                ? "border-b border-gray-100"
                                                : ""
                                        }`}
                                    >
                                        <p className="text-sm text-gray-900 leading-relaxed">
                                            {activity.message}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2 flex items-center">
                                            <span className="w-1 h-1 bg-gray-400 rounded-full mr-2"></span>
                                            {activity.time_ago}
                                        </p>
                                    </div>
                                ))
                            )}
                        </div>

                        {activities.length > 0 && (
                            <div className="p-3 border-t bg-gray-50">
                                <p className="text-xs text-gray-500 text-center">
                                    {activities.length} recent activities
                                </p>
                                {/* Debug: Clear localStorage button */}
                                <button
                                    onClick={() => {
                                        localStorage.removeItem(
                                            "activities_last_viewed"
                                        );
                                        window.location.reload();
                                    }}
                                    className="mt-2 text-xs bg-red-100 text-red-600 px-2 py-1 rounded w-full"
                                >
                                    Reset "Last Viewed" (Debug)
                                </button>
                            </div>
                        )}
                    </div>,
                    document.body
                )}
        </>
    );
}
