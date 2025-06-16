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
    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-col flex space-y-5">
            <h1 className="text-2xl font-bold">Meet Up Details</h1>
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
                <h3>Meet Up Time</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:clock" />
                    <h4>
                        {meetUpTime === null || meetUpTime === undefined
                            ? "Waiting for lender to set"
                            : formatTimeString(meetUpTime)}
                    </h4>
                </div>
            </div>
            <div>
                <h3>Meet Up Location</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:map-pin" />
                    <h4>
                        {meetUpLocation === null
                            ? "Waiting for lender to set"
                            : meetUpLocation}
                    </h4>
                </div>
            </div>
        </div>
    );
}
