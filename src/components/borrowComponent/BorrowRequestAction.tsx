import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    CheckCircle,
    XCircle,
    Clock,
    MapPin,
    AlertCircle,
    Calendar as CalendarIcon,
} from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface BorrowRequestActionProps {
    onAccept: (formData: {
        final_time: string;
        final_location: string;
    }) => void;
    onReject: (reason: string) => void;
    isSubmitting: boolean;
}

export function BorrowRequestAction({
    onAccept,
    onReject,
    isSubmitting,
}: BorrowRequestActionProps) {
    const [showAcceptForm, setShowAcceptForm] = useState(false);
    const [showRejectForm, setShowRejectForm] = useState(false);
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
            setError(
                "Please fill in start date, end date, meeting time, and location"
            );
            return;
        }

        // Format dates to ISO string for backend
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

    return (
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="bg-black text-white p-6">
                <h2 className="text-2xl font-semibold">Actions</h2>
            </div>
            <div className="p-6">
                {!showAcceptForm && !showRejectForm && (
                    <div className="flex gap-4">
                        <Button
                            onClick={() => setShowRejectForm(true)}
                            variant="destructive"
                            className="flex-1 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Request
                        </Button>
                        <Button
                            onClick={() => setShowAcceptForm(true)}
                            className="flex-1 bg-green-600 hover:bg-green-700 cursor-pointer"
                            disabled={isSubmitting}
                        >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Accept Request
                        </Button>
                    </div>
                )}

                {/* Accept Form */}
                {showAcceptForm && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Set Meeting Details
                        </h3>
                        <div className="space-y-4">
                            {/* Meeting Time */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
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

                            {/* Meeting Location */}
                            <div>
                                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2 mb-2">
                                    <MapPin className="h-4 w-4" />
                                    Meeting Location
                                </label>
                                <textarea
                                    value={meetUpData.final_location}
                                    onChange={(e) =>
                                        setMeetUpData((prev) => ({
                                            ...prev,
                                            final_location: e.target.value,
                                        }))
                                    }
                                    placeholder="Enter the meeting location..."
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    rows={3}
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setShowAcceptForm(false);
                                    setError(null);
                                    setSelectedTime("");
                                    setMeetUpData({
                                        final_time: "",
                                        final_location: "",
                                    });
                                }}
                                variant="outline"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleAccept}
                                className="flex-1 bg-green-600 hover:bg-green-700"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : "Confirm Accept"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Reject Form */}
                {showRejectForm && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Reason for Rejection
                        </h3>
                        <textarea
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting this request..."
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                            rows={4}
                            required
                        />
                        <div className="flex gap-3">
                            <Button
                                onClick={() => {
                                    setShowRejectForm(false);
                                    setError(null);
                                    setRejectionReason("");
                                }}
                                variant="outline"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleReject}
                                variant="destructive"
                                className="flex-1"
                                disabled={isSubmitting}
                            >
                                {isSubmitting
                                    ? "Processing..."
                                    : "Confirm Reject"}
                            </Button>
                        </div>
                    </div>
                )}

                {/* Error Display */}
                {error && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 text-red-700">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
