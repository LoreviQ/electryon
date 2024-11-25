use borsh::{BorshDeserialize, BorshSerialize};
use solana_program::pubkey::Pubkey;

#[derive(BorshSerialize, BorshDeserialize)] 
pub struct StablecoinVault {
    pub owner: Pubkey,             // Address of the vault owner
    pub btc_collateral: u64,       // Amount of BTC collateral stored
    pub stablecoins_issued: u64,   // Amount of stablecoins in circulation
    pub collateral_ratio: u64,     // Current collateralization ratio
    pub oracle_price: u64,         // Current BTC price from oracle
}
