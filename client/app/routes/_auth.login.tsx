import { Form, useSubmit } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey } from "@solana/web3.js";
import nacl from "tweetnacl";

import type { AuthCookie } from "~/utils/cookies";
import { authStorage } from "~/utils/cookies";
import { supabase } from "~/utils/db.server";

const message = "Sign this message to authenticate";

export async function action({ request }: { request: Request }) {
    const formData = await request.formData();
    const walletAddress = formData.get("walletAddress");
    const signature = formData.get("signature");
    if (!walletAddress || !signature) {
        return json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        // Verify signature
        const publicKey = new PublicKey(walletAddress);
        const signatureUint8 = new Uint8Array(Buffer.from(signature as string, "hex"));
        const messageUint8 = new TextEncoder().encode(message as string);
        const isValid = nacl.sign.detached.verify(messageUint8, signatureUint8, publicKey.toBytes());
        if (!isValid) throw new Error("Invalid signature");
        let username = walletAddress.slice(0, 4) + "..." + walletAddress.slice(-4);

        // Try to fetch existing user
        const { data: existingUser, error: fetchError } = await supabase
            .from("users")
            .select("username")
            .eq("wallet_address", walletAddress)
            .single();
        if (fetchError && fetchError.code !== "PGRST116") {
            // PGRST116 is "not found" error, throws all errors except this
            throw fetchError;
        }
        if (existingUser) {
            // Use existing username if user exists
            username = existingUser.username;
        } else {
            // Create new user if doesn't exist
            const { error: insertError } = await supabase.from("users").insert([
                {
                    wallet_address: walletAddress,
                    username: username,
                },
            ]);

            if (insertError) throw insertError;
        }

        // Set cookie
        const session = await authStorage.getSession();
        const cookie: AuthCookie = {
            username,
            walletAddress: walletAddress as string,
            authenticated: true,
            lastLogin: new Date().toISOString(),
        };
        session.set("user", cookie);
        return redirect("/dashboard", {
            headers: {
                "Set-Cookie": await authStorage.commitSession(session),
            },
        });
    } catch (error) {
        console.error(error);
        throw new Response("Failed to complete authentication", { status: 500 });
    }
}

export default function Login() {
    const wallet = useWallet();
    const submit = useSubmit();

    async function handleSign() {
        if (!wallet.connected || !wallet.publicKey || !wallet.signMessage) {
            console.error("Wallet not connected or signMessage not available");
            return;
        }

        const encodedMessage = new TextEncoder().encode(message);
        function bufferToHex(buffer: Uint8Array): string {
            return Array.from(buffer)
                .map((b) => b.toString(16).padStart(2, "0"))
                .join("");
        }

        try {
            const signature = await wallet.signMessage(encodedMessage);

            submit(
                {
                    walletAddress: wallet.publicKey.toString(),
                    signature: bufferToHex(signature),
                },
                { method: "post" }
            );
        } catch (error) {
            console.error("Failed to sign message:", error);
        }
    }

    return (
        <div className="w-full max-w-md p-8 rounded-xl bg-gray-800 border border-gray-700 space-y-4 justify-center items-center">
            <h3 className="text-2xl text-center font-semibold mb-6">Connect Wallet</h3>

            <div className="flex justify-center w-full">
                <WalletMultiButton />
            </div>

            {wallet.connected && (
                <Form method="post" className="w-full">
                    <button
                        type="button"
                        onClick={handleSign}
                        className="w-full mt-6 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-semibold transition-colors"
                    >
                        Sign to Login
                    </button>
                </Form>
            )}
        </div>
    );
}
