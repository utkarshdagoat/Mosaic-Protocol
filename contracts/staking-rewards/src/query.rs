use crate::msg::*;
use crate::state::*;

use cosmwasm_std::{to_binary, Binary, Deps, Env, StdResult, Uint128, Uint64};

pub fn query_config(deps: Deps) -> StdResult<Binary> {
    let config: Config = CONFIG.load(deps.storage)?;
    to_binary(&config)
}

pub fn query_user_info(deps: Deps, user: String) -> StdResult<Binary> {
    let user_addr = deps.api.addr_validate(&user)?;

    let user_state = match USER_STATES.may_load(deps.storage, user_addr)? {
        Some(state) => state,
        None => UserState::default(),
    };

    let response = UserInfoResponse {
        staked_amount: user_state.staked_amount,
    };

    to_binary(&response)
}

pub fn query_reward_info(deps: Deps, env: Env, user: String) -> StdResult<Binary> {
    let user_addr = deps.api.addr_validate(&user)?;
    let config = CONFIG.load(deps.storage)?;
    let user_state = match USER_STATES.may_load(deps.storage, user_addr)? {
        Some(state) => state,
        None => UserState::default(),
    };

    let current_time: Uint64 = env.block.time.seconds().into();
    let time_since_last_update = current_time - config.last_update_time;

    let total_reward: Uint128 = (config.reward_rate * time_since_last_update).into();

    let reward_per_token = total_reward / config.total_staked;

    let user_unclaimed_reward = user_state.staked_amount * reward_per_token - user_state.reward;

    let response = RewardInfoResponse {
        reward: user_unclaimed_reward,
    };

    to_binary(&response)
}

pub fn query_reward_parameters(deps: Deps) -> StdResult<Binary> {
    let config: Config = CONFIG.load(deps.storage)?;
    let response = RewardParametersResponse {
        reward_rate: config.reward_rate,
        last_update_time: config.last_update_time,
    };

    to_binary(&response)
}