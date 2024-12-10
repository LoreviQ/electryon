use solana_program::program_error::ProgramError;
use thiserror::Error;

#[derive(Error, Debug, Copy, Clone)]
pub enum GameTokenError {
    #[error("Invalid instruction")]
    InvalidInstruction,
    #[error("Invalid collateral ratio")]
    InvalidCollateralRatio,
    #[error("Invalid game signature")]
    InvalidGameSignature,
}

impl From<GameTokenError> for ProgramError {
    fn from(e: GameTokenError) -> Self {
        ProgramError::Custom(e as u32)
    }
}