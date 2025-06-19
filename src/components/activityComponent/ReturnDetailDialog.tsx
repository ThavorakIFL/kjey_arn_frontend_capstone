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

interface ReturnDetailDialogProps {
    onSubmit: (data: { return_time: string; return_location: string }) => void;
    isSubmitting: boolean;
}

export function ReturnDetailDialog({
    onSubmit,
    isSubmitting,
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
                        <input
                            onChange={handleTextChange}
                            value={formData.return_location}
                            id="return_location"
                            name="return_location"
                            type="text"
                            className="border border-gray-300 rounded-md p-2 w-full"
                            placeholder="Enter location"
                        />
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
