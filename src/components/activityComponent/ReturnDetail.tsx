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
        <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-lg sm:rounded-xl flex-col flex">
            {/* Header */}
            <div className="bg-black text-white p-3 sm:p-4">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">
                    Return Details
                </h1>
            </div>

            {/* Content */}
            <div className="p-3 sm:p-4 space-y-4 sm:space-y-5">
                {/* Start Date */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Start Date
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:calendar"
                        />
                        <span className="text-sm sm:text-base text-gray-800">
                            {startDate
                                ? formatDateString(startDate)
                                : "Not set"}
                        </span>
                    </div>
                </div>

                {/* End Date */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        End Date
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:calendar"
                        />
                        <span className="text-sm sm:text-base text-gray-800">
                            {endDate ? formatDateString(endDate) : "Not set"}
                        </span>
                    </div>
                </div>

                {/* Return Time */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Return Time
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:clock"
                        />
                        <span className="text-sm sm:text-base text-gray-800">
                            {returnTime === null || returnTime === undefined
                                ? "Waiting for lender to set"
                                : formatTimeString(returnTime)}
                        </span>
                    </div>
                </div>

                {/* Return Location */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Return Location
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:map-pin"
                        />
                        <span className="text-sm sm:text-base text-gray-800 break-words">
                            {returnLocation === null
                                ? "Waiting for lender to set"
                                : returnLocation}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
