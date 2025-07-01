import React from "react";
import { Icon } from "@iconify/react";
import formatDateString from "@/utils/DateFormatConverter";
import formatTimeString from "@/utils/TimeConverter";

interface MeetUpDetailProps {
    onSwap?: () => void;
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
    onSwap = () => {},
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
            ? "w-full"
            : "w-full max-w-2xl mx-auto px-2 sm:px-6 lg:px-0";

    return (
        <div className={wrapperClasses}>
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-lg sm:rounded-xl flex flex-col">
                {/* Header */}
                <div className="bg-sidebarColor text-white p-3 sm:p-4 lg:p-5 flex items-center justify-between">
                    <h1 className="text-sm sm:text-lg md:text-xl  font-semibold">
                        Meet Up Details
                    </h1>
                    {onSwap && (
                        <Icon
                            icon="lucide:arrow-right-left"
                            className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white cursor-pointer hover:text-gray-200 transition-colors"
                            onClick={onSwap}
                        />
                    )}
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-6">
                    <div className="space-y-3 sm:space-y-4 lg:space-y-5">
                        {meetUpItems.map((item, index) => (
                            <div key={index} className="space-y-1 sm:space-y-2">
                                <h3 className="text-xs sm:text-sm lg:text-base font-medium text-gray-800">
                                    {item.label}
                                </h3>
                                <div className="flex items-start sm:items-center gap-2 sm:gap-3 bg-gray-50 min-h-[2.5rem] sm:min-h-[3rem] lg:min-h-[3.5rem] rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 transition-colors hover:bg-gray-100">
                                    <Icon
                                        icon={item.icon}
                                        className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-600 flex-shrink-0 mt-0.5 sm:mt-0"
                                    />
                                    <h4 className="text-xs sm:text-sm lg:text-base text-gray-900 leading-relaxed break-words flex-1">
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
