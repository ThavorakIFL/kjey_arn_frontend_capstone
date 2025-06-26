import React, { useState } from "react";
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
import { TimeSelector } from "../TimeSelector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SuggestMeetupDialogProps {
    onSuggest: (data: {
        suggested_time: string;
        suggested_location: string;
        suggested_reason: string;
    }) => void;
    isSubmitting: boolean;
    locationData: {
        success: boolean;
        message: string;
        data: any[];
    };
}

export function SuggestMeetupDialog({
    onSuggest,
    isSubmitting,
    locationData,
}: SuggestMeetupDialogProps) {
    const [formData, setFormData] = useState({
        suggested_time: "08:00",
        suggested_location: "",
        suggested_reason: "",
    });
    const [isOpen, setIsOpen] = useState(false);

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleLocationChange = (value: string) => {
        setFormData((prev) => ({ ...prev, suggested_location: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSuggest(formData);
        setIsOpen(false);
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="h-12 w-full md:w-40 whitespace-normal text-sm leading-tight">
                    Suggest New Meet Up Time
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Suggest New Meet Up Time</DialogTitle>
                    <DialogDescription>
                        Please provide your suggested time and location for the
                        meet up.
                    </DialogDescription>
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <TimeSelector
                                name="suggested_time"
                                value={formData.suggested_time}
                                onChange={handleSelectChange}
                                label="Suggested Time"
                            />
                            <div>
                                <label htmlFor="suggested_location">
                                    Suggest Location
                                </label>
                                <Select
                                    value={formData.suggested_location}
                                    onValueChange={handleLocationChange}
                                >
                                    <SelectTrigger className="w-full cursor-pointer">
                                        <SelectValue placeholder="Suggest location" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {locationData.success &&
                                        locationData.data?.length > 0 ? (
                                            locationData.data.map(
                                                (location) => (
                                                    <SelectItem
                                                        key={location.id}
                                                        value={
                                                            location.location
                                                        }
                                                    >
                                                        {location.location}
                                                    </SelectItem>
                                                )
                                            )
                                        ) : (
                                            <SelectItem value="" disabled>
                                                No locations available
                                            </SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="mb-4">
                                <label htmlFor="suggested_reason">
                                    Reason for Suggestion
                                </label>
                                <input
                                    onChange={handleTextChange}
                                    value={formData.suggested_reason}
                                    id="suggested_reason"
                                    name="suggested_reason"
                                    className="border border-gray-300 rounded-md p-2 w-full"
                                    placeholder="Enter reason"
                                    type="text"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <Button
                                    variant="outline"
                                    className="cursor-pointer h-12"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    className="h-12 cursor-pointer"
                                    type="submit"
                                    variant="default"
                                    disabled={isSubmitting}
                                >
                                    Suggest New Meet Up
                                </Button>
                            </div>
                        </div>
                    </form>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
