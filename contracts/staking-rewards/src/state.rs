
use cosmwasm_schema::cw_serde;

use cosmwasm_std::{Addr, Uint128, Uint64};
use cw_storage_plus::{Item, Map};

#[cw_serde]
pub struct Config {
    pub staking_token: Addr,
    pub reward_token: Addr,
    pub admin: Addr,
    pub reward_rate: Uint64,
    pub last_update_time: Uint64,
    pub total_staked: Uint128,
}

impl Config {
    pub fn new(
        staking_token: Addr,
        reward_token: Addr,
        admin: Addr,
        reward_rate: Uint64,
    ) -> Config {
        Config {
            staking_token,
            reward_token,
            admin,
            reward_rate,
            last_update_time: Uint64::zero(),
            total_staked: Uint128::zero(),
        }
    }
}
#[cw_serde]
pub struct UserState {
    pub staked_amount: Uint128,
    pub reward: Uint128,
    pub reward_per_token_paid: Uint128,
}

impl Default for UserState {
    fn default() -> Self {
        UserState {
            staked_amount: Uint128::zero(),
            reward: Uint128::zero(),
            reward_per_token_paid: Uint128::zero(),
        }
    }
}

pub const CONFIG: Item<Config> = Item::new("config");
pub const USER_STATES: Map<Addr, UserState> = Map::new("user_states");