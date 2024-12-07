import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import type { Token } from "~/types/database";

// temporary tokens for demo
const TOKEN_1: Token = {
    mint: "C42DzRihK7jiWNMExgaTsA6swHnDhneH15nvki3b8QSM",
    name: "Colour Coffee",
    symbol: "CoCo",
    decimals: 6,
};
const TOKEN_2: Token = {
    mint: "9vgggkNR4wXDHinLXeeAXWpWtJnHa5hEe2RcmJ76PqWr",
    name: "Page Turners",
    symbol: "pTURN",
    decimals: 6,
};
const TOKENS = [TOKEN_1, TOKEN_2];

interface TokenBalance {
    config: Token;
    balance: number | null;
}

export default function Dashboard() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>(
        TOKENS.map((config) => ({ config, balance: null }))
    );

    useEffect(() => {
        async function getBalances() {
            if (!publicKey) return;

            try {
                // Get SOL balance
                const solBal = await connection.getBalance(publicKey);
                setSolBalance(solBal / LAMPORTS_PER_SOL);

                // Get token accounts
                const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
                    programId: TOKEN_PROGRAM_ID,
                });

                // Create a map of mint addresses to balances
                const mintBalances = new Map<string, number>();

                for (const tokenAccount of tokenAccounts.value) {
                    const accountInfo = await connection.getParsedAccountInfo(tokenAccount.pubkey);
                    const parsedInfo = accountInfo.value?.data;

                    if (parsedInfo && "parsed" in parsedInfo) {
                        const mintAddress = parsedInfo.parsed.info.mint;
                        const amount = Number(parsedInfo.parsed.info.tokenAmount.amount);
                        mintBalances.set(mintAddress, amount);
                    }
                }

                // Update token balances
                setTokenBalances((tokens) =>
                    tokens.map((token) => ({
                        config: token.config,
                        balance: mintBalances.has(token.config.mint)
                            ? mintBalances.get(token.config.mint)! / Math.pow(10, token.config.decimals)
                            : 0,
                    }))
                );
            } catch (e) {
                console.error("Error fetching balances:", e);
            }
        }

        getBalances();
    }, [publicKey, connection]);

    if (!publicKey) return <div>Please connect your wallet</div>;

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Wallet Balances</h2>

            <div className="space-y-4">
                <div className="p-4 border rounded">
                    <h3 className="font-semibold">SOL Balance</h3>
                    <p>{solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "Loading..."}</p>
                </div>

                {tokenBalances.map(({ config, balance }) => (
                    <div key={config.mint} className="p-4 border rounded">
                        <h3 className="font-semibold">
                            {config.name} ({config.symbol})
                        </h3>
                        <p>{balance !== null ? balance.toFixed(4) : "Loading..."}</p>
                        <p className="text-sm text-gray-500">Mint: {config.mint}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
