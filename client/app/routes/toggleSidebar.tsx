import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { prefsCookie, DEFAULT_PREFS } from "~/utils/cookies";

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await prefsCookie.parse(cookieHeader)) || DEFAULT_PREFS;
    cookie.showSidebar = !cookie.showSidebar;

    return json(cookie.showSidebar, {
        headers: {
            "Set-Cookie": await prefsCookie.serialize(cookie),
        },
    });
}
