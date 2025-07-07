// "use client";

// import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
// import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
// import BorrowStatus from "@/components/borrowComponent/BorrowStatus";
// import Link from "next/link";
// import TitleBar from "@/components/TitleBar";
// import Pagination from "@/components/Pagination";
// import { History, Filter } from "lucide-react";
// import { useEffect, useState } from "react";

// interface PaginationData {
//     current_page: number;
//     last_page: number;
//     per_page: number;
//     total: number;
//     from: number | null;
//     to: number | null;
//     has_more_pages: boolean;
// }

// interface HistoryPageClientProps {
//     historyBorrowEventData: BorrowEventType[];
//     pagination: PaginationData;
//     error?: string | null;
//     isLoading?: boolean;
//     currentStatus?: string;
//     onPageChange: (page: number) => void;
//     onStatusFilter: (status: string) => void;
// }

// const statusOptions = [
//     { value: "all", label: "All Status", color: "bg-gray-100 text-gray-800" },
//     { value: "5", label: "Completed", color: "bg-green-100 text-green-800" },
//     { value: "6", label: "Cancelled", color: "bg-yellow-100 text-yellow-800" },
//     { value: "3", label: "Rejected", color: "bg-red-100 text-red-800" },
// ];

// export default function HistoryPageClient({
//     historyBorrowEventData = [],
//     pagination,
//     error = null,
//     isLoading = false,
//     currentStatus = "all",
//     onPageChange,
//     onStatusFilter,
// }: HistoryPageClientProps) {
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             setLoading(false);
//         }, 1000);

//         return () => clearTimeout(timer);
//     }, [historyBorrowEventData]);

//     const handleStatusChange = (status: string) => {
//         onStatusFilter(status);
//     };

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center min-h-screen px-4">
//                 <div className="text-center">
//                     <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
//                     <p className="text-sm sm:text-base text-gray-600">
//                         Loading your history...
//                     </p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div>
//             <div className="">
//                 {/* Header Section */}
//                 <div className="mb-6 sm:mb-8">
//                     <TitleBar
//                         title="All History"
//                         subTitle=" View all your past borrowing activities"
//                     />

//                     {/* Status Filter */}
//                     <div className="mb-6 bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 mx-2 sm:mx-0">
//                         <div className="flex items-center gap-3 mb-4">
//                             <Filter className="h-5 w-5 text-gray-600" />
//                             <h3 className="text-sm font-medium text-gray-900">
//                                 Filter by Status
//                             </h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                             {statusOptions.map((option) => (
//                                 <button
//                                     key={option.value}
//                                     onClick={() =>
//                                         handleStatusChange(option.value)
//                                     }
//                                     disabled={isLoading}
//                                     className={`px-3 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
//                                         currentStatus === option.value
//                                             ? `${option.color} ring-2 ring-blue-500 ring-opacity-50`
//                                             : `${option.color} hover:ring-2 hover:ring-gray-300 opacity-70 hover:opacity-100`
//                                     } ${
//                                         isLoading
//                                             ? "cursor-not-allowed opacity-50"
//                                             : "cursor-pointer"
//                                     }`}
//                                 >
//                                     {option.label}
//                                 </button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Loading State */}
//                     {isLoading && (
//                         <div className="flex justify-center items-center py-8 sm:py-12">
//                             <div className="text-center">
//                                 <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
//                                 <div className="text-sm sm:text-base text-gray-600">
//                                     Loading your history...
//                                 </div>
//                             </div>
//                         </div>
//                     )}

//                     {/* Error State */}
//                     {error && (
//                         <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
//                             <div className="text-red-800 font-medium text-sm sm:text-base">
//                                 Unable to load history
//                             </div>
//                             <div className="text-red-600 text-xs sm:text-sm mt-1 break-words">
//                                 {error}
//                             </div>
//                         </div>
//                     )}

