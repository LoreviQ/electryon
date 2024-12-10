use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize)] 
pub struct TokenVault {
    pub owner: Pubkey,             // Address of the vault owner
    pub collateral: u64,           // Amount of collateral stored
    pub tokens_issued: u64,        // Total tokens in circulation
    pub min_collateral_ratio: u64, // Minimum collateral ratio (configurable)
    pub price: u64,                // Current token price (if needed)
}