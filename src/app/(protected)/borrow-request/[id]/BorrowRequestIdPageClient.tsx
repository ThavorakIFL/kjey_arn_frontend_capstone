"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
interface BorrowRequestIdPageClientProps {
    borrowRequestData: BorrowEventType;
    setMeetUpDetail: (
        id: string,
        formData: FormData
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
    rejectBorrowRequest: (
        id: string,
        reason: string
    ) => Promise<{
        success: boolean;
        message: string;
    }>;
}

export default function BorrowRequestIdPageClient({
    borrowRequestData,
    setMeetUpDetail,
    rejectBorrowRequest,
}: BorrowRequestIdPageClientProps) {
    const [formData, setFormData] = useState({
        final_time: "08:00",
        final_location: "",
    });
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);
        try {
            const formDataToSend = new FormData();
            formDataToSend.append("final_time", formData.final_time);
            formDataToSend.append("final_location", formData.final_location);
            const result = await setMeetUpDetail(
                borrowRequestData.id,
                formDataToSend
            );
            if (result.success) {
                alert(result.message);
            }
        } catch (error) {
            console.error("Error submitting form:", error);
            setError("An error occurred while submitting the form.");
        } finally {
            setIsSubmitting(false);
            router.push("/home");
        }
    };
    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    const handleTextChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleRejectReason = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { value } = e.target;
        setRejectReason(value);
    };

    const handleRejectBorrow = async () => {
        setIsSubmitting(true);
        setError(null);
        try {
            const result = await rejectBorrowRequest(
                borrowRequestData.id,
                rejectReason || ""
            );
            if (result.success) {
                alert(result.message);
                router.push("/home");
            } else {
                setError(result.message);
            }
        } catch (error) {
            console.error("Error rejecting borrow request:", error);
            setError("An error occurred while rejecting the borrow request.");
        }
    };

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Borrow Request Details</h1>
            <h2>{borrowRequestData.borrower.name}</h2>
            <h2>{borrowRequestData.lender.name}</h2>
            <h2>{borrowRequestData.book.title}</h2>
            <h2>
                Borrow Duration: {borrowRequestData.meet_up_detail.start_date} -{" "}
                {borrowRequestData.meet_up_detail.end_date}
            </h2>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant={"destructive"}>Reject</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Borrow Request</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to reject this borrow request?
                            This action cannot be undone.
                        </DialogDescription>
                        <div className="w-full">
                            <label
                                htmlFor="rejectReason"
                                className="block text-sm font-medium mb-2"
                            >
                                Reason For Rejection
                            </label>
                            <input
                                className="w-full"
                                onChange={handleRejectReason}
                                id="rejectReason"
                                value={rejectReason || ""}
                                type="text"
                                placeholder="Enter Reason for Rejection"
                            />
                        </div>
                        <DialogFooter>
                            <Button variant={"outline"}>Cancel</Button>
                            <Button
                                onClick={handleRejectBorrow}
                                variant={"destructive"}
                            >
                                {" "}
                                Confirm Reject
                            </Button>
                        </DialogFooter>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="meetUpTime">Meet Up Time</label>
                    <select
                        onChange={handleSelectChange}
                        value={formData.final_time}
                        id="meetUpTime"
                        name="final_time"
                        className="border border-gray-300 rounded-md p-2 w-full"
                    >
                        {Array.from({ length: 10 }, (_, i) => {
                            const hour = i + 8; // Start from 8
                            const displayHour = hour > 12 ? hour - 12 : hour;
                            const amPm = hour < 12 ? "AM" : "PM";
                            const value = `${hour
                                .toString()
                                .padStart(2, "0")}:00`;

                            return (
                                <option key={hour} value={value}>
                                    {displayHour}:00 {amPm}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div>
                    <label htmlFor="meetUpLocation">Meet Up Location</label>
                    <input
                        value={formData.final_location}
                        name="final_location"
                        className="bg-red-300"
                        id="meetUpLocation"
                        onChange={handleTextChange}
                        type="text"
                    />
                </div>
                <Button
                    className="cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                    variant={"default"}
                >
                    Set Meet Up Date
                </Button>
            </form>
        </div>
    );
}
