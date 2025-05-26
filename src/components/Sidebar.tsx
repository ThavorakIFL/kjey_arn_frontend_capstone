"use client";
import React from "react";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { Icon } from "@iconify/react";

// const { data: session } = useSession();

const SideBar: React.FC = (props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const handleNavigation = (route: string) => {
        router.push(route);
    };

    const buttonList = [
        {
            title: "My Profile",
            route: `/my-profile`,
            icon: "ic:baseline-person",
        },
        {
            title: "Borrow Requests",
            route: "/borrow-request",
            icon: "ic:baseline-person",
        },
        {
            title: "My Activities",
            route: "/activity",
            icon: "ic:baseline-person",
        },
        { title: "My History", route: "/history", icon: "ic:baseline-person" },
    ];

    return (
        <div className="">
            {session ? (
                <div className=" bg-white  flex flex-col items-center h-screen space-y-16 overflow-hidden">
                    <div className="w-full  text-center py-8 ">
                        <h1
                            onClick={() => handleNavigation("/home")}
                            className="  cursor-pointer text-4xl font-bold"
                        >
                            KjeyArn
                        </h1>
                    </div>
                    <div className="w-full flex flex-col items-center space-y-4">
                        {buttonList.map((button) => (
                            <div
                                onClick={() => handleNavigation(button.route)}
                                key={button.title}
                                className="
                                group rounded-md w-10/12 h-14 flex items-center justify-between space-x-4 cursor-pointer"
                            >
                                <div>
                                    <Icon
                                        className="text-black"
                                        fontSize={30}
                                        icon={button.icon}
                                    />
                                </div>
                                <p className="text-black  w-full">
                                    {button.title}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
};

export default SideBar;
