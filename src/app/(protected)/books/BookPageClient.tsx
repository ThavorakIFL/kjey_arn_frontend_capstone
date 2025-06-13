"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { addDays, format, set } from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
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
import { CalculatorIcon } from "lucide-react";

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
    const [startDate, setStartDate] = useState<Date | undefined>(
        addDays(new Date(), 1)
    );
    const [endDate, setEndDate] = useState<Date | undefined>(
        addDays(new Date(), 7)
    );
    const { data: session } = useSession();
    const router = useRouter();
    const handleBorrowBook = async () => {
        if (!startDate || !endDate) {
            console.error("Please select both start and end dates");
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
            alert("Book borrow request submitted successfully!");
            router.push("/activity");
        } catch (error) {
            setIsBorrow(false);
            console.error("Failed to borrow book:", error);
            alert(
                `Failed to request book: ${
                    error instanceof Error ? error.message : "Unknown error"
                }`
            );
        }
    };
    const [selectImageIndex, setSelectImageIndex] = useState(0);
    useEffect(() => {
        if (book && book.pictures && book.pictures.length > 0) {
        }
    }, [book, selectImageIndex]);
    if (!book) {
        return <div>Loading book details...</div>;
    }
    return (
        <div>
            <div className="p-6 flex">
                <div className="w-1/10 my-10">
                    <Carousel
                        opts={{
                            align: "start",
                        }}
                        orientation="vertical"
                        className="w-full"
                    >
                        <CarouselContent className=" h-[55vh]">
                            {book.pictures?.map((pictureObject, index) => (
                                <CarouselItem key={index} className="basis-1/3">
                                    <div
                                        onClick={() =>
                                            setSelectImageIndex(index)
                                        }
                                        key={index}
                                        className={`bg-white cursor-pointer shadow-md rounded-lg w-30 h-38 flex items-center justify-between transform transition-all duration-300 ease-in-out ${
                                            selectImageIndex === index
                                                ? "scale-100 shadow-2xl border-black border-2"
                                                : "scale-90"
                                        }`}
                                    >
                                        <img
                                            className="object-contain w-2/3 mx-auto"
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
                        <CarouselPrevious className=" cursor-pointer left-15 -top-8" />
                        <CarouselNext className=" cursor-pointer left-15 -bottom-8" />
                    </Carousel>
                </div>
                <div className="flex rounded-lg overflow-hidden shadow-md w-9/10">
                    <div className=" w-1/5 grid place-content-center py-6 bg-gray-50 border-r ">
                        <div className=" rounded flex justify-center shadow-lg overflow-hidden w-56">
                            <img
                                style={{ transitionDelay: "0.3s" }}
                                className=" w-full h-auto transition-all duration-500 ease-in-out transform"
                                src={
                                    process.env.NEXT_PUBLIC_IMAGE_PATH +
                                    book.pictures[selectImageIndex].picture
                                }
                                alt={book.title || "Book Image"}
                            />
                        </div>
                    </div>
                    <div className="w-4/5 overflow-auto col-span-2 bg-white shadow-md p-8  flex flex-col space-y-6">
                        <div className="flex">
                            <div className="flex flex-col space-y-2">
                                <h1 className="font-bold text-2xl">
                                    {book.title}
                                </h1>
                                {book.author ? (
                                    <h2 className="text-gray-600 text-light">
                                        by {book.author}
                                    </h2>
                                ) : (
                                    <></>
                                )}
                            </div>
                            {session?.userSubId !== book.user?.sub &&
                                book.availability.availability_id === 1 && (
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button className="cursor-pointer rounded-sm p-6 bg-black  hover:sidebarColor text-white font-bold ml-auto">
                                                <p className="font-light">
                                                    Borrow Now
                                                </p>
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="w-[1000px]">
                                            <DialogHeader className="">
                                                <DialogTitle>
                                                    Borrow {book.title} by{" "}
                                                    {book.author}
                                                </DialogTitle>
                                                <DialogDescription>
                                                    Select Borrow Period
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="flex flex-col space-y-4">
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex flex-col">
                                                            <h1 className="font-light ">
                                                                Start Date:
                                                            </h1>
                                                            <Button
                                                                id="date"
                                                                variant="outline"
                                                                className="justify-between"
                                                            >
                                                                {startDate ? (
                                                                    <>
                                                                        {" "}
                                                                        {format(
                                                                            startDate,
                                                                            "LLL dd, y"
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    "Select a start date"
                                                                )}
                                                                <Icon
                                                                    icon="lucide:calendar"
                                                                    width="24"
                                                                    height="24"
                                                                />
                                                            </Button>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0 pointer-events-auto"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            initialFocus
                                                            mode="single"
                                                            defaultMonth={
                                                                startDate
                                                            }
                                                            selected={startDate}
                                                            onSelect={
                                                                setStartDate
                                                            }
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                                <Popover>
                                                    <PopoverTrigger asChild>
                                                        <div className="flex flex-col">
                                                            <h1 className="font-light ">
                                                                End Date:
                                                            </h1>
                                                            <Button
                                                                id="date"
                                                                variant="outline"
                                                                className="justify-between"
                                                            >
                                                                {endDate ? (
                                                                    <>
                                                                        {" "}
                                                                        {format(
                                                                            endDate,
                                                                            "LLL dd, y"
                                                                        )}
                                                                    </>
                                                                ) : (
                                                                    "Select a start date"
                                                                )}
                                                                <Icon
                                                                    icon="lucide:calendar"
                                                                    width="24"
                                                                    height="24"
                                                                />
                                                            </Button>
                                                        </div>
                                                    </PopoverTrigger>
                                                    <PopoverContent
                                                        className="w-auto p-0 pointer-events-auto"
                                                        align="start"
                                                    >
                                                        <Calendar
                                                            initialFocus
                                                            mode="single"
                                                            defaultMonth={
                                                                endDate
                                                            }
                                                            selected={endDate}
                                                            onSelect={
                                                                setEndDate
                                                            }
                                                        />
                                                    </PopoverContent>
                                                </Popover>
                                            </div>
                                            <div className="flex space-x-4 justify-end ">
                                                <Button variant={"destructive"}>
                                                    Cancel
                                                </Button>
                                                <Button
                                                    className="cursor-pointer"
                                                    onClick={() =>
                                                        handleBorrowBook()
                                                    }
                                                >
                                                    Confirm
                                                </Button>
                                            </div>
                                        </DialogContent>
                                    </Dialog>
                                )}
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                                <h1 className="text-gray-600 font-light">
                                    Listed By
                                </h1>

                                <HoverCard>
                                    <HoverCardTrigger asChild>
                                        <Button
                                            onClick={() => {
                                                router.push(
                                                    `/user-profile/${book.user?.sub}`
                                                );
                                            }}
                                            className="p-0 flex justify-start focus:outline-none cursor-pointer"
                                            variant="link"
                                        >
                                            {book.user?.name}
                                        </Button>
                                    </HoverCardTrigger>
                                    <HoverCardContent className="w-80">
                                        <div className="grid grid-cols-6 space-x-4 ">
                                            <Avatar className="col-span-1 cursor-pointer">
                                                <AvatarImage
                                                    onClick={() => {
                                                        router.push(
                                                            `/user-profile/${book.user?.sub}`
                                                        );
                                                    }}
                                                    src={
                                                        process.env
                                                            .NEXT_PUBLIC_IMAGE_PATH +
                                                        book.user?.picture!
                                                    }
                                                />
                                                <AvatarFallback>
                                                    US
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="space-y-1 col-span-5">
                                                <h4 className="text-sm font-semibold">
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
                            <div className="flex flex-col space-y-2">
                                <h1 className="text-gray-600 font-light ">
                                    Genre
                                </h1>
                                <div className="flex flex-wrap gap-2">
                                    {book.genres && book.genres.length > 0 ? (
                                        book.genres.map((genre, index) => (
                                            <Badge
                                                key={index}
                                                text={
                                                    typeof genre === "object"
                                                        ? genre.genre ||
                                                          JSON.stringify(genre)
                                                        : genre
                                                }
                                                color={
                                                    genre.id
                                                        ? ((genre.id <= 5
                                                              ? genre.id
                                                              : ((genre.id -
                                                                    1) %
                                                                    5) +
                                                                1) as any)
                                                        : undefined
                                                }
                                            />
                                        ))
                                    ) : (
                                        <span className="text-gray-500">
                                            No genres specified
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-gray-600 font-light">
                                    Condition
                                </h2>
                                <Progress value={Number(book.condition)} />
                                <h2 className="text-gray-600 font-light text-end">
                                    {Number(book.condition)}%
                                </h2>
                            </div>
                            <div className="flex flex-col space-y-2">
                                <h2 className="text-gray-600 font-light">
                                    Status
                                </h2>
                                <div>
                                    <StatusIndicator
                                        isAvailable={
                                            book.availability.availability_id
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                            <h2 className="text-gray-600 font-light">
                                Description
                            </h2>
                            <p className="">{book.description}</p>
                        </div>
                        <div className="flex flex-grow justify-end items-end mt-4">
                            {session?.userSubId === book.user?.sub &&
                                book.availability.availability_id === 1 && (
                                    <Button
                                        className="flex items-center px-4 py-4 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition cursor-pointer"
                                        onClick={() => {
                                            router.push(
                                                `/books/${book.id}/edit`
                                            );
                                        }}
                                    >
                                        <Icon icon={"lucide:edit-2"} />
                                        Edit
                                    </Button>
                                )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default BookPageClient;
