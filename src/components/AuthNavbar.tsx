// AuthNavbar.jsx
"use client";
import { AuthButton } from "./AuthButton";

const AuthNavbar = () => {
    return (
        <nav className="fixed w-full top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200/50">
            <div className="max-w-7xl mx-auto px-6 sm:px-8">
                <div className="flex justify-between items-center h-20">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                            KjeyArn
                        </h1>
                    </div>
                    <AuthButton />
                </div>
            </div>
        </nav>
    );
};

export default AuthNavbar;
