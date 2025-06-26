"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TitleBarProps = {
    title: string;
    subTitle?: string;
    actionTitle?: string;
    onAction?: (() => void) | null;
    className?: string;
};

const TitleBar: React.FC<TitleBarProps> = ({
    title,
    onAction,
    className,
    actionTitle,
    subTitle,
}) => {
    return (
        <div
            className={cn(
                " sm:h-16 flex  sm:flex-row justify-between  items-center sm:items-center gap-3 sm:gap-0 mb-4  sm:px-0 py-2 sm:py-0",
                className
            )}
        >
            <div className="flex flex-col justify-between h-full">
                <h1 className="  text-xl  sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight   ">
                    {title}
                </h1>
                <p className="text-sm text-gray-500 ">{subTitle}</p>
            </div>
            {onAction ? (
                <Button
                    onClick={onAction}
                    className="
                        bg-primaryBlue cursor-pointer 
                        w-32 sm:w-auto 
                        min-w-[120px] sm:min-w-[140px]
                        h-12  lg:h-14 
                        hover:bg-primaryBlue/90 
                        text-sm sm:text-base
                        px-4 sm:px-6
                        flex-shrink-0
                    "
                >
                    {actionTitle}
                </Button>
            ) : null}
        </div>
    );
};

export default TitleBar;
