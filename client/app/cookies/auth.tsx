import { createCookie } from "@remix-run/node";

export const authCookie = createCookie("auth", {
    maxAge: 604_800, // one week
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
    path: "/",
});

export type AuthCookie = {
    userid: string;
    username: string;
    authenticated: boolean;
};
