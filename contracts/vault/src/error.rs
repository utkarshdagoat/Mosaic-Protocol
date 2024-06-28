use cosmwasm_std::{Addr, StdError, Uint128};
use thiserror::Error;

#[derive(Error, Debug,PartialEq)]
pub enum ContractError {
    #[error("{0}")]
    Std(#[from] StdError),

    #[error("Unauthorized")]
    Unauthorized {},

    #[error("Address not whitelisted")]
    NotWhitelisted {},

    #[error("To Do Error")]
    ToDo {},


    #[error("Unsufficent funds")]
    UnsufficentFunds {
        user:Addr,
        amount:Uint128
    }
}