import { Connection, PublicKey, Keypair, VersionedTransaction, TransactionMessage } from "@solana/web3.js";
import { mintTo, getOrCreateAssociatedTokenAccount, createTransferInstruction, getAssociatedTokenAddress } from "@solana/spl-token";
import { 
    Metaplex, 
    keypairIdentity, 
    irysStorage 
} from "@metaplex-foundation/js";
import bs58 from "bs58"; 

import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

const SOLANA_RPC_URL = "https://api.devnet.solana.com";
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

export async function mintNFTWithMetadata(
    recipientAddress: string,
    uri: string,
    name: string,
    symbol: string = "ELCT"
) {
    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const payerKeypair = Keypair.fromSecretKey(bs58.decode(PAYER_SECRET_KEY));

        // Initialize Metaplex
        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(payerKeypair))
            .use(irysStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: SOLANA_RPC_URL,
                timeout: 60000,
            }));

        // Create NFT
        const { nft } = await metaplex.nfts().create({
            uri: uri,
            name: name,
            sellerFeeBasisPoints: 0, // royalties (0 = no royalties)
            symbol: symbol,
            creators: [
                {
                    address: payerKeypair.publicKey,
                    share: 100,
                },
            ],
            isMutable: true,
            maxSupply: 1,
        });

        // Transfer NFT to recipient
        await metaplex.nfts().transfer({
            nftOrSft: nft,
            fromOwner: payerKeypair.publicKey,
            toOwner: new PublicKey(recipientAddress),
        });

        return { 
            success: true, 
            signature: nft.address.toString(),
            mint: nft.address.toString()
        };
    } catch (error) {
        console.error("Error minting NFT:", error);
        throw error;
    }
}

// If you want to upload directly to Metaplex storage instead of separate IPFS
export async function uploadMetadata(
    name: string,
    description: string,
    imageBuffer: Buffer
) {
    try {
        // Generate unique filename
        const imageHash = crypto.createHash('md5').update(imageBuffer).digest('hex');
        const imageFilename = `${imageHash}.png`;
        
        // Define paths (adjust the public path according to your Remix setup)
        const publicDir = path.join(process.cwd(), 'public', 'nft-assets');
        const imagePath = path.join(publicDir, 'images', imageFilename);
        
        // Ensure directory exists
        await fs.mkdir(publicDir, { recursive: true });
        
        // Save image file
        await fs.writeFile(imagePath, imageBuffer);
        
        // Create metadata with local URL
        // Adjust the URL based on your deployment setup
        const imageUrl = `/nft-assets/${imageFilename}`;
        const metadata = {
            name,
            description,
            image: imageUrl,
        };
        
        // Save metadata file
        const metadataFilename = `${imageHash}-metadata.json`;
        const metadataPath = path.join(publicDir, 'metadata', metadataFilename);
        await fs.writeFile(metadataPath, JSON.stringify(metadata));
        
        // Return the metadata URL
        return `/nft-assets/${metadataFilename}`;
    } catch (error) {
        console.error("Error saving files:", error);
        throw error;
    }
}

export async function transferTokens(
    fromAddress: string,
    toAddress: string,
    mintAddress: string,
    amount: number,
    decimals: number
) {
    try {
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const payerKeypair = Keypair.fromSecretKey(bs58.decode(PAYER_SECRET_KEY));
        
        // Convert addresses to PublicKeys
        const fromPubkey = new PublicKey(fromAddress);
        const toPubkey = new PublicKey(toAddress);
        const mintPubkey = new PublicKey(mintAddress);

        // Get associated token accounts for both wallets
        const fromATA = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair,
            mintPubkey,
            fromPubkey
        );

        const toATA = await getOrCreateAssociatedTokenAccount(
            connection,
            payerKeypair,
            mintPubkey,
            toPubkey
        );

        // Create transfer instruction
        const transferInstruction = createTransferInstruction(
            fromATA.address,
            toATA.address,
            fromPubkey,
            amount * (10 ** decimals)
        );

        // Get latest blockhash
        const latestBlockhash = await connection.getLatestBlockhash();

        // Create TransactionMessage
        const message = new TransactionMessage({
            payerKey: fromPubkey,
            recentBlockhash: latestBlockhash.blockhash,
            instructions: [transferInstruction]
        }).compileToV0Message();

        // Create VersionedTransaction
        const transaction = new VersionedTransaction(message);

        return { 
            success: true, 
            transaction: transaction.serialize(),
            message: "Transaction needs to be signed by the user's wallet"
        };
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error transferring tokens:", error.message);
            if ('logs' in error) {
                console.error("Transaction logs:", (error as any).logs);
            }
        }
        return { success: false, error };
    }
}
