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
        <div className={cn("rounded-full overflow-hidden", className)}>
            <Image
                layout="responsive"
                width={0}
                height={0}
                src={safeSrc || "/default-profile.jpg"}
                alt="User Profile Picture"
            />
        </div>
    );
};

export default ProfileIcon;
