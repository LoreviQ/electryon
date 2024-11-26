import { Link } from "@remix-run/react";

import { Logo } from "~/components/icons";

interface HeaderProps {
    username: string;
    contentWidth: string;
}
export function Header({ username, contentWidth }: HeaderProps) {
    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className={`flex items-center justify-between h-16 mx-auto ${contentWidth}`}>
                    <Link to="/" className="flex items-center">
                        <Logo />
                    </Link>
                    <SearchBar />
                    <UserInfo username={username} />
                </div>
            </div>
        </header>
    );
}

function SearchBar() {
    return (
        <div className="flex-1 max-w-2xl mx-8">
            <div className="relative">
                <input
                    type="search"
                    placeholder="Search..."
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg py-2 px-4 text-gray-300 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </button>
            </div>
        </div>
    );
}

function UserInfo({ username }: { username: string }) {
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
