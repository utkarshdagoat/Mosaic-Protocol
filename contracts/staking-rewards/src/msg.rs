use cosmwasm_schema::{cw_serde, QueryResponses};
use cosmwasm_std::{Addr, Uint128, Uint64};
use cw20::Cw20ReceiveMsg;
// use schemars::JsonSchema;
// use serde::{Deserialize, Serialize};

#[cw_serde]
pub struct InstantiateMsg {
    pub staking_token: String,
    pub reward_token: String,
    pub reward_rate: Uint64,
}

#[cw_serde]
pub enum ExecuteMsg {
    Stake { amount: Uint128 },
    Withdraw { amount: Uint128 },
    ClaimReward {},
    UpdateRewardRate { reward_rate: Uint64 },
    Receive(Cw20ReceiveMsg),
}

#[cw_serde]
#[derive(QueryResponses)]
pub enum QueryMsg {
    #[returns(ConfigResponse)]
    Config {},
    #[returns(UserInfoResponse)]
    UserInfo { user: String },
    #[returns(RewardInfoResponse)]
    RewardInfo { user: String },
    #[returns(RewardParametersResponse)]
    RewardParameters {},
}

#[cw_serde]
pub struct UserInfoResponse {
    pub staked_amount: Uint128,
}

#[cw_serde]
pub struct RewardInfoResponse {
    pub reward: Uint128,
}

#[cw_serde]
pub struct ConfigResponse {
    pub staking_token: Addr,
    pub reward_token: Addr,
    pub admin: Addr,
    pub reward_rate: Uint64,
}

#[cw_serde]
pub struct RewardParametersResponse {
    pub reward_rate: Uint64,
    pub last_update_time: Uint64,
}