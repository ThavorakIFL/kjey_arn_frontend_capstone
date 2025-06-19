const UserCardSkeleton = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-pulse">
        <div className="flex flex-col items-center space-y-4">
            <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
            <div className="space-y-2 w-full">
                <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-3 bg-gray-200 rounded w-full mx-auto"></div>
            </div>
        </div>
    </div>
);

export default UserCardSkeleton;
