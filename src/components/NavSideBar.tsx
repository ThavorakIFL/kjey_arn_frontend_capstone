"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ActivityBell from "./activityComponent/ActivityBell";

export default function NavSideBar({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showChevron, setShowChevron] = useState(false); // Start as false to prevent flicker
    const [isClient, setIsClient] = useState(false); // Track if we're on client

    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const sidebarWidth = "w-[14.28%]";
    const { data: session, status } = useSession(); // Get status to know loading state
    const router = useRouter();

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    // Handle client-side mounting
    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        let timer: string | number | NodeJS.Timeout | undefined;
        if (sidebarOpen) {
            setShowChevron(false);
        } else {
            timer = setTimeout(() => {
                setShowChevron(true);
            }, 300);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [sidebarOpen]);

    const pathname = usePathname();
    const buttonList = [
        {
            title: "My Profile",
            route: `/my-profile`,
            icon: "lucide:user",
        },
        {
            title: "Borrow Requests",
            route: "/borrow-request",
            icon: "lucide:book",
        },
        {
            title: "My Activities",
            route: "/activity",
            icon: "lucide:book-up",
        },
        {
            title: "My History",
            route: "/history",
            icon: "lucide:clock",
        },
    ];

    // Don't render until we're on the client to prevent hydration issues
    if (!isClient) {
        return null;
    }

    return (
        <>
            <div className="grid grid-cols-7  relative">
                <div
                    style={{
                        transform: sidebarOpen
                            ? "translateX(0)"
                            : "translateX(-100%)",
                    }}
                    className={` fixed h-screen col-span-2 ${sidebarWidth} transition-transform duration-300 ease-out`}
                >
                    <div className="">
                        <div className=" bg-sidebarColor flex flex-col items-center h-screen  relative">
                            <div className="w-full px-8 h-[80px] flex items-center justify-between">
                                <h1
                                    onClick={() => handleNavigation("/home")}
                                    className="  cursor-pointer text-2xl font-bold text-white "
                                >
                                    KjeyArn
                                </h1>
                                <div
                                    onClick={toggleSideBar}
                                    className="container flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-sideColor transition-all duration-300 cursor-pointer "
                                >
                                    <Icon
                                        icon={
                                            sidebarOpen
                                                ? "ic:baseline-menu"
                                                : "ic:baseline-menu-open"
                                        }
                                        width="28"
                                        height="28"
                                        className="cursor-pointer text-white"
                                    />
                                </div>
                            </div>
                            <Separator className="w-full bg-sidebarColorLine" />
                            <div className="w-full flex flex-col  space-y-2 py-8">
                                {buttonList.map((button) => (
                                    <div
                                        onClick={() =>
                                            handleNavigation(button.route)
                                        }
                                        key={button.title}
                                        className={`
                                            transition-all duration-300 border-l-4 h-11 flex items-center space-x-4 cursor-pointer px-6
                                             hover:bg-sideColor 
                                            ${
                                                pathname === button.route
                                                    ? "border-white bg-sideColor"
                                                    : "border-transparent"
                                            }`}
                                    >
                                        <div>
                                            <Icon
                                                className="text-white"
                                                fontSize={18}
                                                icon={button.icon}
                                            />
                                        </div>
                                        <p
                                            className={`font-light ${
                                                pathname === button.route
                                                    ? "text-white font-medium"
                                                    : "text-white"
                                            }`}
                                        >
                                            {button.title}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navbar */}
                <div
                    className={`${
                        sidebarOpen ? "col-start-2 col-span-8" : " col-span-12"
                    }   h-screen transition-transform duration-300 ease-in-out`}
                >
                    <div className="sticky">
                        <div className="h-auto shadow-sm  bg-white px-8 flex flex-col space-y-8 py-4">
                            <div className="flex justify-between items-center h-full">
                                <div className="flex items-center space-x-4">
                                    {!sidebarOpen && showChevron && (
                                        <div
                                            onClick={toggleSideBar}
                                            className="cursor-pointer  rounded-full  transition-all duration-300"
                                        >
                                            <Icon
                                                icon="ic:baseline-menu"
                                                width="28"
                                                height="28"
                                                className="cursor-pointer text-black"
                                            />
                                        </div>
                                    )}
                                    <p className="text-xl font-normal">
                                        Paragon International University
                                    </p>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div
                                        onClick={() => {
                                            router.push("/shelf");
                                        }}
                                        className="cursor-pointer container flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-gray-200 transition-all duration-300"
                                    >
                                        <Icon
                                            icon="lucide:library"
                                            width="24"
                                            height="24"
                                        />
                                    </div>

                                    <div className="z-50 container flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-gray-200 transition-all duration-300 cursor-pointer ">
                                        <ActivityBell />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="cursor-pointer w-12 h-12 rounded-3xl bg-gray-200 hover:bg-gray-300 overflow-hidden">
                                                {status === "loading" ? (
                                                    // Show skeleton while loading
                                                    <div className="w-full h-full bg-gray-300 animate-pulse rounded-full" />
                                                ) : (
                                                    <Image
                                                        width={48}
                                                        height={48}
                                                        src={
                                                            session?.user
                                                                ?.image ||
                                                            "https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
                                                        }
                                                        className="rounded-full w-full h-full object-cover"
                                                        alt="Profile"
                                                        onError={(e) => {
                                                            // Fallback if image fails to load
                                                            e.currentTarget.src =
                                                                "https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg";
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent
                                            onClick={() => {
                                                signOut({
                                                    callbackUrl: "/",
                                                });
                                            }}
                                            className="cursor-pointer w-auto h-auto bg-red-500 px-4 py-2 text-center rounded-lg"
                                        >
                                            <div className="text-white ">
                                                Logout
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                    <p className="text-xl">
                                        {status === "loading" ? (
                                            <span className="inline-block w-20 h-6 bg-gray-300 animate-pulse rounded" />
                                        ) : (
                                            session?.user?.name || "Guest"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>{children}</div>
                </div>
            </div>
        </>
    );
}
