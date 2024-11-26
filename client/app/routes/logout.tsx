import { redirect } from "@remix-run/node";

import { authCookie } from "~/utils/cookies";

export async function action() {
    // sets the cookie to a non-functional value
    return redirect("/", {
        headers: {
            "Set-Cookie": await authCookie.serialize("", {
                expires: new Date(0),
                maxAge: 0,
            }),
        },
    });
}
