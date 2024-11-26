import { useOutletContext } from "@remix-run/react";
import { Form } from "@remix-run/react";

import type { AuthCookie } from "~/utils/cookies";

export default function Dashboard() {
    const userData = useOutletContext<AuthCookie>();
    return (
        <div>
            Logged in as {userData.username}
            <Form method="post" action="/logout">
                <button
                    type="submit"
                    className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                >
                    Logout
                </button>
            </Form>
        </div>
    );
}
