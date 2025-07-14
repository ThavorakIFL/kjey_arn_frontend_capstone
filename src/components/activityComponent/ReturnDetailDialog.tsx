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
import { MapPin } from "lucide-react";

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
                        label="Return Time"
                    />

                    <div>
                        <label
                            htmlFor="return_location"
                            className="text-gray-700 flex items-center gap-2 text-sm font-semibold mb-2 "
                        >
                            <MapPin className="h-4 w-4" />
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
                            <SelectTrigger className="w-full cursor-pointer">
                                <SelectValue placeholder="Select return location" />
                            </SelectTrigger>
                            <SelectContent>
                                {locationData.success &&
                                locationData.data?.length > 0 ? (
                                    locationData.data.map((location) => (
                                        <SelectItem
                                            className="cursor-pointer"
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
                            className="h-12 cursor-pointer"
                            variant={"outline"}
                            onClick={() => setIsOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="h-12 cursor-pointer"
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
