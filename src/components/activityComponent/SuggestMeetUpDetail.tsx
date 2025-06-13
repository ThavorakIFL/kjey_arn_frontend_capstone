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
interface SuggestMeetUpDetailProps {
    suggestMeetUpTime?: string;
    suggestMeetUpLocation?: string;
    suggestedByName?: string;
    suggestedByProfilePicture?: string;
    suggestedReason?: string;
}

export function SuggestMeetUpDetail({
    suggestMeetUpTime,
    suggestMeetUpLocation,
    suggestedReason,
    suggestedByName,
    suggestedByProfilePicture: suggestedP = "default-profile.png",
}: SuggestMeetUpDetailProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    return (
        <div className="bg-white shadow-md p-4 rounded-lg flex-col flex space-y-5">
            <h1 className="text-2xl font-bold">Suggested Meet Up Details</h1>
            <div>
                <h3>Suggest Meet Up Time</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:clock" />
                    <h4>{suggestMeetUpTime}</h4>
                </div>
            </div>
            <div>
                <h3>Suggest Meet Up Locadtion</h3>
                <div className="flex space-x-4 items-center bg-gray-50 h-12 rounded-lg px-2">
                    <Icon className="w-5 h-5" icon="lucide:map-pin" />
                    <h4>{suggestMeetUpLocation}</h4>
                </div>
            </div>
            <div className="flex space-x-4">
                <Avatar className="w-12 h-12">
                    <AvatarImage
                        src={process.env.NEXT_PUBLIC_IMAGE_PATH! + suggestedP}
                    />
                    <AvatarFallback>PF</AvatarFallback>
                </Avatar>
                <div>
                    <h1>Suggeted By</h1>
                    <h1>{suggestedByName}</h1>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button
                            className="h-12 w-full md:w-auto cursor-pointer"
                            variant="outline"
                        >
                            View Reason
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle className="text-2xl">
                                Suggested Reason
                            </DialogTitle>
                            <DialogDescription className=" text-black text-md ">
                                {suggestedReason}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
