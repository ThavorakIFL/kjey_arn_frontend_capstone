"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface MeetupFormProps {
    onSubmit: (formData: {
        final_time: string;
        final_location: string;
    }) => void;
    isSubmitting: boolean;
}

export function MeetupForm({ onSubmit, isSubmitting }: MeetupFormProps) {
    const [formData, setFormData] = useState({
        final_time: "08:00",
        final_location: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
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

    return (
        <form id="meetupForm" onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
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
                                    {displayHour}
                                    :00 {amPm}
                                </option>
                            );
                        })}
                    </select>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="meetUpLocation">Meet Up Location</label>
                    <input
                        value={formData.final_location}
                        name="final_location"
                        className="border border-gray-300 rounded-md p-2 w-full"
                        id="meetUpLocation"
                        onChange={handleTextChange}
                        type="text"
                    />
                </div>
            </div>
        </form>
    );
}
