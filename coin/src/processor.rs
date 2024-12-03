use solana_program::{
    account_info::{next_account_info, AccountInfo},
    entrypoint::ProgramResult,
    pubkey::Pubkey,
    program_error::ProgramError,
};
use crate::state::StablecoinVault;

pub struct Processor {}

impl Processor {
    pub fn process_initialize_vault(
        accounts: &[AccountInfo],
        min_collateral_ratio: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let vault_account = next_account_info(accounts_iter)?;
        let token_mint = next_account_info(accounts_iter)?;
        let payer = next_account_info(accounts_iter)?;
        let system_program = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;
        let rent = Rent::get()?;

        // Create vault
        let vault = TokenVault {
            owner: *payer.key,
            collateral: 0,
            tokens_issued: 0,
            min_collateral_ratio,
            price: 0,
        };

        // Create token mint
        invoke(
            &token_instruction::initialize_mint(
                token_program.key,
                token_mint.key,
                payer.key,
                Some(payer.key),
                9, // decimals
            )?,
            &[token_mint.clone(), rent.to_account_info(), payer.clone()],
        )?;

        vault.serialize(&mut *vault_account.data.borrow_mut())?;
        Ok(())
    }

    pub fn process_mint_tokens(
        accounts: &[AccountInfo],
        amount: u64,
        recipient: &Pubkey,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let vault = next_account_info(accounts_iter)?;
        let token_mint = next_account_info(accounts_iter)?;
        let recipient_ata = next_account_info(accounts_iter)?;
        
        // Read vault state
        let mut vault_data = TokenVault::try_from_slice(&vault.data.borrow())?;
        
        // Check if mint is allowed based on collateral
        let max_tokens = vault_data.collateral.checked_mul(vault_data.min_collateral_ratio)
            .ok_or(ProgramError::Overflow)?;
        if vault_data.tokens_issued.checked_add(amount).unwrap() > max_tokens {
            return Err(ProgramError::InsufficientFunds);
        }
        
        // Mint tokens
        invoke_signed(
            &spl_token::instruction::mint_to(
                token_program.key,
                token_mint.key,
                recipient_ata.key,
                vault.key,
                &[],
                amount,
            )?,
            &[token_mint.clone(), recipient_ata.clone(), vault.clone()],
            &[&[b"vault", &[bump_seed]]],
        )?;
        
        // Update vault state
        vault_data.tokens_issued = vault_data.tokens_issued.checked_add(amount)
            .ok_or(ProgramError::Overflow)?;
        vault_data.serialize(&mut *vault.data.borrow_mut())?;
        
        Ok(())
    }
    pub fn process_deposit_collateral(
        accounts: &[AccountInfo],
        amount: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let vault = next_account_info(accounts_iter)?;
        let vault_collateral_account = next_account_info(accounts_iter)?;
        let depositor_collateral_account = next_account_info(accounts_iter)?;
        let depositor = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;

        // Verify depositor is signer
        if !depositor.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Transfer collateral tokens to vault's token account
        invoke(
            &spl_token::instruction::transfer(
                token_program.key,
                depositor_collateral_account.key,
                vault_collateral_account.key,
                depositor.key,
                &[],
                amount,
            )?,
            &[
                depositor_collateral_account.clone(),
                vault_collateral_account.clone(),
                depositor.clone(),
            ],
        )?;

        // Update vault state
        let mut vault_data = TokenVault::try_from_slice(&vault.data.borrow())?;
        vault_data.collateral = vault_data.collateral.checked_add(amount)
            .ok_or(ProgramError::Overflow)?;
        vault_data.serialize(&mut *vault.data.borrow_mut())?;

        Ok(())
    }

    pub fn process_withdraw_collateral(
        accounts: &[AccountInfo],
        amount: u64,
        program_id: &Pubkey,
    ) -> ProgramResult {
        let accounts_iter = &mut accounts.iter();
        let vault = next_account_info(accounts_iter)?;
        let vault_collateral_account = next_account_info(accounts_iter)?;
        let receiver_collateral_account = next_account_info(accounts_iter)?;
        let owner = next_account_info(accounts_iter)?;
        let token_program = next_account_info(accounts_iter)?;

        // Verify owner is signer
        if !owner.is_signer {
            return Err(ProgramError::MissingRequiredSignature);
        }

        // Load and verify vault state
        let mut vault_data = TokenVault::try_from_slice(&vault.data.borrow())?;
        
        // Verify owner
        if vault_data.owner != *owner.key {
            return Err(ProgramError::InvalidAccountData);
        }

        // Check if withdrawal would break collateral ratio
        let remaining_collateral = vault_data.collateral.checked_sub(amount)
            .ok_or(ProgramError::InsufficientFunds)?;
        let required_collateral = vault_data.tokens_issued
            .checked_mul(vault_data.min_collateral_ratio)
            .ok_or(ProgramError::Overflow)?;
        if remaining_collateral < required_collateral {
            return Err(ProgramError::InsufficientFunds);
        }

        // Transfer collateral tokens from vault to receiver
        invoke_signed(
            &spl_token::instruction::transfer(
                token_program.key,
                vault_collateral_account.key,
                receiver_collateral_account.key,
                vault.key,
                &[],
                amount,
            )?,
            &[
                vault_collateral_account.clone(),
                receiver_collateral_account.clone(),
                vault.clone(),
            ],
            &[&[b"vault", &[bump_seed]]],
        )?;

        // Update vault state
        vault_data.collateral = remaining_collateral;
        vault_data.serialize(&mut *vault.data.borrow_mut())?;

        Ok(())
    }
}