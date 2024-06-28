use std::ops::Add;

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use cosmwasm_schema::cw_serde;
use cosmwasm_std::{Addr, Timestamp, Uint128};
use cw_storage_plus::{Item, Map};


#[cw_serde]
pub enum MemeberType {
    Core,
    Creater,
    Staker,
    Dev
}

pub const  MEMBERS: Map<Addr,MemeberType> = Map::new("members");


#[cw_serde]
pub struct Proposal {
    pub id:Uint128,
    pub creator: Addr,
    pub description:String,
    pub vote_count_yes:Uint128,
    pub vote_count_no:Uint128,
    pub voters:Vec<Addr>,
    pub start_time:u64,
    pub end_time:u64,
    pub title: String
}

#[cw_serde]
pub struct  TokenInfo{
    pub token_denom: String,
    pub token_address: Addr

}
pub const TOKEN_INFO: Item<TokenInfo> = Item::new("token_info");



pub const PROPOSALS: Map<u128,Proposal> = Map::new("proposal");
pub const PROPOSAL_COUNT: Item<Uint128> = Item::new("proposal_length"); 
