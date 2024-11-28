import { createCookieSessionStorage, createCookie } from "@remix-run/node";

// Session storage for auth
export const authStorage = createCookieSessionStorage({
    cookie: {
        name: "auth",
        maxAge: 604_800, // one week
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax",
        path: "/",
    },
});

export type AuthCookie = {
    userid: string;
    username: string;
    authenticated: boolean;
};

// Cookie for storing user preferences
export const prefsCookie = createCookie("prefs");

export type PrefsCookie = {
    showSidebar?: boolean;
    narrowMode?: boolean;
};

export const DEFAULT_PREFS: PrefsCookie = {
    showSidebar: true,
    narrowMode: false,
};
