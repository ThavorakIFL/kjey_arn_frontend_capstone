import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import {
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    AlertCircle,
    Calendar as CalendarIcon,
} from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface BorrowRequestActionProps {
    onAccept: (formData: {
        final_time: string;
        final_location: string;
    }) => void;
    onReject: (reason: string) => void;
    isSubmitting: boolean;
    locationData: {
        success: boolean;
        message: string;
        data: any[];
    };
}

export function BorrowRequestAction({
    onAccept,
    onReject,
    isSubmitting,
    locationData,
}: BorrowRequestActionProps) {
    console.log("Location Data in Popup", locationData);
    const [showAcceptDialog, setShowAcceptDialog] = useState(false);
    const [showRejectDialog, setShowRejectDialog] = useState(false);
    const [meetUpData, setMeetUpData] = useState({
        final_time: "",
        final_location: "",
    });
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [rejectionReason, setRejectionReason] = useState("");
    const [error, setError] = useState<string | null>(null);

    // Generate time options from 8AM to 5PM (hourly)
    const timeOptions = [];
    for (let hour = 8; hour <= 17; hour++) {
        const timeString = `${hour.toString().padStart(2, "0")}:00`;
        const displayTime = new Date(
            `2000-01-01T${timeString}`
        ).toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
        });
        timeOptions.push({ value: timeString, label: displayTime });
    }

    const handleAccept = () => {
        if (!selectedTime || !meetUpData.final_location) {
            setError("Please fill in meeting time and location");
            return;
        }

        const formattedData = {
            final_time: selectedTime,
            final_location: meetUpData.final_location,
        };

        onAccept(formattedData);
    };

    const handleReject = () => {
        if (!rejectionReason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }
        setError(null);
        onReject(rejectionReason);
    };

    const resetAcceptForm = () => {
        setSelectedTime("");
        setMeetUpData({
            final_time: "",
            final_location: "",
        });
        setError(null);
    };

    const resetRejectForm = () => {
        setRejectionReason("");
        setError(null);
    };

    return (
        <>
            <div className="px-4 sm:p-0   ">
                <div className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4">
                    <Button
                        onClick={() => setShowRejectDialog(true)}
                        variant="destructive"
                        className="h-12 w-full sm:w-40 cursor-pointer text-sm sm:text-base  "
                        disabled={isSubmitting}
                    >
                        Reject Request
                    </Button>
                    <Button
                        onClick={() => setShowAcceptDialog(true)}
                        className="h-12  w-full sm:w-40 bg-black hover:bg-black/60  cursor-pointer text-sm sm:text-base"
                        disabled={isSubmitting}
                    >
                        Accept Request
                    </Button>
                </div>
            </div>

            {/* Accept Dialog */}
            <Dialog
                open={showAcceptDialog}
                onOpenChange={(open) => {
                    if (!open) resetAcceptForm();
                    setShowAcceptDialog(open);
                }}
            >
                <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">
                            Set Meeting Details
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 sm:space-y-6 py-4">
                        {/* Meeting Time */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Meeting Time
                            </label>
                            <Select
                                value={selectedTime}
                                onValueChange={setSelectedTime}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select meeting time (8:00 AM - 5:00 PM)" />
                                </SelectTrigger>
                                <SelectContent>
                                    {timeOptions.map((time) => (
                                        <SelectItem
                                            key={time.value}
                                            value={time.value}
                                        >
                                            {time.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Meeting Location
                            </label>
                            <Select
                                value={meetUpData.final_location}
                                onValueChange={(value) =>
                                    setMeetUpData((prev) => ({
                                        ...prev,
                                        final_location: value,
                                    }))
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select meeting location" />
                                </SelectTrigger>
                                <SelectContent>
                                    {locationData.success &&
                                    locationData.data?.length > 0 ? (
                                        locationData.data.map((location) => (
                                            <SelectItem
                                                key={location.id}
                                                value={location.location}
                                            >
                                                {location.location}
                                            </SelectItem>
                                        ))
                                    ) : (
                                        <SelectItem value="" disabled>
                                            No locations available
                                        </SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                            onClick={() => setShowAcceptDialog(false)}
                            variant="outline"
                            className="w-full sm:w-auto text-sm sm:text-base"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAccept}
                            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-sm sm:text-base"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Confirm Accept"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog
                open={showRejectDialog}
                onOpenChange={(open) => {
                    if (!open) resetRejectForm();
                    setShowRejectDialog(open);
                }}
            >
                <DialogContent className="w-[95vw] max-w-md sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">
                            Reason for Rejection
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting this request..."
                            className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            rows={4}
                            required
                        />

                        {/* Error Display */}
                        {error && (
                            <div className="p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                    <span className="text-sm font-medium">
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                    <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                        <Button
                            onClick={() => setShowRejectDialog(false)}
                            variant="outline"
                            className="w-full sm:w-auto text-sm sm:text-base"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleReject}
                            variant="destructive"
                            className="w-full sm:w-auto text-sm sm:text-base"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Processing..." : "Confirm Reject"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
