"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type TitleBarProps = {
    title: string;
    actionTitle?: string;
    onAction?: (() => void) | null;
    className?: string;
};

const TitleBar: React.FC<TitleBarProps> = ({
    title,
    onAction,
    className,
    actionTitle,
}) => {
    return (
        <div
            className={cn(
                " sm:h-16 flex flex-col sm:flex-row justify-between  items-start sm:items-center gap-3 sm:gap-0 mb-4 px-2 sm:px-0 py-2 sm:py-0",
                className
            )}
        >
            <h1 className="  text-xl text-center  sm:text-lg md:text-xl lg:text-2xl font-semibold text-gray-900 leading-tight   ">
                {title}
            </h1>
            {onAction ? (
                <Button
                    onClick={onAction}
                    className="
                        bg-black cursor-pointer 
                        w-full sm:w-auto 
                        min-w-[120px] sm:min-w-[140px]
                        h-10 sm:h-12 lg:h-14 
                        hover:bg-sidebarColor 
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
