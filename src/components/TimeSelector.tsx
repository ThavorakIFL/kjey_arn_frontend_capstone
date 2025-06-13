import React from "react";

interface TimeSelectorProps {
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    label: string;
}

export function TimeSelector({
    name,
    value,
    onChange,
    label,
}: TimeSelectorProps) {
    return (
        <div>
            <label htmlFor={name} className="block text-sm font-medium mb-2">
                {label}
            </label>
            <select
                name={name}
                id={name}
                onChange={onChange}
                value={value}
                className="border border-gray-300 rounded-md p-2 w-full"
            >
                {Array.from({ length: 10 }, (_, i) => {
                    const hour = i + 8;
                    const displayHour = hour > 12 ? hour - 12 : hour;
                    const amPm = hour < 12 ? "AM" : "PM";
                    const optionValue = `${hour
                        .toString()
                        .padStart(2, "0")}:00`;

                    return (
                        <option key={hour} value={optionValue}>
                            {displayHour}:00 {amPm}
                        </option>
                    );
                })}
            </select>
        </div>
    );
}
