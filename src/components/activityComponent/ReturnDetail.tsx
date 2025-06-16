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
        <div className="bg-white shadow-md p-4 rounded-lg flex-col flex space-y-5">
            <h1 className="text-2xl font-bold">Return Details</h1>
            <div>
                <h3>Start Date</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:calendar" />
                    <h4>
                        {startDate ? formatDateString(startDate) : "Not set"}
                    </h4>
                </div>
                <h3>End Date</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:calendar" />
                    <h4>{endDate ? formatDateString(endDate) : "Not set"}</h4>
                </div>
                <h3>Return Time</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:clock" />
                    <h4>
                        {returnTime === null || returnTime === undefined
                            ? "Waiting for lender to set"
                            : formatTimeString(returnTime)}
                    </h4>
                </div>
            </div>
            <div>
                <h3>Return Location</h3>
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
    );
}
