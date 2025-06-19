import React from "react";
import { Icon } from "@iconify/react";
import formatDateString from "@/utils/DateFormatConverter";
import formatTimeString from "@/utils/TimeConverter";

interface MeetUpDetailProps {
    meetUpTime?: string;
    meetUpLocation?: string;
    startDate?: string;
    endDate?: string;
    variant?: "sidebar" | "standalone"; // Add variant prop
}

export function MeetUpDetail({
    meetUpTime,
    meetUpLocation,
    startDate,
    endDate,
    variant = "standalone", // Default to standalone for backward compatibility
}: MeetUpDetailProps) {
    const meetUpItems = [
        {
            label: "Start Date",
            value: startDate ? formatDateString(startDate) : "Not set",
            icon: "lucide:calendar",
        },
        {
            label: "End Date",
            value: endDate ? formatDateString(endDate) : "Not set",
            icon: "lucide:calendar",
        },
        {
            label: "Meet Up Time",
            value:
                meetUpTime === null || meetUpTime === undefined
                    ? "Waiting for lender to set"
                    : formatTimeString(meetUpTime),
            icon: "lucide:clock",
        },
        {
            label: "Meet Up Location",
            value:
                meetUpLocation === null || meetUpLocation === undefined
                    ? "Waiting for lender to set"
                    : meetUpLocation,
            icon: "lucide:map-pin",
        },
    ];

    // Use different wrapper classes based on variant
    const wrapperClasses =
        variant === "sidebar"
            ? "w-full" // No max-width or centering for sidebar
            : "w-full max-w-2xl mx-auto px-4 sm:px-0"; // Original classes for standalone

    return (
        <div className={wrapperClasses}>
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-lg sm:rounded-xl flex flex-col">
                {/* Header */}
                <div className="bg-black text-white p-3 sm:p-4">
                    <h1 className="text-sm sm:text-lg font-semibold">
                        Meet Up Details
                    </h1>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4">
                    <div className="space-y-3 sm:space-y-4">
                        {meetUpItems.map((item, index) => (
                            <div key={index} className="space-y-1 sm:space-y-2">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-800">
                                    {item.label}
                                </h3>
                                <div className="flex items-center gap-2 sm:gap-3 bg-gray-50 min-h-[2.5rem] sm:min-h-[3rem] rounded-lg px-2 sm:px-3 py-2">
                                    <Icon
                                        className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600 flex-shrink-0"
                                        icon={item.icon}
                                    />
                                    <h4 className="text-xs sm:text-sm text-gray-900 leading-relaxed break-words">
                                        {item.value}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
