"use client";

import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { Popover } from "@/components/ui/popover";
import { Icon } from "@iconify/react";
import { Separator } from "@/components/ui/separator";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import ActivityBell from "./activityComponent/ActivityBell";
import kjeyarnlogo from "@/assets/kjeyarnlogo.png";

// Import shadcn/ui sidebar components
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger,
    SidebarInset,
    useSidebar,
} from "@/components/ui/sidebar";

// Custom mobile sidebar component that slides from top
function MobileSidebar({
    isOpen,
    onClose,
    buttonList,
    pathname,
    handleNavigation,
}: {
    isOpen: boolean;
    onClose: () => void;
    buttonList: any[];
    pathname: string;
    handleNavigation: (route: string) => void;
}) {
    // Lock body scroll when mobile sidebar is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const handleNavClick = (route: string) => {
        handleNavigation(route);
        onClose(); // Close mobile sidebar after navigation
    };

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Mobile Sidebar - slides from top */}
            <div
                className={`
                    fixed top-0 left-0 right-0 z-50 lg:hidden
                    bg-sidebarColor
                    transform transition-transform duration-300 ease-out
                    ${isOpen ? "translate-y-0" : "-translate-y-full"}
                    max-h-[80vh] overflow-y-auto
                `}
            >
                {/* Header */}
                <div className="px-4 py-6 flex items-center justify-between border-b border-sidebarColorLine">
                    <Image
                        className="cursor-pointer"
                        onClick={() => handleNavClick("/home")}
                        src={kjeyarnlogo}
                        alt="KjeyArn logo"
                        width={120}
                        height={90}
                    />
                    <div
                        onClick={onClose}
                        className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-sideColor transition-all duration-300 cursor-pointer"
                    >
                        <Icon
                            icon="ic:baseline-close"
                            width="24"
                            height="24"
                            className="text-white"
                        />
                    </div>
                </div>

                {/* Navigation */}
                <div className="px-4 py-6 space-y-2">
                    {buttonList.map((button) => (
                        <div
                            onClick={() => handleNavClick(button.route)}
                            key={button.title}
                            className={`
                                transition-all duration-300 border-l-4 h-12 flex items-center space-x-4 cursor-pointer px-4 rounded-r-lg
                                hover:bg-sideColor 
                                ${
                                    pathname === button.route
                                        ? "border-white bg-sideColor"
                                        : "border-transparent"
                                }
                            `}
                        >
                            <Icon
                                className="text-white flex-shrink-0"
                                fontSize={20}
                                icon={button.icon}
                            />
                            <p
                                className={`font-light text-white ${
                                    pathname === button.route
                                        ? "font-medium"
                                        : ""
                                }`}
                            >
                                {button.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

// Main component with custom sidebar control
function NavSideBarContent({ children }: { children: React.ReactNode }) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const { open, setOpen, toggleSidebar } = useSidebar();

    const handleNavigation = (route: string) => {
        router.push(route);
    };

    const buttonList = [
        {
            title: "My Homepage",
            route: `/home`,
            icon: "lucide:home",
        },
        {
            title: "My Profile",
            route: `/my-profile`,
            icon: "lucide:user",
        },
        {
            title: "My Borrow Requests",
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
            {/* Mobile Sidebar */}
            <MobileSidebar
                isOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
                buttonList={buttonList}
                pathname={pathname}
                handleNavigation={handleNavigation}
            />

            <div className="flex h-screen w-full">
                {/* Desktop Sidebar */}
                <Sidebar className=" border-r-0" collapsible="icon">
                    <div className="bg-sidebarColor h-full flex flex-col">
                        {/* Sidebar Header - Logo */}
                        <SidebarHeader className="p-4">
                            <div className="flex items-center justify-between">
                                <div className="group-data-[collapsible=icon]:hidden">
                                    <Image
                                        className="cursor-pointer"
                                        onClick={() =>
                                            handleNavigation("/home")
                                        }
                                        src={kjeyarnlogo}
                                        alt="KjeyArn logo"
                                        width={160}
                                        height={120}
                                    />
                                </div>

                                {/* Desktop toggle button */}
                                <div
                                    onClick={toggleSidebar}
                                    className="flex justify-center items-center w-12 h-12 rounded-3xl hover:bg-sideColor transition-all duration-300 cursor-pointer ml-auto"
                                >
                                    <Icon
                                        icon={
                                            open
                                                ? "ic:baseline-menu"
                                                : "ic:baseline-menu-open"
                                        }
                                        width="24"
                                        height="24"
                                        className="text-white"
                                    />
                                </div>
                            </div>
                        </SidebarHeader>

                        <Separator className="bg-sidebarColorLine group-data-[collapsible=icon]:hidden" />

                        {/* Sidebar Content - Navigation */}
                        <SidebarContent className="flex-1">
                            <SidebarGroup>
                                <SidebarGroupContent className="py-8">
                                    <SidebarMenu className="space-y-2">
                                        {buttonList.map((button) => (
                                            <SidebarMenuItem key={button.title}>
                                                <SidebarMenuButton
                                                    onClick={() =>
                                                        handleNavigation(
                                                            button.route
                                                        )
                                                    }
                                                    isActive={
                                                        pathname ===
                                                        button.route
                                                    }
                                                    tooltip={button.title}
                                                    className={`
                                                        cursor-pointer
                                                        transition-all duration-300 h-11 px-6
                                                        border-l-4 rounded-none
                                                        hover:bg-sideColor hover:text-white
                                                        data-[active=true]:bg-sideColor 
                                                        data-[active=true]:text-white
                                                        data-[active=true]:border-l-white
                                                        data-[active=false]:border-l-transparent
                                                        text-white hover:border-l-white
                                                        justify-start gap-4
                                                        group-data-[collapsible=icon]:justify-center
                                                        group-data-[collapsible=icon]:px-2
                                                    `}
                                                >
                                                    <Icon
                                                        className="text-white flex-shrink-0"
                                                        fontSize={30}
                                                        icon={button.icon}
                                                    />
                                                    <span
                                                        className={`font-light group-data-[collapsible=icon]:hidden ${
                                                            pathname ===
                                                            button.route
                                                                ? "font-medium"
                                                                : ""
                                                        }`}
                                                    >
                                                        {button.title}
                                                    </span>
                                                </SidebarMenuButton>
                                            </SidebarMenuItem>
                                        ))}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        </SidebarContent>

                        <SidebarRail />
                    </div>
                </Sidebar>

                {/* Main Content */}
                <SidebarInset className="flex-1">
                    {/* Top Navbar */}
                    <header className="sticky top-0 z-30 bg-white shadow-sm">
                        <div className="px-4 sm:px-6 lg:px-8 py-4">
                            <div className="flex justify-between items-center">
                                {/* Left side */}
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                    {/* Mobile menu button */}
                                    <div
                                        onClick={() => setMobileMenuOpen(true)}
                                        className="lg:hidden cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-all duration-300"
                                    >
                                        <Icon
                                            icon="ic:baseline-menu"
                                            width="24"
                                            height="24"
                                            className="text-black"
                                        />
                                    </div>

                                    <p className="text-sm sm:text-lg lg:text-2xl font-medium truncate">
                                        Paragon International University
                                    </p>
                                </div>

                                {/* Right side */}
                                <div className="flex items-center space-x-2 sm:space-x-4 lg:space-x-6 flex-shrink-0">
                                    {/* Library button */}
                                    <div
                                        onClick={() => router.push("/shelf")}
                                        className="cursor-pointer flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-3xl hover:bg-gray-200 transition-all duration-300"
                                    >
                                        <Icon
                                            icon="lucide:library"
                                            width="20"
                                            height="20"
                                            className="sm:w-6 sm:h-6"
                                        />
                                    </div>

                                    {/* Activity bell */}
                                    <div className="z-50 flex justify-center items-center w-10 h-10 sm:w-12 sm:h-12 rounded-3xl hover:bg-gray-200 transition-all duration-300 cursor-pointer">
                                        <ActivityBell />
                                    </div>

                                    {/* Profile dropdown */}
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <div className="cursor-pointer w-10 h-10 sm:w-12 sm:h-12 rounded-3xl bg-gray-200 hover:bg-gray-300 overflow-hidden flex-shrink-0">
                                                {status === "loading" ? (
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
                                            <div className="text-white">
                                                Logout
                                            </div>
                                        </PopoverContent>
                                    </Popover>

                                    {/* User name */}
                                    <p className="text-sm sm:text-lg lg:text-xl hidden sm:block">
                                        {status === "loading" ? (
                                            <span className="inline-block w-16 sm:w-20 h-4 sm:h-6 bg-gray-300 animate-pulse rounded" />
                                        ) : (
                                            session?.user?.name || "Guest"
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Page content */}
                    <main className="p-4 sm:p-6 lg:p-8">{children}</main>
                </SidebarInset>
            </div>
        </>
    );
}

export default function NavSideBar({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <SidebarProvider defaultOpen={true}>
            <NavSideBarContent>{children}</NavSideBarContent>
        </SidebarProvider>
    );
}
