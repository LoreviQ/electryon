import { authCookie } from "~/cookies/auth";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

export async function loader({ request }: { request: Request }) {
    const cookieHeader = request.headers.get("Cookie");
    const userData = await authCookie.parse(cookieHeader);
    if (!userData) {
        return redirect("/login");
    }
    return json({ userData });
}
