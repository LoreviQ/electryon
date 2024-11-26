import { useLocation } from "@remix-run/react";

import { BlockIcon, BuildingIcon, CogIcon } from "./icons";
import { NavButton } from "./buttons";

interface SidebarProps {
    isOpen?: boolean;
}

export function Sidebar({ isOpen = true }: SidebarProps) {
    const location = useLocation();

    const navLinks = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <BlockIcon />,
        },
        {
            name: "Partners",
            path: "/partners",
            icon: <BuildingIcon />,
        },
        {
            name: "Settings",
            path: "/settings",
            icon: <CogIcon />,
        },
    ];

    return (
        <aside
            className={`${
                isOpen ? "w-64" : "w-20"
            } min-h-screen  border-r border-gray-800 transition-all duration-300 ease-in-out`}
        >
            <div className="px-4 py-6">
                <nav className="space-y-2">
                    {navLinks.map((link) => {
                        return (
                            <NavButton
                                key={link.path}
                                path={link.path}
                                label={link.name}
                                icon={link.icon}
                                isActive={location.pathname === link.path}
                                isOpen={isOpen}
                            />
                        );
                    })}
                </nav>
                <div className="my-6 border-t border-gray-800" />
            </div>
        </aside>
    );
}
