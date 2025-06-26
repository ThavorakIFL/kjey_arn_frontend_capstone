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
import {
    Filter,
    Activity,
    BookOpen,
    Users,
    ChevronDown,
    Loader2,
} from "lucide-react";

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
    const [loading, setLoading] = useState(true);
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

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, [userBorrowEventData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading activities...
                    </p>
                </div>
            </div>
        );
    }

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

    const renderEmptyState = (type: "borrowing" | "lending" | "general") => {
        const messages = {
            borrowing: "No borrowing activity found.",
            lending: "No lending activity found.",
            general: "No activities found.",
        };

        return (
            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                <div className="p-6 sm:p-8 lg:p-12 text-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                        <Activity className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-gray-400" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                        {messages[type]}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 max-w-sm mx-auto leading-relaxed">
                        {type === "borrowing" &&
                            "You haven't borrowed any books yet. Start exploring books to request them!"}
                        {type === "lending" &&
                            "You haven't lent any books yet. List your books to start lending!"}
                        {type === "general" &&
                            "No activities match the current filter. Try selecting a different status."}
                    </p>
                </div>
            </div>
        );
    };

    const renderActivitySection = (
        title: string,
        events: BorrowEventType[],
        icon: React.ReactNode,
        type: "borrowing" | "lending"
    ) => {
        return (
            <div className="space-y-4 sm:space-y-6">
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                    <div className="bg-sidebarColor text-white p-3 sm:p-4 lg:p-6">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className="flex-shrink-0">
                                {React.cloneElement(
                                    icon as React.ReactElement<any>,
                                    {
                                        className: "h-5 w-5 sm:h-6 sm:w-6",
                                    }
                                )}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h2 className="text-lg sm:text-xl  font-semibold truncate">
                                    {title}
                                </h2>
                                <p className="text-gray-300 text-xs sm:text-sm mt-1">
                                    {events.length}{" "}
                                    {events.length === 1
                                        ? "activity"
                                        : "activities"}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-3 sm:p-4 lg:p-6">
                        {events.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                {events.map((event) => (
                                    <BorrowEvent
                                        onClick={handleEventClick}
                                        key={event.id}
                                        event={event}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 sm:py-12 text-gray-500">
                                <Activity className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                                <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                    No {type} activity
                                </p>
                                <p className="text-sm sm:text-base text-gray-600">
                                    {type === "borrowing"
                                        ? "You haven't borrowed any books yet"
                                        : "You haven't lent any books yet"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <div>
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <div className=" ">
                        <TitleBar
                            subTitle="Track your borrowing and lending activities"
                            title="All Activities"
                        />
                        {/* Status Filter */}
                        <div className="flex justify-center sm:justify-end">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="bg-white border-gray-300 hover:bg-gray-50 w-full sm:w-auto sm:min-w-48 max-w-xs"
                                        disabled={isStatusChanging}
                                    >
                                        <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                        <span className="truncate">
                                            {status || "All Activities"}
                                        </span>
                                        {isStatusChanging ? (
                                            <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 ml-2 animate-spin flex-shrink-0" />
                                        ) : (
                                            <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-2 flex-shrink-0" />
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent
                                    className="w-56 sm:w-full"
                                    align="start"
                                    sideOffset={5}
                                >
                                    <DropdownMenuLabel className="text-sm font-medium">
                                        Filter by status
                                    </DropdownMenuLabel>
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
                                                    className="text-sm"
                                                >
                                                    {label}
                                                </DropdownMenuRadioItem>
                                            )
                                        )}
                                    </DropdownMenuRadioGroup>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {showLoadingSpinner && (
                    <div className="flex items-center justify-center py-16 sm:py-24">
                        <div className="text-center">
                            <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 animate-spin mx-auto mb-3 sm:mb-4 text-blue-500" />
                            <p className="text-sm sm:text-base text-gray-600">
                                Loading activities...
                            </p>
                        </div>
                    </div>
                )}

                {/* Content */}
                {!showLoadingSpinner && (
                    <div className="space-y-6 sm:space-y-8">
                        {/* All Activities View */}
                        {status === "All Activities" && (
                            <>
                                {renderActivitySection(
                                    "Borrowing Activity",
                                    borrowerEvents,
                                    <BookOpen className="h-6 w-6" />,
                                    "borrowing"
                                )}
                                {renderActivitySection(
                                    "Lending Activity",
                                    lenderEvents,
                                    <Users className="h-6 w-6" />,
                                    "lending"
                                )}
                            </>
                        )}

                        {/* Pending Request View */}
                        {status === "Pending Request" && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                <div className="bg-sidebarColor text-white p-4 sm:p-6">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <Activity className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                                        <div className="min-w-0 flex-1">
                                            <h2 className="text-lg sm:text-xl  font-semibold">
                                                Pending Requests
                                            </h2>
                                            <p className="text-gray-300 text-xs sm:text-sm mt-1">
                                                Requests waiting for response
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {Array.isArray(userBorrowEventData) &&
                                    userBorrowEventData.length > 0 ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                                            {userBorrowEventData.map(
                                                (borrowEvent) => (
                                                    <BorrowEvent
                                                        onClick={
                                                            handleEventClick
                                                        }
                                                        key={borrowEvent.id}
                                                        event={borrowEvent}
                                                    />
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 sm:py-12 text-gray-500">
                                            <Activity className="h-12 w-12 sm:h-16 sm:w-16 mx-auto mb-3 sm:mb-4 text-gray-300" />
                                            <p className="text-base sm:text-lg font-medium text-gray-800 mb-2">
                                                No pending requests
                                            </p>
                                            <p className="text-sm sm:text-base text-gray-600">
                                                All your requests have been
                                                processed
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Other Status Views */}
                        {(status === "Accepted by Lender" ||
                            status === "Borrowing in Progress" ||
                            status === "Return Confirmation" ||
                            status === "Deposit") && (
                            <>
                                {renderActivitySection(
                                    "Borrowing Activity",
                                    borrowerEvents,
                                    <BookOpen className="h-6 w-6" />,
                                    "borrowing"
                                )}
                                {renderActivitySection(
                                    "Lending Activity",
                                    lenderEvents,
                                    <Users className="h-6 w-6" />,
                                    "lending"
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
