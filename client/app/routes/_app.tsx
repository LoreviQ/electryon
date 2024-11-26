import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";

import type { AuthCookie } from "~/cookies/auth";
import { authCookie } from "~/cookies/auth";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

export async function loader({ request }: { request: Request }) {
    const cookieHeader = request.headers.get("Cookie");
    const userData = await authCookie.parse(cookieHeader);
    if (!userData) {
        return redirect("/login");
    }
    return json({ userData });
}

export default function App() {
    const loaderData = useLoaderData<typeof loader>();
    const userData = loaderData.userData as AuthCookie;
    const widthClass = "max-w-7xl";
    return (
        <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white `}>
            <Header username={userData.username} contentWidth={widthClass} />
            <div className={`mx-auto ${widthClass}`}>
                <div className="flex">
                    <Sidebar />
                    <main className="flex-1 p-6">
                        <Outlet context={userData} />
                    </main>
                </div>
            </div>
        </div>
    );
}
