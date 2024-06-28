use std::ops::Add;

use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128};

#[cw_serde]
pub struct InstantiateMsg {
    pub token_symbol: String,
    pub token_contract_address: Addr,
}
#[cw_serde]
pub enum ExecuteMsg {
    Deposit {
        amount_out_collateral: Uint128,
        amount_in_collateral:Uint128
    },
    Withdraw {
       amount_in_collateral: Uint128,
       amount_out_collateral: Uint128 
    },
    IncreaseAllowance{
        amount:Uint128
    }
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(Uint128)]
    GetTotalSupply {},

    #[returns(Uint128)]
    GetBalanceOf { address: Addr },

    #[returns(Uint128)]
    GetDynamicInterstRates { address: Addr ,amount:Uint128},

    #[returns(Uint128)]
    GetFixedInterstRates {},

    #[returns(Uint128)]
    GetRepayedDebt { address: Addr},

    #[returns(Uint128)]
    GetTotalDebt { address: Addr}
}
