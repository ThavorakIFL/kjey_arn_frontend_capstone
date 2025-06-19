import React from "react";
import { Icon } from "@iconify/react";
import formatDateString from "@/utils/DateFormatConverter";
import formatTimeString from "@/utils/TimeConverter";

interface ReturnDetailProps {
    returnTime?: string;
    returnLocation?: string;
    startDate?: string;
    endDate?: string;
}

export function ReturnDetail({
    returnTime,
    returnLocation,
    startDate,
    endDate,
}: ReturnDetailProps) {
    return (
        <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-xl flex-col flex">
            <div className="bg-black text-white p-4">
                <h1 className="text-2xl font-semibold">Return Details</h1>
            </div>
            <div className="p-4">
                <div className="space-y-2">
                    <h3 className="font-medium">Start Date</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:calendar" />
                        <h4>
                            {startDate
                                ? formatDateString(startDate)
                                : "Not set"}
                        </h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">End Date</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:calendar" />
                        <h4>
                            {endDate ? formatDateString(endDate) : "Not set"}
                        </h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Return Time</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:clock" />
                        <h4>
                            {returnTime === null || returnTime === undefined
                                ? "Waiting for lender to set"
                                : formatTimeString(returnTime)}
                        </h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Return Location</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:map-pin" />
                        <h4>
                            {returnLocation === null
                                ? "Waiting for lender to set"
                                : returnLocation}
                        </h4>
                    </div>
                </div>
            </div>
        </div>
    );
}
