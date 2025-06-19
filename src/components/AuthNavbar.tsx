// AuthNavbar.jsx
"use client";
import { AuthButton } from "./AuthButton";
import Image from "next/image";
import kjeyarnlogo from "@/assets/kjeyarnlogo.png";
const AuthNavbar = () => {
    return (
        <nav className="fixed w-full top-0 z-50 bg-sidebarColorLine   border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-4">
                        <Image
                            src={kjeyarnlogo}
                            alt="KjeyArn logo"
                            width={180}
                            height={90}
                        />
                    </div>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};

export default AuthNavbar;
