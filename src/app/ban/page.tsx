"use client";
import StatusChecker from "@/components/StatusChecker";
export default function Ban() {
    return (
        <>
            <StatusChecker />
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-6">
                <div className="max-w-md w-full">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_forwards]">
                        {/* Status Badge */}
                        <div className="inline-flex items-center px-3 py-1 bg-red-50 rounded-full border border-red-200 mb-4">
                            <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                            <span className="text-red-700 text-sm font-medium">
                                Account Suspended
                            </span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-2xl font-bold text-gray-900 mb-3">
                            Access Restricted
                        </h1>

                        {/* Message */}
                        <p className="text-gray-600 leading-relaxed mb-6">
                            Your account has been temporarily suspended from
                            KjeyArn. Please contact the librarian for more
                            information.
                        </p>

                        {/* Action Button */}
                        <button
                            onClick={() =>
                                (window.location.href = "/api/auth/signout")
                            }
                            className="w-full bg-gray-900 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                        >
                            Sign Out
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="text-center mt-6 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.4s_forwards]">
                        <p className="text-sm text-gray-500">
                            © 2025 KjeyArn - Paragon International University
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
