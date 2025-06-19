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
        <div className="bg-white shadow-lg border border-gray-200 overflow-hidden rounded-xl flex-col flex">
            <div className="bg-black text-white p-4">
                <h1 className="text-2xl font-semibold">
                    Suggested Meet Up Details
                </h1>
            </div>
            <div className="p-4">
                <div className="space-y-2 ">
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
                    <h3 className="font-medium">Suggest Meet Up Time</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:clock" />
                        <h4>
                            {suggestMeetUpTime
                                ? formatTimeString(suggestMeetUpTime)
                                : "Not set"}
                        </h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Suggest Meet Up Location</h3>
                    <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                        <Icon className="w-5 h-5" icon="lucide:map-pin" />
                        <h4>{suggestMeetUpLocation || "Not set"}</h4>
                    </div>
                </div>

                <div className="space-y-2">
                    <h3 className="font-medium">Suggested By</h3>
                    <div className="flex space-x-4 justify-between items-center bg-gray-50 h-12 rounded-lg px-2">
                        <div className="flex space-x-2 items-center">
                            <Avatar className="w-8 h-8">
                                <AvatarImage
                                    src={
                                        process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                        suggestedP
                                    }
                                />
                                <AvatarFallback>PF</AvatarFallback>
                            </Avatar>
                            <h4>{suggestedByName || "Unknown"}</h4>
                        </div>
                        {suggestedReason && (
                            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                                <DialogTrigger asChild>
                                    <Button
                                        className="ml-2 h-8 text-xs"
                                        variant="outline"
                                        size="sm"
                                    >
                                        View Reason
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle className="text-2xl">
                                            Suggested Reason
                                        </DialogTitle>
                                        <DialogDescription className="text-black text-md">
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
