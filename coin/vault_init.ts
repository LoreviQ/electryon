import {
    Connection,
    Keypair,
    PublicKey,
    SystemProgram,
    Transaction,
    TransactionInstruction,
  } from '@solana/web3.js';
  import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token';
  
  const connection = new Connection('https://api.devnet.solana.com');
  
  async function initializeVault(
    payer: Keypair,
    programId: PublicKey,
    minCollateralRatio: number
  ) {
    // Create vault account
    const vaultKeypair = Keypair.generate();
    const tokenMint = Keypair.generate();
  
    const createVaultIx = SystemProgram.createAccount({
      fromPubkey: payer.publicKey,
      newAccountPubkey: vaultKeypair.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(165),
      space: 165,
      programId,
    });
  
    const initializeVaultIx = new TransactionInstruction({
      keys: [
        { pubkey: vaultKeypair.publicKey, isSigner: false, isWritable: true },
        { pubkey: tokenMint.publicKey, isSigner: true, isWritable: true },
        { pubkey: payer.publicKey, isSigner: true, isWritable: true },
        { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
        { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
      ],
      programId,
      data: Buffer.from([0, ...new BN(minCollateralRatio).toArray('le', 8)]),
    });
  
    const tx = new Transaction()
      .add(createVaultIx)
      .add(initializeVaultIx);
  
    await connection.sendTransaction(tx, [payer, vaultKeypair, tokenMint]);
  }