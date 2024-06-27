use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Uint128};
use cw_storage_plus::{Item, Map ,};


// Total supply of Musd minted
pub const TOTAL_SUPPLY: Item<Uint128> = Item::new("total_supply");
// Map of user addr => amount of const
pub const BALANCE_OF: Map<Addr,Uint128>=Map::new("balance_of");
// Map of user addr => (loanIndex => timePeriod)
pub const DEBT_INCURRED : Map<Addr,Uint128> = Map::new("debt_of");
// Map of user addr => (loanIndex => timePeriod)
pub const REPAYED : Map<Addr,Uint128> = Map::new("debt_of");
#[cw_serde]
pub struct  TokenInfo{
    pub token_denom: String,
    pub token_address: Addr

}

pub const TOKEN_INFO: Item<TokenInfo> = Item::new("token_info");
pub const FIXED_RATE: Item<Uint128> = Item::new("fixed_rate");
