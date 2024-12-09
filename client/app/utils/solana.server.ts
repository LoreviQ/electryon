import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import { mintTo, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { 
    Metaplex, 
    keypairIdentity, 
    toMetaplexFile,
    irysStorage 
} from "@metaplex-foundation/js";
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
        const connection = new Connection(SOLANA_RPC_URL, "confirmed");
        const payerKeypair = Keypair.fromSecretKey(bs58.decode(PAYER_SECRET_KEY));

        const metaplex = Metaplex.make(connection)
            .use(keypairIdentity(payerKeypair))
            .use(irysStorage({
                address: 'https://devnet.bundlr.network',
                providerUrl: SOLANA_RPC_URL,
                timeout: 60000,
            }));

        // Upload image
        const imageFile = toMetaplexFile(imageBuffer, 'nft.png');
        const imageUri = await metaplex.storage().upload(imageFile);

        // Upload metadata
        const { uri } = await metaplex.nfts().uploadMetadata({
            name: name,
            description: description,
            image: imageUri,
        });

        return uri;
    } catch (error) {
        console.error("Error uploading metadata:", error);
        throw error;
    }
}