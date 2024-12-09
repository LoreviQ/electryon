import { redirect } from "@remix-run/node";

import { authStorage } from "~/utils/cookies";

export async function action({ request }: { request: Request }) {
    const session = await authStorage.getSession(request.headers.get("Cookie"));

    return redirect("/", {
        headers: {
            "Set-Cookie": await authStorage.destroySession(session),
        },
    });
}
