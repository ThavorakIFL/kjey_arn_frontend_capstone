import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { TimeSelector } from "../TimeSelector";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

interface ReturnDetailDialogProps {
    onSubmit: (data: { return_time: string; return_location: string }) => void;
    isSubmitting: boolean;
    locationData: {
        success: boolean;
        message: string;
        data: any[];
    };
}

export function ReturnDetailDialog({
    onSubmit,
    isSubmitting,
    locationData,
}: ReturnDetailDialogProps) {
    const [formData, setFormData] = useState({
        return_time: "08:00",
        return_location: "",
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

    const handleSubmit = () => {
        onSubmit(formData);
        setIsOpen(false);
    };
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full md:w-40 h-12 cursor-pointer whitespace-normal text-sm leading-tight">
                    Confirm Received Book
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Set Meet Up Details</DialogTitle>
                    <DialogDescription>
                        Please set up the meet up time and location
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                    <TimeSelector
                        name="return_time"
                        value={formData.return_time}
                        onChange={handleSelectChange}
                        label="Return Time:"
                    />

                    <div>
                        <label
                            htmlFor="return_location"
                            className="block text-sm font-medium mb-2"
                        >
                            Return Location
                        </label>
                        <Select
                            value={formData.return_location}
                            onValueChange={(value) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    return_location: value,
                                }))
                            }
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select return location" />
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
                    <div className="flex justify-end space-x-4">
                        <Button
                            className="h-12"
                            variant={"outline"}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="h-12"
                            type="button"
                            variant="default"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            Set Return Detail
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
