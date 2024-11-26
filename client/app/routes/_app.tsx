import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Outlet } from "@remix-run/react";

import type { AuthCookie } from "~/cookies/auth";
import { authCookie } from "~/cookies/auth";
import { Header } from "~/components/header";

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
    return (
        <>
            <Header username={userData.username} />
            <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
                <Outlet context={userData} />
            </div>
        </>
    );
}
