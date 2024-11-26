export function UserInfo({ username }: { username: string }) {
    return (
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
                <span className="text-gray-300">{username}</span>
                <button className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors">
                    <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}
