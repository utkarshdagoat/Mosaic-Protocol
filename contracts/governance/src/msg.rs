use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::Uint128;
use cosmwasm_std::{Addr };

use crate::state::{MemeberType, Proposal};


#[cw_serde]
pub struct InstantiateMsg {
    pub token_symbol: String,
    pub token_contract_address: Addr, 
}




#[cw_serde]
pub struct Proposals(pub Vec<Proposal>);

#[cw_serde]
pub struct  Members(pub Vec<(Addr,MemeberType)>);
#[cw_serde]


#[derive(QueryResponses)]
pub enum QueryMsg {
    // GetCount returns the current count as a json-encoded number
    #[returns((Uint128,Uint128))]
    GetVotersCount { id:Uint128},

    #[returns(Proposals)]
    GetProposals {},

    #[returns(Members)]
    GetMembers {}
}
#[cw_serde]
pub enum ExecuteMsg {
    CreateProposal {desc:String, title:String},
    Vote {id: Uint128, value: Uint128},
    JoinDao {MemberType: Uint128}
}
