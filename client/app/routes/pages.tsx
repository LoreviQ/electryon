// Simple page to show expected pages within scope during development

import { Link } from "@remix-run/react";

export default function Pages() {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
            <h1 className="text-4xl font-bold">Pages</h1>
            <Link to="/">
                <p>root</p>
            </Link>
            <Link to="/login">
                <p>login</p>
            </Link>
            <Link to="/register">
                <p>register</p>
            </Link>
            <Link to="/partners">
                <p>partners</p>
            </Link>
            <Link to="/subscribe">
                <p>about</p>
            </Link>
            <Link to="/dashboard">
                <p>dashboard</p>
            </Link>
        </div>
    );
}
