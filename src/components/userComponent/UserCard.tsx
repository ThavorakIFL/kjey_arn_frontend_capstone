"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Mail } from "lucide-react";

interface UserCardProps {
    reader: {
        name: string;
        email: string;
        picture: string;
    };
    onClick: () => void;
}

const UserCard: React.FC<UserCardProps> = ({ reader, onClick }) => {
    return (
        <div
            onClick={onClick}
            className="group bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:border-blue-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    onClick();
                }
            }}
            aria-label={`View profile for ${reader.name}`}
        >
            <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                    <Avatar className="h-20 w-20 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300">
                        <AvatarImage
                            src={
                                process.env.NEXT_PUBLIC_IMAGE_PATH +
                                reader.picture
                            }
                            alt={`${reader.name}'s profile picture`}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-100 to-indigo-100 text-blue-700 font-semibold text-lg">
                            {reader.name
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase() || "NA"}
                        </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 rounded-full bg-blue-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>

                <div className="text-center space-y-2 w-full">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200 truncate">
                        {reader.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 group-hover:text-gray-700 transition-colors duration-200">
                        <Mail className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate text-xs">{reader.email}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserCard;
