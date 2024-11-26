import { redirect } from "@remix-run/node";
import { Outlet } from "@remix-run/react";

import { authCookie } from "~/utils/cookies";

export async function loader({ request }: { request: Request }) {
    const cookieHeader = request.headers.get("Cookie");
    const userData = await authCookie.parse(cookieHeader);
    if (userData) {
        return redirect("/dashboard");
    }
    return null;
}

export default function Auth() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
            <Outlet />
        </div>
    );
}
