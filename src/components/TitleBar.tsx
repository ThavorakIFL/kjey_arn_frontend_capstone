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
                "h-16 flex justify-between  items-center  mb-4",
                className
            )}
        >
            <h1 className="text-xl font-semibold">{title}</h1>
            {onAction ? (
                <Button
                    onClick={onAction}
                    className="bg-indigo-700 cursor-pointer max-w-30 hover:bg-indigo-600"
                >
                    {actionTitle}
                </Button>
            ) : (
                <></>
            )}
        </div>
    );
};

export default TitleBar;
