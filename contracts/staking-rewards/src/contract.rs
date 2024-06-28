#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult};
use cw2::set_contract_version;
// use cw2::set_contract_version;

use crate::error::ContractError;
use crate::execute::*;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::query::*;

use crate::state::{Config, CONFIG};

const CONTRACT_NAME: &str = "crates.io:cw-yield-farming";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let config = Config::new(
        deps.api.addr_validate(&msg.staking_token)?,
        deps.api.addr_validate(&msg.reward_token)?,
        info.sender.clone(),
        msg.reward_rate,
    );

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION)?;

    CONFIG.save(deps.storage, &config)?;

    Ok(Response::new()
        .add_attribute("action", "instantiate")
        .add_attribute("sender", info.sender))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    // use ExecuteMsg::*;
    match msg {
        ExecuteMsg::Stake { amount } => execute_stake(deps, env, info, amount),
        ExecuteMsg::Withdraw { amount } => execute_withdraw(deps, env, info, amount),
        ExecuteMsg::ClaimReward {} => execute_claim_reward(deps, env, info),
        ExecuteMsg::UpdateRewardRate { reward_rate } => {
            execute_update_reward_rate(deps, env, info, reward_rate)
        }
        ExecuteMsg::Receive(receive_msg) => execute_receive(deps, env, info, receive_msg),
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg::Config {} => query_config(deps),
        QueryMsg::UserInfo { user } => query_user_info(deps, user),
        QueryMsg::RewardInfo { user } => query_reward_info(deps, env, user),
        QueryMsg::RewardParameters {} => query_reward_parameters(deps),
    }
}