import type { ActionFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import { prefsCookie, DEFAULT_PREFS, type PrefsCookie } from "~/utils/cookies";

export async function action({ request }: ActionFunctionArgs) {
    const cookieHeader = request.headers.get("Cookie");
    const cookie = (await prefsCookie.parse(cookieHeader)) || DEFAULT_PREFS;

    const formData = await request.formData();
    const updates = Object.fromEntries(formData);

    // Type safety: only update valid preference keys
    const newPrefs: PrefsCookie = {
        ...cookie,
        ...Object.entries(updates).reduce((acc, [key, value]) => {
            if (key in DEFAULT_PREFS && typeof value === "string") {
                acc[key as keyof PrefsCookie] = value.toLowerCase() === "true";
            }
            return acc;
        }, {} as PrefsCookie),
    };

    return json(newPrefs, {
        headers: {
            "Set-Cookie": await prefsCookie.serialize(newPrefs),
        },
    });
}
