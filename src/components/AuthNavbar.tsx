"use client";
import { AuthButton } from "./AuthButton";
const AuthNavbar = () => {
    return (
        <>
            <div className="shadow-md h-20 px-8 border-b-2 border-gray-200 bg-white rounded-lg ">
                <div className="flex justify-between items-center h-full">
                    <h1 className="text-4xl font-bold">Kjey Arn</h1>
                    <AuthButton />
                </div>
            </div>
        </>
    );
};

export default AuthNavbar;
