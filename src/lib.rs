use solana_program::{
    account_info::AccountInfo,     // For handling Solana account information
    entrypoint,                    // Macro for declaring program entry point
    entrypoint::ProgramResult,     // Return type for Solana programs
    pubkey::Pubkey,               // For handling Solana public keys
    program_error::ProgramError,   // For handling program errors
};
use borsh::{BorshDeserialize, BorshSerialize};

#[derive(BorshSerialize, BorshDeserialize)] 
pub struct StablecoinVault {
    pub owner: Pubkey,             // Address of the vault owner
    pub btc_collateral: u64,       // Amount of BTC collateral stored
    pub stablecoins_issued: u64,   // Amount of stablecoins in circulation
    pub collateral_ratio: u64,     // Current collateralization ratio
    pub oracle_price: u64,         // Current BTC price from oracle
}

#[derive(BorshSerialize, BorshDeserialize)]
pub enum StablecoinInstruction {
    InitializeVault,                    // Create new vault
    DepositCollateral { amount: u64 },  // Deposit BTC collateral
    MintStablecoin { amount: u64 },     // Create new stablecoins
    RedeemStablecoin { amount: u64 },   // Redeem stablecoins for BTC
    WithdrawCollateral { amount: u64 },  // Withdraw BTC collateral
}