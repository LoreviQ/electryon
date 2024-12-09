import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useState, useEffect } from "react";
import { TOKEN_PROGRAM_ID } from "@solana/spl-token";

import type { Token } from "~/types/database";

// Constants
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
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

// Types
interface TokenBalance {
    config: Token;
    balance: number | null;
}

interface NFT {
    name: string;
    image: string;
    mint: string;
}

// Helper functions
async function fetchSolBalance(connection: any, publicKey: PublicKey) {
    const solBal = await connection.getBalance(publicKey);
    return solBal / LAMPORTS_PER_SOL;
}

async function fetchTokenBalances(connection: any, publicKey: PublicKey) {
    const tokenAccounts = await connection.getTokenAccountsByOwner(publicKey, {
        programId: TOKEN_PROGRAM_ID,
    });

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

    return mintBalances;
}

// Component
export default function Dashboard() {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [solBalance, setSolBalance] = useState<number | null>(null);
    const [tokenBalances, setTokenBalances] = useState<TokenBalance[]>(
        TOKENS.map((config) => ({ config, balance: null }))
    );
    const [nfts, setNfts] = useState<NFT[]>([]);

    useEffect(() => {
        async function getBalances() {
            if (!publicKey) return;

            try {
                // Get SOL balance
                const solBal = await fetchSolBalance(connection, publicKey);
                setSolBalance(solBal);

                // Get token balances
                const mintBalances = await fetchTokenBalances(connection, publicKey);
                setTokenBalances((tokens) =>
                    tokens.map((token) => ({
                        config: token.config,
                        balance: mintBalances.has(token.config.mint)
                            ? mintBalances.get(token.config.mint)! / Math.pow(10, token.config.decimals)
                            : 0,
                    }))
                );

                // Get NFTs - TODO
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

            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Your NFTs</h2>
                <div className="flex overflow-x-auto gap-4 pb-4">
                    {nfts.map((nft) => (
                        <div key={nft.mint} className="flex-none w-48 p-4 border rounded-lg">
                            <img src={nft.image} alt={nft.name} className="w-full h-48 object-cover rounded-lg" />
                            <p className="mt-2 text-center font-medium">{nft.name}</p>
                            <p className="text-xs text-gray-500 text-center truncate">{nft.mint}</p>
                        </div>
                    ))}
                    {nfts.length === 0 && <p className="text-gray-500">No NFTs found</p>}
                </div>
            </div>
        </div>
    );
}
