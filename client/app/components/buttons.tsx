import { Link } from "@remix-run/react";

interface NavButtonProps {
    path: string;
    label: string;
    icon: React.ReactNode;
    isActive: boolean;
    isOpen?: boolean;
}
export function NavButton({ path, label, icon, isActive, isOpen }: NavButtonProps) {
    return (
        <Link
            to={path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-500/20 text-blue-400" : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
            }`}
        >
            {icon}
            <span className={`${!isOpen && "hidden"} font-medium`}>{label}</span>
        </Link>
    );
}
