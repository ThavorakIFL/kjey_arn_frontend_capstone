import React, { useMemo } from "react";

// Define the badge color type
type BadgeColor = 1 | 2 | 3 | 4 | 5;

// Props interface
interface BadgeProps {
    text: string;
    color?: BadgeColor; // Make color optional
}

/**
 * Get a consistent random color for a given string
 * This ensures the same genre always gets the same color
 */
const getConsistentRandomColor = (text: string): BadgeColor => {
    // Create a simple hash from the string
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Get a number between 1 and 5
    const colorNumber = Math.abs(hash % 5) + 1;
    return colorNumber as BadgeColor;
};

const Badge = ({ text, color }: BadgeProps) => {
    // If color is provided, use it; otherwise, generate a random one based on text
    const finalColor = useMemo(() => {
        return color || getConsistentRandomColor(text);
    }, [text, color]);

    const colorClasses = {
        1: "bg-blue-100 text-blue-800",
        2: "bg-green-100 text-green-800",
        3: "bg-red-100 text-red-800",
        4: "bg-yellow-100 text-yellow-800",
        5: "bg-purple-100 text-purple-800",
    };

    return (
        <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[finalColor]}`}
        >
            {text}
        </span>
    );
};

export default Badge;
