"use client";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import Image from "next/image";

export default function NavSideBar({
    children,
}: {
    children: React.ReactNode;
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [showChevron, setShowChevron] = useState(!sidebarOpen);
    const toggleSideBar = () => {
        setSidebarOpen(!sidebarOpen);
    };
    const sidebarWidth = "w-[14.28%]";
    const { data: session } = useSession();
    const router = useRouter();

    const handleNavigation = (route: string) => {
        router.push(route);
    };

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

    return (
        <>
            <div className="grid grid-cols-7 space-x-4 relative">
                {!sidebarOpen && showChevron && (
                    <div
                        onClick={toggleSideBar}
                        className="cursor-pointer hover:bg-indigo-400 bg-indigo-500 rounded-full p-1 absolute left-3 z-10 top-1/2 transition-all duration-300"
                    >
                        <Icon
                            color="white"
                            icon="lucide:chevron-right"
                            width="30"
                            height="30"
                        />
                    </div>
                )}

                <div
                    style={{
                        transform: sidebarOpen
                            ? "translateX(0)"
                            : "translateX(-88%)",
                    }}
                    className={`left-0 top-0 fixed h-screen col-span-2 ${sidebarWidth} transition-transform duration-300 ease-out`}
                >
                    <div className="">
                        <div className=" bg-sidebarColor flex flex-col items-center h-screen  relative">
                            <div className="w-full px-8 py-6 flex items-center justify-between">
                                <h1
                                    onClick={() => handleNavigation("/home")}
                                    className="  cursor-pointer text-2xl font-bold text-white "
                                >
                                    KjeyArn
                                </h1>
                                <div
                                    onClick={toggleSideBar}
                                    className="container flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-indigo-900 transition-all duration-300 cursor-pointer "
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
                                             hover:bg-indigo-900 
                                            ${
                                                pathname === button.route
                                                    ? "border-white bg-indigo-900"
                                                    : "border-transparent"
                                            }`}
                                    >
                                        <div>
                                            <Icon
                                                className={`${
                                                    pathname === button.route
                                                        ? "text-white"
                                                        : "text-indigo-300"
                                                }`}
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
                        sidebarOpen
                            ? "col-start-2 col-span-8"
                            : "col-start-1 col-span-12 ml-8"
                    }   h-screen transition-transform duration-300 ease-in-out`}
                >
                    <div className="sticky">
                        <div className="h-auto shadow-sm  bg-white px-8 flex flex-col space-y-8 py-4">
                            <div className="flex justify-between items-center h-full">
                                <div className="flex items-center space-x-4">
                                    <p className="text-xl font-normal">
                                        Paragon Internatioanl University
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

                                    <div
                                        onClick={() => {
                                            router.push("/shelf");
                                        }}
                                        className="container flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-gray-200 transition-all duration-300 cursor-pointer "
                                    >
                                        <Icon
                                            icon="lucide:bell"
                                            width="24"
                                            height="24"
                                        />
                                    </div>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="cursor-pointer w-12 h-12 rounded-3xl bg-gray-200 hover:bg-gray-300">
                                                <Image
                                                    layout="responsive"
                                                    width={0}
                                                    height={0}
                                                    src={
                                                        session?.user?.image ||
                                                        "https://preview.keenthemes.com/metronic-v4/theme/assets/pages/media/profile/profile_user.jpg"
                                                    }
                                                    className="rounded-full"
                                                    alt=""
                                                />
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
                                        {" "}
                                        {session?.user?.name}
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
