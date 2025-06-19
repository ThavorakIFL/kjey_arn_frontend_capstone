import PiuLogo from "@/assets/icons/piu.svg";

export default function Home() {
    return (
        <main>
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-6 sm:px-8 py-20">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left Content */}
                    <div className="space-y-8 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                        <div className="space-y-6">
                            <div className="inline-flex items-center px-4 py-2 bg-blue-50 rounded-full border border-blue-200">
                                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse"></span>
                                <span className="text-blue-700 text-sm font-medium">
                                    Discover Your Next Great Read
                                </span>
                            </div>

                            <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                                    What is
                                </span>
                                <br />
                                <span className=" bg-clip-text ">KjeyArn?</span>
                            </h1>

                            <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                                A student-to-student book sharing platform
                                designed specifically for Paragon IU, to find,
                                borrow, and lend reading materials within the
                                university community.
                            </p>
                        </div>
                    </div>

                    {/* Right Visual - Your Enhanced Logo */}
                    <div className="relative opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                        <div className="relative animate-[float_6s_ease-in-out_infinite]">
                            {/* Background decorative elements */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-cyan-100 rounded-3xl transform rotate-6 scale-110 opacity-50"></div>
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-100 via-blue-50 to-indigo-100 rounded-3xl transform -rotate-3 scale-105 opacity-40"></div>

                            {/* Your logo with enhanced styling */}
                            <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/50 shadow-xl">
                                <PiuLogo className="w-80 h-80 mx-auto filter drop-shadow-lg" />
                            </div>

                            {/* Floating elements */}
                            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                            <div
                                className="absolute -bottom-8 -left-8 w-32 h-32 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-20 animate-pulse"
                                style={{ animationDelay: "1s" }}
                            ></div>
                            <div
                                className="absolute top-1/2 -right-12 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-15 animate-pulse"
                                style={{ animationDelay: "2s" }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
