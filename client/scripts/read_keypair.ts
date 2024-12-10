// Create a script get-key.ts
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import fs from 'fs';

// Read the keypair file
const keypairFile = fs.readFileSync('/home/lorevi/.config/solana/id.json', 'utf-8');
const keypairData = JSON.parse(keypairFile);
const keypair = Keypair.fromSecretKey(new Uint8Array(keypairData));

// Get private key in base58 format
console.log("Private key (base58):", bs58.encode(keypair.secretKey));