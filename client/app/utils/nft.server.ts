// app/utils/nft.server.ts
import { promises as fs } from 'fs';
import path from 'path';
import sharp from 'sharp'; // for image processing
import { uploadMetadata, mintNFTWithMetadata } from './solana.server';

const COLORS = [
    '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF',
    '#FFA500', '#800080', '#008000', '#000080', '#FFC0CB', '#800000'
  ];

async function generateNFT(type: 'chance' | 'community_chest') {
    // Get random base image
    const baseDir = path.join(process.cwd(), 'assets', 'nft_sources', type);
    const files = (await fs.readdir(baseDir))
        .filter(file => /\.(png|jpg|jpeg)$/i.test(file));
    if (files.length === 0) {
        throw new Error(`No base images found in ${type} directory`);
    }
    const randomFile = files[Math.floor(Math.random() * files.length)];
    
    // Generate random background color
    const backgroundColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    
    // Create new image with background
    const baseImage = await sharp(path.join(baseDir, randomFile))
    .resize(1000, 1000, {
        fit: 'contain',
        background: { r: 0, g: 0, b: 0, alpha: 0 }
    })
    .toBuffer();
    
    const image = await sharp({
        create: {
        width: 1000,
        height: 1000,
        channels: 4,
        background: backgroundColor
        }
    })
    .composite([
      { input: baseImage }
    ])
    .png()
    .toBuffer();


    const uri = await uploadMetadata(
        `Electryon ${type} NFT`,
        `A randomly generated ${type} NFT`,
        image
    );
  
    return uri;
}

export async function mintNFTToPlayer(
  type: 'chance' | 'community_chest',
  walletAddress: string
) {
  // Upload metadata to IPFS
  const uri = await generateNFT(type);
  
  // Mint NFT using your existing solana.server.ts infrastructure
  const mintResult = await mintNFTWithMetadata(
    walletAddress,
    uri,
    `Electryon ${type} NFT`
);
  
  return mintResult;
}