#[account]
pub struct BusinessRegistry {
    pub businesses: Vec<Business>,
    pub pool_authority: Pubkey,
    pub total_businesses: u64,
}

#[account]
pub struct Business {
    pub business_id: u64,
    pub name: String,
    pub token_mint: Pubkey,
    pub owner: Pubkey,
    pub stake_pool: Pubkey,
    pub total_staked: u64,
}

#[program]
pub mod business_pool {
    pub fn register_business(
        ctx: Context<RegisterBusiness>,
        name: String,
    ) -> Result<()> {
        // Create business token
        // Add to registry
        // Initialize stake pool
    }
}