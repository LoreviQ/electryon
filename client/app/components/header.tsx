import { Link } from "@remix-run/react";

import { Logo } from "~/components/icons";
import { SearchBar } from "~/components/searchBar";
import { UserInfo } from "~/components/userInfo";

interface HeaderProps {
    username: string;
}
export function Header({ username }: HeaderProps) {
    return (
        <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
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
