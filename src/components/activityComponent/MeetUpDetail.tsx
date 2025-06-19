import React from "react";
import { Icon } from "@iconify/react";
import formatDateString from "@/utils/DateFormatConverter";
import formatTimeString from "@/utils/TimeConverter";

interface MeetUpDetailProps {
    meetUpTime?: string;
    meetUpLocation?: string;
    startDate?: string;
    endDate?: string;
}

export function MeetUpDetail({
    meetUpTime,
    meetUpLocation,
    startDate,
    endDate,
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

    return (
        <div className="w-full max-w-2xl mx-auto px-4 sm:px-0">
            <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-lg sm:rounded-xl flex flex-col">
                {/* Header */}
                <div className="bg-black text-white p-3 sm:p-4 lg:p-6">
                    <h1 className="text-lg sm:text-xl md:text-2xl font-semibold">
                        Meet Up Details
                    </h1>
                </div>

                {/* Content */}
                <div className="p-3 sm:p-4 lg:p-6">
                    <div className="space-y-4 sm:space-y-6">
                        {meetUpItems.map((item, index) => (
                            <div key={index} className="space-y-2 sm:space-y-3">
                                <h3 className="text-sm sm:text-base font-medium text-gray-800">
                                    {item.label}
                                </h3>
                                <div className="flex items-center gap-3 sm:gap-4 bg-gray-50 min-h-[3rem] sm:min-h-[3.5rem] rounded-lg px-3 sm:px-4 py-2 sm:py-3">
                                    <Icon
                                        className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                                        icon={item.icon}
                                    />
                                    <h4 className="text-sm sm:text-base text-gray-900 leading-relaxed">
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
