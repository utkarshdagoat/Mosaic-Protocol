use cosmwasm_std::StdError;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},
    // Add any other custom errors you like here.
    // Look at https://docs.rs/thiserror/1.0.21/thiserror/ for details.
    #[error("Token Query Faled")]
    TokenQueryFailed {},

    #[error("Insufficent Funds for Vote")]
    InsufficientFundsVote {},

    #[error("Proposal Time Ended")]
    ProposalEnded {},

    #[error("Already voted")]
    AlreadyVoted {},

    #[error("Proposal not found")]
    ProposalNotFound {},
    #[error("Insufficient funds for proposal")]
    InsufficientFundsProposal {},

    #[error("Already Member")]
    AlreadyMember {},
    #[error("Invalid Member Type")]
    InvalidMemberType{},
}
