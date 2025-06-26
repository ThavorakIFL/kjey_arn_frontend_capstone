"use client";
import { toast } from "sonner";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { addDays, format, set } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import Badge from "@/components/bookComponent/Badge";
import { Icon } from "@iconify/react";
import { Book as bookType } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useSession } from "next-auth/react";
import StatusIndicator from "@/components/StatusIndicator";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { requestBorrow } from "./book-action";

interface BookPageClientProps {
    book: bookType;
}

const BookPageClient: React.FC<BookPageClientProps> = ({ book }) => {
    const formatDateLocal = (date: Date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const [isBorrow, setIsBorrow] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const [startDate, setStartDate] = useState<Date | undefined>(
        addDays(new Date(), 1)
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        addDays(new Date(), 7)
    );
    const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
    const [isEndDatePickerOpen, setIsEndDatePickerOpen] = useState(false);
    const { data: session } = useSession();
    const router = useRouter();
    const handleBorrowBook = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end dates");
            return;
        }
        try {
            setIsBorrow(true);
            const formData = new FormData();
            formData.append("book_id", String(book.id));
            formData.append("start_date", formatDateLocal(startDate!));
            formData.append("end_date", formatDateLocal(endDate!));
            const response = await requestBorrow(formData);
            if (response.success) {
                toast.success(
                    response.message || "Borrow request submitted successfully!"
                );
                setIsDialogOpen(false);
                router.push("/activity");
            } else {
                toast.error(
                    response.message || "Failed to submit borrow request"
                );
            }
        } catch (error) {
            console.error("Failed to borrow book:", error);
            toast.error(
                error instanceof Error
                    ? error.message
                    : "An unexpected error occurred"
            );
        } finally {
            setIsBorrow(false);
        }
    };
    const [selectImageIndex, setSelectImageIndex] = useState(0);

    const handleStartDateSelect = (date: Date | undefined) => {
        setStartDate(date);
        if (date && endDate && endDate <= date) {
            setEndDate(addDays(date, 7));
        }
    };

    const handleEndDateSelect = (date: Date | undefined) => {
        setEndDate(date);
    };

    useEffect(() => {
        if (book && book.pictures && book.pictures.length > 0) {
        }
    }, [book, selectImageIndex]);
    if (!book) {
        return <div>Loading book details...</div>;
    }

    return (
        <div className="">
            <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
                {/* Mobile Layout */}
                <div className="lg:hidden space-y-6">
                    {/* Main Image */}
                    <div className="bg-white rounded-lg shadow-lg p-4">
                        <div className="flex justify-center">
                            <img
                                className="w-48 sm:w-56 h-auto rounded shadow-lg"
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH +
                                    book.pictures[selectImageIndex].picture
                                }
                                alt={book.title || "Book Image"}
                            />
                        </div>
                    </div>

                    {/* Thumbnail Carousel */}
                    <div className=" p-4 mx-8">
                        <Carousel className="w-full">
                            <CarouselContent>
                                {book.pictures?.map((pictureObject, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-1/4"
                                    >
                                        <div
                                            onClick={() =>
                                                setSelectImageIndex(index)
                                            }
                                            className={`cursor-pointer rounded-lg p-2 ${
                                                selectImageIndex === index
                                                    ? "bg-gray-100 border-2 border-black"
                                                    : "bg-gray-50"
                                            }`}
                                        >
                                            <img
                                                className="w-full aspect-[3/4] object-cover rounded"
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    pictureObject.picture
                                                }
                                                alt=""
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                    {/* Book Info */}
                    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 space-y-6">
                        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                            <div className="flex-1">
                                <h1 className="font-bold text-xl sm:text-2xl">
                                    {book.title}
                                </h1>
                                {book.author && (
                                    <h2 className="text-gray-600 mt-1">
                                        by {book.author}
                                    </h2>
                                )}
                            </div>
                            {session?.userSubId !== book.user?.sub &&
                                book.availability.availability_id === 1 && (
                                    <Button
                                        className="w-full sm:w-auto bg-black hover:bg-gray-800"
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        Borrow Now
                                    </Button>
                                )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-600 font-light mb-2">
                                    Listed By
                                </h3>
                                <Button
                                    onClick={() =>
                                        router.push(
                                            `/user-profile/${book.user?.sub}`
                                        )
                                    }
                                    variant="link"
                                    className="p-0 h-auto"
                                >
                                    {book.user?.name}
                                </Button>
                            </div>
                            <div>
                                <h3 className="text-gray-600 font-light mb-2">
                                    Genre
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {book.genres?.map((genre, index) => (
                                        <Badge
                                            key={index}
                                            text={
                                                typeof genre === "object"
                                                    ? genre.genre
                                                    : genre
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-gray-600 font-light mb-2">
                                    Condition
                                </h3>
                                <Progress value={Number(book.condition)} />
                                <p className="text-right text-sm text-gray-600 mt-1">
                                    {Number(book.condition)}%
                                </p>
                            </div>
                            <div>
                                <h3 className="text-gray-600 font-light mb-2">
                                    Status
                                </h3>
                                <StatusIndicator
                                    isAvailable={
                                        book.availability.availability_id
                                    }
                                />
                            </div>
                        </div>

                        <div>
                            <h3 className="text-gray-600 font-light mb-2">
                                Description
                            </h3>
                            <p className="text-sm sm:text-base">
                                {book.description}
                            </p>
                        </div>

                        {session?.userSubId === book.user?.sub &&
                            book.availability.availability_id === 1 && (
                                <div className="flex justify-end">
                                    <Button
                                        className="bg-gray-800 hover:bg-gray-900"
                                        onClick={() =>
                                            router.push(
                                                `/books/${book.id}/edit`
                                            )
                                        }
                                    >
                                        <Icon
                                            icon="lucide:edit-2"
                                            className="mr-2"
                                        />
                                        Edit
                                    </Button>
                                </div>
                            )}
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden lg:flex gap-6 my-8">
                    {/* Thumbnail Carousel */}
                    <div className="w-24">
                        <Carousel orientation="vertical" className="w-full">
                            <CarouselContent className="h-[50vh]">
                                {book.pictures?.map((pictureObject, index) => (
                                    <CarouselItem
                                        key={index}
                                        className="basis-1/3"
                                    >
                                        <div
                                            onClick={() =>
                                                setSelectImageIndex(index)
                                            }
                                            className={`cursor-pointer rounded-lg p-2 ${
                                                selectImageIndex === index
                                                    ? "bg-white shadow-lg border-2 border-black"
                                                    : "bg-gray-100"
                                            }`}
                                        >
                                            <img
                                                className="w-full aspect-[3/4] object-cover rounded"
                                                src={
                                                    process.env
                                                        .NEXT_PUBLIC_IMAGE_PATH +
                                                    pictureObject.picture
                                                }
                                                alt=""
                                            />
                                        </div>
                                    </CarouselItem>
                                ))}
                            </CarouselContent>
                            <CarouselPrevious />
                            <CarouselNext />
                        </Carousel>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="flex h-full">
                            {/* Main Image */}
                            <div className="w-1/3 bg-gray-50 border-r flex items-center justify-center p-6">
                                <img
                                    className="max-w-full max-h-96 rounded shadow-lg"
                                    src={
                                        process.env.NEXT_PUBLIC_IMAGE_PATH +
                                        book.pictures[selectImageIndex].picture
                                    }
                                    alt={book.title || "Book Image"}
                                />
                            </div>

                            {/* Book Details */}
                            <div className="w-2/3 p-8 space-y-6 overflow-auto">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h1 className="font-bold text-3xl">
                                            {book.title}
                                        </h1>
                                        {book.author && (
                                            <h2 className="text-gray-600 text-lg mt-2">
                                                by {book.author}
                                            </h2>
                                        )}
                                    </div>
                                    {session?.userSubId !== book.user?.sub &&
                                        book.availability.availability_id ===
                                            1 && (
                                            <Button
                                                className="bg-black hover:bg-gray-800 px-6 py-3"
                                                onClick={() =>
                                                    setIsDialogOpen(true)
                                                }
                                            >
                                                Borrow Now
                                            </Button>
                                        )}
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-gray-600 font-light mb-2">
                                            Listed By
                                        </h3>
                                        <HoverCard>
                                            <HoverCardTrigger asChild>
                                                <Button
                                                    onClick={() =>
                                                        router.push(
                                                            `/user-profile/${book.user?.sub}`
                                                        )
                                                    }
                                                    variant="link"
                                                    className="p-0 h-auto"
                                                >
                                                    {book.user?.name}
                                                </Button>
                                            </HoverCardTrigger>
                                            <HoverCardContent className="w-80">
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                (process.env
                                                                    .NEXT_PUBLIC_IMAGE_PATH ||
                                                                    "") +
                                                                (book.user
                                                                    ?.picture ||
                                                                    "")
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            US
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {book.user?.email}
                                                        </h4>
                                                        <p className="text-sm text-gray-500">
                                                            {book.user?.bio}
                                                        </p>
                                                    </div>
                                                </div>
                                            </HoverCardContent>
                                        </HoverCard>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-600 font-light mb-2">
                                            Genre
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {book.genres?.map(
                                                (genre, index) => (
                                                    <Badge
                                                        key={index}
                                                        text={
                                                            typeof genre ===
                                                            "object"
                                                                ? genre.genre
                                                                : genre
                                                        }
                                                    />
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="text-gray-600 font-light mb-2">
                                            Condition
                                        </h3>
                                        <Progress
                                            value={Number(book.condition)}
                                        />
                                        <p className="text-right text-gray-600 mt-1">
                                            {Number(book.condition)}%
                                        </p>
                                    </div>
                                    <div>
                                        <h3 className="text-gray-600 font-light mb-2">
                                            Status
                                        </h3>
                                        <StatusIndicator
                                            isAvailable={
                                                book.availability
                                                    .availability_id
                                            }
                                        />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-gray-600 font-light mb-2">
                                        Description
                                    </h3>
                                    <p>{book.description}</p>
                                </div>

                                {session?.userSubId === book.user?.sub &&
                                    book.availability.availability_id === 1 && (
                                        <div className="flex justify-end">
                                            <Button
                                                className="bg-gray-800 hover:bg-gray-900"
                                                onClick={() =>
                                                    router.push(
                                                        `/books/${book.id}/edit`
                                                    )
                                                }
                                            >
                                                <Icon
                                                    icon="lucide:edit-2"
                                                    className="mr-2"
                                                />
                                                Edit
                                            </Button>
                                        </div>
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Borrow Dialog */}
                <Dialog
                    open={isDialogOpen}
                    onOpenChange={setIsDialogOpen} // Simplified handler
                >
                    <DialogContent className="w-[95vw] max-w-lg sm:max-w-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-lg sm:text-xl">
                                Borrow a book
                            </DialogTitle>
                            <DialogDescription>
                                Select Borrow Period
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-light mb-2">Start Date:</h3>
                                <Popover
                                    open={isStartDatePickerOpen}
                                    onOpenChange={setIsStartDatePickerOpen}
                                    modal={true} // Fix for dialog interaction
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            type="button" // Explicit button type
                                        >
                                            {startDate
                                                ? format(startDate, "LLL dd, y")
                                                : "Select start date"}
                                            <Icon icon="lucide:calendar" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 pointer-events-auto"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={startDate}
                                            onSelect={(date) => {
                                                handleStartDateSelect(date);
                                                setIsStartDatePickerOpen(false);
                                            }}
                                            disabled={(date) =>
                                                date < new Date()
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div>
                                <h3 className="font-light mb-2">End Date:</h3>
                                <Popover
                                    open={isEndDatePickerOpen}
                                    onOpenChange={setIsEndDatePickerOpen}
                                    modal={true}
                                >
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                            type="button" // Explicit button type
                                        >
                                            {endDate
                                                ? format(endDate, "LLL dd, y")
                                                : "Select end date"}
                                            <Icon icon="lucide:calendar" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0 pointer-events-auto"
                                        align="start"
                                        side="bottom"
                                        sideOffset={4}
                                    >
                                        <Calendar
                                            mode="single"
                                            selected={endDate}
                                            onSelect={(date) => {
                                                handleEndDateSelect(date);
                                                setIsEndDatePickerOpen(false);
                                            }}
                                            disabled={(date) =>
                                                date < new Date() ||
                                                !!(
                                                    startDate &&
                                                    date <= startDate
                                                )
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>
                        <DialogFooter className="flex flex-col sm:flex-row gap-4 justify-end">
                            <Button
                                variant="destructive"
                                onClick={() => setIsDialogOpen(false)}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleBorrowBook}
                                disabled={isBorrow}
                                type="button"
                            >
                                {isBorrow ? "Processing..." : "Confirm"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
};
export default BookPageClient;
