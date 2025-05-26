"use client";
import React from "react";
import { useSession, signOut } from "next-auth/react";
import { Icon } from "@iconify/react";
import { Popover } from "@/components/ui/popover";
import { useRouter } from "next/navigation";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import Image from "next/image";

const NavBar: React.FC = (props) => {
    const { data: session } = useSession();
    const router = useRouter();

    return (
        <>
            <div className="h-20 px-8 border border-gray-200 bg-white rounded-lg ">
                <div className="flex justify-between items-center h-full">
                    <div className="flex  items-center space-x-4">
                        <Icon
                            icon={"ic:baseline-menu"}
                            width="28"
                            height="28"
                        />
                        <p className="text-xl font-semibold">
                            Paragon Internatioanl University
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div
                            onClick={() => {
                                router.push("/shelf");
                            }}
                            className="cursor-pointer container flex justify-center items-center w-12 h-12 rounded-3xl bg-gray-200 "
                        ></div>

                        <div
                            onClick={() => {
                                router.push("/shelf");
                            }}
                            className="container flex justify-center items-center w-12 h-12 rounded-3xl bg-gray-200 "
                        ></div>
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
                                <div className="text-white ">Logout</div>
                            </PopoverContent>
                        </Popover>
                        <p className="text-xl"> {session?.user?.name}</p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default NavBar;
