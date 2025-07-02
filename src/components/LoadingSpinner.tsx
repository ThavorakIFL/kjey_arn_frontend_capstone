interface LoadingSpinnerProps {
    message?: string;
}

export default function LoadingSpinner({
    message = "Loading...",
}: LoadingSpinnerProps) {
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-sm sm:text-base text-gray-600">{message}</p>
            </div>
        </div>
    );
}
