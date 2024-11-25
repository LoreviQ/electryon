import { Form } from "@remix-run/react";
import type { AuthCookie } from "~/cookies/auth";
import { authCookie } from "~/cookies/auth";
import { redirect } from "@remix-run/node";

export async function action({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const username = formData.get("username");
        const password = formData.get("password");
        if (!username || !password || typeof username !== "string" || typeof password !== "string") {
            return null;
        }
        const cookie: AuthCookie = {
            userid: "1",
            username,
            authenticated: true,
        };
        return redirect("/dashboard", {
            headers: {
                "Set-Cookie": await authCookie.serialize(cookie),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Response("Failed to complete authentication", { status: 500 });
    }
}

export default function Login() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white flex items-center justify-center px-4">
            <Form method="post" className="w-full max-w-md p-8 rounded-xl bg-gray-800 border border-gray-700">
                <h3 className="text-2xl text-center font-semibold mb-6">Welcome Back</h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-400 mb-1">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                            placeholder="Enter your password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                    >
                        Login
                    </button>
                </div>
                <div className="mt-6 text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <a href="/register" className="text-blue-400 hover:underline">
                        Sign up
                    </a>
                </div>
            </Form>
        </div>
    );
}
