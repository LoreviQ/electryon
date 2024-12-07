#[derive(Accounts)]
pub struct StakeContext<'info> {
    pub business: Account<'info, Business>,
    pub user: Signer<'info>,
    pub stake_pool: Account<'info, StakePool>,
    pub user_token_account: Account<'info, TokenAccount>,
    pub pool_token_account: Account<'info, TokenAccount>,
}

#[program]
impl BusinessPool {
    pub fn stake_in_business(
        ctx: Context<StakeContext>,
        amount: u64,
        business_id: u64
    ) -> Result<()> {
        // Transfer tokens to pool
        // Record stake
        // Issue stake receipt
    }
}