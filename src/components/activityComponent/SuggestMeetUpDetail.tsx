import React from "react";
import { Icon } from "@iconify/react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import formatTimeString from "@/utils/TimeConverter";
import formatDateString from "@/utils/DateFormatConverter";

interface SuggestMeetUpDetailProps {
    suggestMeetUpTime?: string;
    suggestMeetUpLocation?: string;
    suggestedByName?: string;
    suggestedByProfilePicture?: string;
    suggestedReason?: string;
    startDate?: string;
    endDate?: string;
}

export function SuggestMeetUpDetail({
    startDate,
    endDate,
    suggestMeetUpTime,
    suggestMeetUpLocation,
    suggestedReason,
    suggestedByName,
    suggestedByProfilePicture: suggestedP = "default-profile.png",
}: SuggestMeetUpDetailProps) {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className=" bg-white shadow-lg border border-gray-200 overflow-hidden rounded-lg sm:rounded-xl flex-col flex">
            {/* Header */}
            <div className="bg-sidebarColor text-white p-3 sm:p-5">
                <h1 className="text-lg sm:text-xl  font-semibold leading-tight">
                    Suggested Meet Up Details
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

                {/* Suggested Meet Up Time */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Suggested Meet Up Time
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:clock"
                        />
                        <span className="text-sm sm:text-base text-gray-800">
                            {suggestMeetUpTime
                                ? formatTimeString(suggestMeetUpTime)
                                : "Not set"}
                        </span>
                    </div>
                </div>

                {/* Suggested Meet Up Location */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Suggested Meet Up Location
                    </h3>
                    <div className="flex space-x-3 sm:space-x-4 items-center bg-gray-50 min-h-10 sm:min-h-12 rounded-lg px-3 sm:px-4 py-2">
                        <Icon
                            className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 flex-shrink-0"
                            icon="lucide:map-pin"
                        />
                        <span className="text-sm sm:text-base text-gray-800 break-words">
                            {suggestMeetUpLocation || "Not set"}
                        </span>
                    </div>
                </div>

                {/* Suggested By */}
                <div className="space-y-2">
                    <h3 className="font-medium text-sm sm:text-base text-gray-900">
                        Suggested By
                    </h3>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0 bg-gray-50 rounded-lg px-3 sm:px-4 py-3 sm:py-2 min-h-10 sm:min-h-12">
                        {/* User Info */}
                        <div className="flex space-x-2 sm:space-x-3 items-center min-w-0 flex-1">
                            <Avatar className="w-7 h-7 sm:w-8 sm:h-8 flex-shrink-0">
                                <AvatarImage
                                    src={
                                        process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                        suggestedP
                                    }
                                />
                                <AvatarFallback className="text-xs sm:text-sm">
                                    PF
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm sm:text-base text-gray-800 truncate">
                                {suggestedByName || "Unknown"}
                            </span>
                        </div>

                        {/* View Reason Button */}
                        {suggestedReason && (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className="h-8 sm:h-9 text-xs sm:text-sm flex-shrink-0 w-full sm:w-auto"
                                        variant="outline"
                                        size="sm"
                                    >
                                        View Reason
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="mx-4 sm:mx-0 max-w-md sm:max-w-lg">
                                    <DialogHeader className="text-left">
                                        <DialogTitle className="text-xl sm:text-2xl">
                                            Suggested Reason
                                        </DialogTitle>
                                        <DialogDescription className="text-gray-800 text-sm sm:text-base leading-relaxed mt-3">
                                            {suggestedReason}
                                        </DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
