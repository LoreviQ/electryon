import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import bs58 from "bs58"; 

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || "https://api.devnet.solana.com";
const PAYER_SECRET_KEY = process.env.PAYER_SECRET_KEY || "";

export async function mintTokenToPlayer(
    recipientAddress: string,
    mintAddress: string,
    amount: number,
    decimals: number
) {
    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");

        // Convert base58 secret key to Keypair
        const payerKeypair = Keypair.fromSecretKey(
            bs58.decode(PAYER_SECRET_KEY)
        );

        const mintPubkey = new PublicKey(mintAddress);
        const recipientPubkey = new PublicKey(recipientAddress);

        const recipientTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair,
            mintPubkey,
            recipientPubkey
        );

        const mintTx = await mintTo(
            connection,
            payerKeypair,
            mintPubkey,
            recipientTokenAccount.address,
            payerKeypair,
            amount * (10 ** decimals)
        );

        return { success: true, signature: mintTx };
    } catch (error) {
        console.error("Error minting tokens:", error);
        throw error;
    }
}