import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";

import type { AuthCookie, PrefsCookie } from "~/utils/cookies";
import { authStorage, prefsCookie, DEFAULT_PREFS } from "~/utils/cookies";
import { Header } from "~/components/header";
import { Sidebar } from "~/components/sidebar";

export async function loader({ request }: { request: Request }) {
    const cookieHeader = request.headers.get("Cookie");
    const session = await authStorage.getSession(cookieHeader);
    const userData = session.get("user");
    if (!userData) {
        return redirect("/login");
    }
    const preferences = (await prefsCookie.parse(cookieHeader)) || DEFAULT_PREFS;
    return json({ userData, preferences });
}

export default function App() {
    const loaderData = useLoaderData<typeof loader>();
    const userData = loaderData.userData as AuthCookie;
    const preferences = loaderData.preferences as PrefsCookie;
    const widthClass = preferences.narrowMode ? "max-w-7xl" : "";
    return (
        <div className={`min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white `}>
            <Header preferences={preferences} username={userData.username} contentWidth={widthClass} />
            <div className={`mx-auto ${widthClass}`}>
                <div className="flex">
                    <Sidebar isOpen={preferences.showSidebar} />
                    <main className="flex-1 p-6">
                        <Outlet context={userData} />
                    </main>
                </div>
            </div>
        </div>
    );
}
