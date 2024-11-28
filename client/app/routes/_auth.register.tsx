import { Form, useActionData } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";

import type { AuthCookie } from "~/utils/cookies";
import { authStorage } from "~/utils/cookies";

type ActionData = {
    error?: string;
};

export async function action({ request }: { request: Request }) {
    try {
        const formData = await request.formData();
        const email = formData.get("email");
        const username = formData.get("username");
        const password = formData.get("password");
        const confirmPassword = formData.get("confirmPassword");

        if (
            !email ||
            !username ||
            !password ||
            !confirmPassword ||
            typeof email !== "string" ||
            typeof username !== "string" ||
            typeof password !== "string" ||
            typeof confirmPassword !== "string"
        ) {
            return json<ActionData>({ error: "Missing required fields" });
        }

        if (password !== confirmPassword) {
            return json<ActionData>({ error: "Passwords do not match" });
        }

        // temporary logic for demo
        const session = await authStorage.getSession();
        const userData: AuthCookie = {
            userid: "1",
            username,
            authenticated: true,
        };
        session.set("user", userData);
        return redirect("/dashboard", {
            headers: {
                "Set-Cookie": await authStorage.commitSession(session),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Response("Failed to complete registration", { status: 500 });
    }
}

export default function Register() {
    const actionData = useActionData<ActionData>();
    return (
        <Form method="post" className="w-full max-w-md p-8 rounded-xl bg-gray-800 border border-gray-700">
            <h3 className="text-2xl text-center font-semibold mb-6">Create Account</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        placeholder="Enter your email"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                        Username
                    </label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        placeholder="Choose a username"
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
                        placeholder="Create a password"
                        required
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-400 mb-1">
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                        placeholder="Confirm your password"
                        required
                    />
                </div>
                {actionData?.error && (
                    <p className="text-sm" style={{ color: "#ef4444" }}>
                        {actionData.error}
                    </p>
                )}
                <button
                    type="submit"
                    className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                >
                    Sign Up
                </button>
            </div>
            <div className="mt-6 text-center text-sm text-gray-400">
                Already have an account?{" "}
                <a href="/login" className="text-blue-400 hover:underline">
                    Login
                </a>
            </div>
        </Form>
    );
}
