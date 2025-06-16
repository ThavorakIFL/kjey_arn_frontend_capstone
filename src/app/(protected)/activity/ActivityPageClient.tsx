"use client";
import { useEffect, useState } from "react";
import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
import { useRouter, useSearchParams } from "next/navigation";
import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { Button } from "@/components/ui/button";
import TitleBar from "@/components/TitleBar";

const STATUS_MAP = {
    "All Activities": "0",
    "Pending Request": "1",
    "Accepted by Lender": "2",
    "Borrowing in Progress": "4",
    "Return Confirmation": "7",
    Deposit: "8",
};

interface BorrowEventData {
    lender_borrow_event?: BorrowEventType;
    borrower_borrow_event?: BorrowEventType;
    lender_borrow_events?: BorrowEventType[];
    borrower_borrow_events?: BorrowEventType[];
    [key: string]: any;
}

interface ActivityPageClientProps {
    userBorrowEventData: BorrowEventType[] | BorrowEventData;
    initialStatus?: string;
}

export default function ActivityPageClient({
    userBorrowEventData = [],
    initialStatus = "",
}: ActivityPageClientProps) {
    const searchParams = useSearchParams();
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const [isStatusChanging, setIsStatusChanging] = useState(false);
    const router = useRouter();

    const isDataObject =
        !Array.isArray(userBorrowEventData) &&
        typeof userBorrowEventData === "object";

    const lenderEvents = isDataObject
        ? userBorrowEventData.lender_borrow_events ||
          (userBorrowEventData.lender_borrow_event
              ? [userBorrowEventData.lender_borrow_event]
              : [])
        : [];

    const borrowerEvents = isDataObject
        ? userBorrowEventData.borrower_borrow_events ||
          (userBorrowEventData.borrower_borrow_event
              ? [userBorrowEventData.borrower_borrow_event]
              : [])
        : [];

    console.log("Lender Events:", lenderEvents);

    const handleStatusChange = (value: string) => {
        setIsStatusChanging(true);
        setStatus(value);
        const statusId = STATUS_MAP[value as keyof typeof STATUS_MAP];
        const params = new URLSearchParams(searchParams.toString());
        if (statusId) {
            params.set("borrow_status_id", statusId);
        } else {
            params.delete("borrow_status_id");
        }
        router.push(`?${params.toString()}`, { scroll: false });
        setTimeout(() => {
            setIsStatusChanging(false);
        }, 300);
    };

    const handleEventClick = (event: BorrowEventType) => {
        router.push(`/activity/${event.id}`);
    };

    const showLoadingSpinner = isStatusChanging;

    return (
        <div className="p-8">
            <div className="flex justify-between mb-8">
                <TitleBar title="All Activities" />
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant={"default"}
                            className="bg-white text-black"
                        >
                            {status}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56">
                        <DropdownMenuLabel>Filter by status</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup
                            value={status}
                            onValueChange={handleStatusChange}
                        >
                            {Object.entries(STATUS_MAP).map(
                                ([label, value]) => (
                                    <DropdownMenuRadioItem
                                        key={value}
                                        value={label}
                                    >
                                        {label}
                                    </DropdownMenuRadioItem>
                                )
                            )}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            {showLoadingSpinner && (
                <div className="flex items-center justify-center h-full">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
                </div>
            )}

            {!showLoadingSpinner && status === "All Activities" && (
                <div className="flex flex-col">
                    <div>
                        <h1 className="text-muted-foreground">
                            Borrowing Activity
                        </h1>
                        <div className="my-4">
                            {borrowerEvents.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {borrowerEvents.map((borrowerEvent) => (
                                        <BorrowEvent
                                            onClick={handleEventClick}
                                            key={borrowerEvent.id}
                                            event={borrowerEvent}
                                        />
                                    ))}
                                </div>
                            )}
                            {borrowerEvents.length === 0 && (
                                <div className="w-full h-32 flex items-center justify-center">
                                    <p className="text-center">
                                        No borrowing activity found.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <h1 className="text-muted-foreground">
                            Lending Activity
                        </h1>
                        <div>
                            {lenderEvents.length > 0 && (
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    {lenderEvents.map((lenderEvent) => (
                                        <BorrowEvent
                                            onClick={handleEventClick}
                                            key={lenderEvent.id}
                                            event={lenderEvent}
                                        />
                                    ))}
                                </div>
                            )}
                            {lenderEvents.length === 0 && (
                                <div className="w-full h-32 flex items-center justify-center">
                                    <p>No lending activity found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!showLoadingSpinner && status === "Pending Request" && (
                <div>
                    {Array.isArray(userBorrowEventData) &&
                    userBorrowEventData.length > 0 ? (
                        userBorrowEventData.map((borrowEvent) => (
                            <BorrowEvent
                                onClick={handleEventClick}
                                key={borrowEvent.id}
                                event={borrowEvent}
                            />
                        ))
                    ) : (
                        <div className="w-full h-32 flex items-center justify-center">
                            <p>No pending requests found.</p>
                        </div>
                    )}
                </div>
            )}

            {!showLoadingSpinner &&
                (status === "Accepted by Lender" ||
                    status === "Borrowing in Progress" ||
                    status === "Return Confirmation" ||
                    status === "Deposit") && (
                    <div className="flex flex-col">
                        <div>
                            <h1 className="text-muted-foreground">
                                Borrowing Activity
                            </h1>
                            <div className="my-4">
                                {borrowerEvents.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                        {borrowerEvents.map((borrowerEvent) => (
                                            <BorrowEvent
                                                onClick={handleEventClick}
                                                key={borrowerEvent.id}
                                                event={borrowerEvent}
                                            />
                                        ))}
                                    </div>
                                )}
                                {borrowerEvents.length === 0 && (
                                    <div className="w-full h-32 flex items-center justify-center">
                                        <p className="text-center">
                                            No borrowing activity found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-muted-foreground">
                                Lending Activity
                            </h1>
                            <div className="my-4">
                                {lenderEvents.length > 0 && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ">
                                        {lenderEvents.map((lenderEvent) => (
                                            <BorrowEvent
                                                onClick={handleEventClick}
                                                key={lenderEvent.id}
                                                event={lenderEvent}
                                            />
                                        ))}
                                    </div>
                                )}
                                {lenderEvents.length === 0 && (
                                    <div className="w-full h-32 flex items-center justify-center">
                                        <p className="text-center">
                                            No lending activity found.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
        </div>
    );
}
