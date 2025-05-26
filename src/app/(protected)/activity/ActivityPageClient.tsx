"use client";
import { useState, useEffect } from "react";
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

const STATUS_MAP = {
    Pending: "1",
    Approved: "2",
    "In Progress": "4",
};

const STATUS_ID_MAP = {
    "1": "Pending",
    "2": "Approved",
    "4": "In Progress",
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
    initialStatusId?: string;
}

export default function ActivityPageClient({
    userBorrowEventData = [],
    initialStatus = "Pending",
    initialStatusId = "1",
}: ActivityPageClientProps) {
    const [status, setStatus] = useState(initialStatus);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

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

    const handleStatusChange = (value: string) => {
        setIsLoading(true);
        setStatus(value);
        const statusId = STATUS_MAP[value as keyof typeof STATUS_MAP];
        const params = new URLSearchParams(searchParams.toString());
        if (statusId) {
            params.set("borrow_status_id", statusId);
        } else {
            params.delete("borrow_status_id");
        }
        router.push(`?${params.toString()}`, { scroll: false });
        setIsLoading(false);
    };

    const handleEventClick = (event: BorrowEventType) => {
        router.push(`/activity/${event.id}`);
    };

    function statusTitle(status: string) {
        switch (status) {
            case "Pending":
                return "Pending Borrow Requests";
            case "Approved":
                return "Approved Borrow Requests";
            case "In Progress":
                return "In Progress Borrow Requests";
            default:
                return "My Activities";
        }
    }

    return (
        <div className="p-8">
            <div className="flex justify-between mb-8">
                <h1 className="text-3xl">My Activities</h1>
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
                            <DropdownMenuRadioItem value="Pending">
                                Pending
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="Approved">
                                Approved
                            </DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="In Progress">
                                In Progress
                            </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>

            <h2 className="text-2xl mb-4">{statusTitle(status)}</h2>

            {isLoading ? (
                <div>
                    <p>Loading...</p>
                </div>
            ) : status === "Pending" ? (
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
                        <p>No pending borrow requests.</p>
                    )}
                </div>
            ) : status === "Approved" || status === "In Progress" ? (
                <div>
                    {borrowerEvents.length > 0 && (
                        <div className="mb-8">
                            <h3>Borrowing Activity</h3>
                            {borrowerEvents.map((borrowEvent) => (
                                <BorrowEvent
                                    onClick={handleEventClick}
                                    key={borrowEvent.id}
                                    event={borrowEvent}
                                />
                            ))}
                        </div>
                    )}
                    {lenderEvents.length > 0 && (
                        <div>
                            <h3>Lending Activity</h3>
                            {lenderEvents.map((borrowEvent) => (
                                <BorrowEvent
                                    onClick={handleEventClick}
                                    key={borrowEvent.id}
                                    event={borrowEvent}
                                />
                            ))}
                        </div>
                    )}
                    {lenderEvents.length === 0 &&
                        borrowerEvents.length === 0 && (
                            <p>No {status.toLowerCase()} borrow requests.</p>
                        )}
                </div>
            ) : null}
        </div>
    );
}
