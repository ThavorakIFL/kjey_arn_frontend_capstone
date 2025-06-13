import React from "react";
import { Icon } from "@iconify/react";
interface GuideMessageProps {}

export function GuideMessage({}: GuideMessageProps) {
    return (
        <div className="w-full h-12 rounded-lg bg-white border-black border-2 flex overflow-clip">
            <div className=" bg-black font-medium text-white px-4 flex h-full items-center justify-center space-x-4">
                <Icon className="h-6 w-6" icon="lucide:lightbulb" />
                <p>Guide Message</p>
            </div>
            <div className="h-auto flex flex-col items-center justify-center px-4">
                <p>Please wait for the lender to confirm meet up details.</p>
            </div>
        </div>
    );
}