//                     {/* Empty State */}
//                     {!isLoading &&
//                         !error &&
//                         historyBorrowEventData.length === 0 && (
//                             <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
//                                 <div className="flex flex-col items-center justify-center py-12  text-center px-4 sm:px-6">
//                                     <div className="text-gray-400 mb-4 sm:mb-6 bg-gray-100 rounded-full h-24 w-24  flex items-center justify-between">
//                                         <svg
//                                             className="w-12 h-12 sm:w-16 sm:h-16 lg:w-14 lg:h-14 mx-auto"
//                                             fill="none"
//                                             stroke="currentColor"
//                                             viewBox="0 0 24 24"
//                                         >
//                                             <path
//                                                 strokeLinecap="round"
//                                                 strokeLinejoin="round"
//                                                 strokeWidth={1.5}
//                                                 d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
//                                             />
//                                         </svg>
//                                     </div>
//                                     <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
//                                         {currentStatus === "all"
//                                             ? "No borrowing history yet"
//                                             : `No ${statusOptions
//                                                   .find(
//                                                       (s) =>
//                                                           s.value ===
//                                                           currentStatus
//                                                   )
//                                                   ?.label.toLowerCase()} history found`}
//                                     </h3>
//                                     <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed">
//                                         {currentStatus === "all"
//                                             ? "Once you start borrowing items, your history will appear here. You'll be able to track all your past and current borrowing activities."
//                                             : `No borrowing events with ${statusOptions
//                                                   .find(
//                                                       (s) =>
//                                                           s.value ===
//                                                           currentStatus
//                                                   )
//                                                   ?.label.toLowerCase()} status found. Try selecting a different status filter.`}
//                                     </p>
//                                 </div>
//                             </div>
//                         )}

//                     {/* History Content */}
//                     {!isLoading &&
//                         !error &&
//                         historyBorrowEventData.length > 0 && (
//                             <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
//                                 {/* Header */}
//                                 <div className="bg-sidebarColor text-white p-4 sm:p-6 space-y-3 sm:space-y-4">
//                                     <div className="flex items-center gap-2 sm:gap-3">
//                                         <History className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
//                                         <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
//                                             All Borrowing Histories
//                                         </h2>
//                                     </div>
//                                     <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
//                                         <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
//                                             These are borrowing requests that
//                                             you have made or received.
//                                         </p>
//                                         <div className="text-gray-300 text-xs sm:text-sm">
//                                             Showing {pagination.from || 0} -{" "}
//                                             {pagination.to || 0} of{" "}
//                                             {pagination.total} results
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Grid Content */}
//                                 <div className="p-3 sm:p-4 lg:p-6">
//                                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-3 sm:gap-4 lg:gap-6">
//                                         {historyBorrowEventData.map((event) => (
//                                             <Link
//                                                 href={`/history/${event.id}`}
//                                                 key={event.id}
//                                                 className="block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
//                                             >
//                                                 <BorrowEvent event={event} />
//                                             </Link>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* Pagination */}
//                                 <div className="px-3 sm:px-4 lg:px-6 pb-4 lg:pb-6">
//                                     <Pagination
//                                         pagination={pagination}
//                                         onPageChange={onPageChange}
//                                         loading={isLoading}
//                                     />
//                                 </div>
//                             </div>
//                         )}
//                 </div>
//             </div>
//         </div>
//     );
// }

"use client";

import { BorrowEvent as BorrowEventType } from "@/types/borrow-event";
import BorrowEvent from "@/components/borrowComponent/BorrowEvent";
import BorrowStatus from "@/components/borrowComponent/BorrowStatus";
import Link from "next/link";
import TitleBar from "@/components/TitleBar";
import Pagination from "@/components/Pagination";
import { History, Filter, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuRadioGroup,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface PaginationData {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    has_more_pages: boolean;
}

interface HistoryPageClientProps {
    historyBorrowEventData: BorrowEventType[];
    pagination: PaginationData;
    error?: string | null;
    isLoading?: boolean;
    currentStatus?: string;
    onPageChange: (page: number) => void;
    onStatusFilter: (status: string) => void;
}

const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "5", label: "Completed" },
    { value: "6", label: "Cancelled" },
    { value: "3", label: "Rejected" },
];

