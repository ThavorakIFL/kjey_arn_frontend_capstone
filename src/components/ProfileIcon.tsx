"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";

type ProfileIconProps = {
    type?: string;
    imageUrl?: string;
    className?: string;
};

const isValidSrc = (url: string | undefined) => {
    return url?.startsWith("/") || url?.startsWith("http");
};

const ProfileIcon: React.FC<ProfileIconProps> = ({
    type,
    imageUrl,
    className,
}) => {
    const finalSrc =
        type === "database"
            ? `${process.env.NEXT_PUBLIC_IMAGE_PATH}${imageUrl || ""}`
            : imageUrl;

    const safeSrc = isValidSrc(finalSrc) ? finalSrc : "/default-profile.jpg";

    return (
        <div
            className={cn(
                "relative rounded-full overflow-hidden bg-gray-200 aspect-square",
                className
            )}
        >
            <Image
                src={safeSrc || "/default-profile.jpg"}
                alt="User Profile Picture"
                fill
                className="object-cover"
                sizes="(max-width: 640px) 96px, (max-width: 768px) 128px, (max-width: 1024px) 160px, 192px"
                priority
            />
        </div>
    );
};

export default ProfileIcon;