export default function HistoryPageClient({
    historyBorrowEventData = [],
    pagination,
    error = null,
    isLoading = false,
    currentStatus = "all",
    onPageChange,
    onStatusFilter,
}: HistoryPageClientProps) {
    const [loading, setLoading] = useState(true);
    const [isStatusChanging, setIsStatusChanging] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 1000);

        return () => clearTimeout(timer);
    }, [historyBorrowEventData]);

    const handleStatusChange = (value: string) => {
        setIsStatusChanging(true);
        onStatusFilter(value);
        setTimeout(() => {
            setIsStatusChanging(false);
        }, 300);
    };

    const getCurrentStatusLabel = () => {
        const option = statusOptions.find((opt) => opt.value === currentStatus);
        return option ? option.label : "All Status";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen px-4">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-sm sm:text-base text-gray-600">
                        Loading your history...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="">
                {/* Header Section */}
                <div className="mb-6 sm:mb-8">
                    <TitleBar
                        title="All History"
                        subTitle=" View all your past borrowing activities"
                    />

                    {/* Status Filter */}
                    <div className="mb-6 flex justify-center sm:justify-end">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    className="bg-white border-gray-300 hover:bg-gray-50 w-full sm:w-auto sm:min-w-48 max-w-xs"
                                    disabled={isLoading || isStatusChanging}
                                >
                                    <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2 flex-shrink-0" />
                                    <span className="truncate">
                                        {getCurrentStatusLabel()}
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
                                    value={getCurrentStatusLabel()}
                                    onValueChange={(label) => {
                                        const option = statusOptions.find(
                                            (opt) => opt.label === label
                                        );
                                        if (option) {
                                            handleStatusChange(option.value);
                                        }
                                    }}
                                >
                                    {statusOptions.map((option) => (
                                        <DropdownMenuRadioItem
                                            key={option.value}
                                            value={option.label}
                                            className="text-sm"
                                        >
                                            {option.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>

                    {/* Loading State */}
                    {(isLoading || isStatusChanging) && (
                        <div className="flex justify-center items-center py-8 sm:py-12">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-500 mx-auto mb-3 sm:mb-4"></div>
                                <div className="text-sm sm:text-base text-gray-600">
                                    Loading your history...
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 mx-2 sm:mx-0">
                            <div className="text-red-800 font-medium text-sm sm:text-base">
                                Unable to load history
                            </div>
                            <div className="text-red-600 text-xs sm:text-sm mt-1 break-words">
                                {error}
                            </div>
                        </div>
                    )}

                    {/* Empty State */}
                    {!isLoading &&
                        !isStatusChanging &&
                        !error &&
                        historyBorrowEventData.length === 0 && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                <div className="flex flex-col items-center justify-center py-12  text-center px-4 sm:px-6">
                                    <div className="text-gray-400 mb-4 sm:mb-6 bg-gray-100 rounded-full h-24 w-24  flex items-center justify-between">
                                        <svg
                                            className="w-12 h-12 sm:w-16 sm:h-16 lg:w-14 lg:h-14 mx-auto"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1.5}
                                                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                            />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2 sm:mb-3">
                                        {currentStatus === "all"
                                            ? "No borrowing history yet"
                                            : `No ${statusOptions
                                                  .find(
                                                      (s) =>
                                                          s.value ===
                                                          currentStatus
                                                  )
                                                  ?.label.toLowerCase()} history found`}
                                    </h3>
                                    <p className="text-sm sm:text-base text-gray-600 max-w-sm sm:max-w-md lg:max-w-lg leading-relaxed">
                                        {currentStatus === "all"
                                            ? "Once you start borrowing items, your history will appear here. You'll be able to track all your past and current borrowing activities."
                                            : `No borrowing events with ${statusOptions
                                                  .find(
                                                      (s) =>
                                                          s.value ===
                                                          currentStatus
                                                  )
                                                  ?.label.toLowerCase()} status found. Try selecting a different status filter.`}
                                    </p>
                                </div>
                            </div>
                        )}

                    {/* History Content */}
                    {!isLoading &&
                        !isStatusChanging &&
                        !error &&
                        historyBorrowEventData.length > 0 && (
                            <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-gray-200 overflow-hidden mx-2 sm:mx-0">
                                {/* Header */}
                                <div className="bg-sidebarColor text-white p-4 sm:p-6 space-y-3 sm:space-y-4">
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <History className="h-5 w-5 sm:h-6 sm:w-6 flex-shrink-0" />
                                        <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold">
                                            All Borrowing Histories
                                        </h2>
                                    </div>
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                                        <p className="text-gray-300 text-xs sm:text-sm leading-relaxed">
                                            These are borrowing requests that
                                            you have made or received.
                                        </p>
                                        <div className="text-gray-300 text-xs sm:text-sm">
                                            Showing {pagination.from || 0} -{" "}
                                            {pagination.to || 0} of{" "}
                                            {pagination.total} results
                                        </div>
                                    </div>
                                </div>

                                {/* Grid Content */}
                                <div className="p-3 sm:p-4 lg:p-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-3 sm:gap-4 lg:gap-6">
                                        {historyBorrowEventData.map((event) => (
                                            <Link
                                                href={`/history/${event.id}`}
                                                key={event.id}
                                                className="block transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                            >
                                                <BorrowEvent event={event} />
                                            </Link>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="px-3 sm:px-4 lg:px-6 pb-4 lg:pb-6">
                                    <Pagination
                                        pagination={pagination}
                                        onPageChange={onPageChange}
                                        loading={isLoading}
                                    />
                                </div>
                            </div>
                        )}
                </div>
            </div>
        </div>
    );
}
