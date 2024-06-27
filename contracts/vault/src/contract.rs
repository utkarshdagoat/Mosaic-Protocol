#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{
    coins, to_binary, Addr, BankMsg, Coin, Deps, DepsMut, Env, MessageInfo, QueryResponse,
    Response, StdError, Uint128,
};
use cw2::set_contract_version;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg, InstantiateMsg, QueryMsg};
use crate::state::*;

// version info for migration info
const CONTRACT_NAME: &str = "crates.io:token-vault";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");
const ONE_INT: Uint128 = Uint128::one();

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    _info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    /* Instantiating the state that will be stored to the blockchain */
    let total_supply = Uint128::zero();
    let token_info = TokenInfo {
        token_denom: msg.token_symbol,
        token_address: msg.token_contract_address,
    };
    // Save the stete in deps.storage which creates a storage for contract data on the blockchain.
    TOTAL_SUPPLY.save(deps.storage, &total_supply)?;
    TOKEN_INFO.save(deps.storage, &token_info)?;

    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION).unwrap();

    Ok(Response::new()
        .add_attribute("method", "instantiate")
        .add_attribute("total_supply", total_supply))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::Deposit {
            amount_out_collateral,
        } => execute::execute_deposit(deps, env, info, amount_out_collateral.into()),
        ExecuteMsg::Withdraw {
            amount_in_collateral,
            amount_out_collateral,
        } => {
            execute::execute_withdraw(deps, env, info, amount_in_collateral, amount_out_collateral)
        }
    }
}
pub mod execute {
    use cosmwasm_std::{CosmosMsg, WasmQuery};

    use super::*;
    //Amount to deposit based on the time period and the amount of loan the person wants to take along with the collateralization ratio
    pub fn amount_to_deposit(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        amount: Uint128,
    ) -> Result<Uint128, ContractError> {
        Ok(Uint128::new(10))
    }

    // Share represent the mUSD or USDC we have to return in exchange of the CONST the person has deposited in the vault
    pub fn execute_deposit(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        amount_out_collateral: u128, // Amount in const
    ) -> Result<Response, ContractError> {
        let token_info = TOKEN_INFO.load(deps.storage)?;

        let mut total_supply = TOTAL_SUPPLY.load(deps.storage)?;
        total_supply += cosmwasm_std::Uint128::from(amount_out_collateral);
        TOTAL_SUPPLY.save(deps.storage, &total_supply)?;

        let mut balance = BALANCE_OF
            .load(deps.storage, info.sender.clone())
            .unwrap_or(Uint128::zero());
        balance += cosmwasm_std::Uint128::from(info.funds[0].amount);
        BALANCE_OF.save(deps.storage, info.sender.clone(), &balance)?;

        let mut debt_incurred = DEBT_INCURRED
            .load(deps.storage, info.sender.clone())
            .unwrap_or(Uint128::zero());
        debt_incurred += cosmwasm_std::Uint128::from(amount_out_collateral);
        DEBT_INCURRED.save(deps.storage, info.sender.clone(), &debt_incurred)?;

        let transfer_from_msg = cw20::Cw20ExecuteMsg::Mint {
            recipient: info.sender.to_string(),
            amount: amount_out_collateral.into(),
        };

        let msg = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: token_info.token_address.to_string(),
            msg: to_binary(&transfer_from_msg)?,
            funds: info.funds,
        });

        Ok(Response::new()
            .add_attribute("action", "deposit")
            .add_message(msg))
    }

    pub fn execute_withdraw(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        amount_in_collateral: Uint128, // My stable coin
        amount_out_collateral: Uint128,  // CONST
    ) -> Result<Response, ContractError> {
        let token_info = TOKEN_INFO.load(deps.storage)?;
        let mut total_supply = TOTAL_SUPPLY.load(deps.storage)?;
        if total_supply < amount_in_collateral {
            return Err(ContractError::UnsufficentFunds {
                user: info.sender.clone(),
                amount: amount_in_collateral,
            });
        }
        total_supply -= amount_in_collateral;
        TOTAL_SUPPLY.save(deps.storage, &total_supply)?;

        let mut balance = BALANCE_OF.load(deps.storage, info.sender.clone()).unwrap();
        if balance < amount_out_collateral {
            return Err(ContractError::UnsufficentFunds {
                user: info.sender.clone(),
                amount: amount_out_collateral,
            });
        }
        balance -= amount_out_collateral;
        BALANCE_OF.save(deps.storage, info.sender.clone(), &balance)?;

        let mut debt_incured = DEBT_INCURRED
            .load(deps.storage, info.sender.clone())
            .unwrap_or(Uint128::zero());
        if debt_incured < amount_in_collateral {
            return Err(ContractError::UnsufficentFunds {
                user: info.sender.clone(),
                amount: amount_in_collateral,
            });
        }
        debt_incured -= amount_in_collateral;
        DEBT_INCURRED.save(deps.storage, info.sender.clone(), &debt_incured)?;

        // Burn the stablecoin
        let transfer_msg = cw20::Cw20ExecuteMsg::BurnFrom {
            owner: info.sender.to_string(),
            amount: amount_in_collateral,
        };

        let msg = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: token_info.token_address.to_string(),
            msg: to_binary(&transfer_msg)?,
            funds: info.funds,
        });

        const MULTIPLIER: u128 = 1000000;
        let mut total_amount: u128 = amount_in_collateral.into();
        total_amount = total_amount * MULTIPLIER;
        // Transfer the funds from contract to user
        let transfer_const = BankMsg::Send {
            to_address: info.sender.clone().to_string(),
            amount: coins(total_amount, "uconst"),
        };

        Ok(Response::new()
            .add_attribute("action", "withdraw")
            .add_message(msg)
            .add_message(transfer_const))
    }

    pub fn get_token_balance_of(
        deps: &DepsMut,
        user_address: Addr,
        cw20_contract_addr: Addr,
    ) -> Result<Uint128, ContractError> {
        let query_msg = cw20::Cw20QueryMsg::Balance {
            address: user_address.to_string(),
        };
        let msg = deps
            .querier
            .query(&cosmwasm_std::QueryRequest::Wasm(WasmQuery::Smart {
                contract_addr: cw20_contract_addr.to_string(),
                msg: to_binary(&query_msg)?,
            }))?;

        Ok(msg)
    }
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> Result<QueryResponse, StdError> {
    match msg {
        QueryMsg::GetTotalSupply {} => query::get_total_supply(deps),
        QueryMsg::GetBalanceOf { address } => query::get_balance_of(deps, address),
        QueryMsg::GetStakeOnDeposit {
            address,
            timePeriod,
        } => query::get_stake_on_deposit(deps, address, timePeriod),
        QueryMsg::GetDynamicInterstRates { address } => {
            query::get_dyanamic_interest_rates(deps, address)
        }
        QueryMsg::GetFixedInterstRates {} => query::get_fixed_interest_ratio(deps),
    }
}

pub mod query {

    use core::time;

    use super::*;

    pub fn get_stake_on_deposit(
        deps: Deps,
        addr: Addr,
        time_period: Uint128,
    ) -> Result<QueryResponse, StdError> {
        let token_info = TOKEN_INFO.load(deps.storage)?;
        let mut balance = BALANCE_OF
            .load(deps.storage, addr.clone())
            .unwrap_or(Uint128::zero());
        //let balance_of=get_token_balance_of(&deps, info.sender.clone(), token_info.token_address.clone())?;
        //time period should be in months
        let const_ratio = Uint128::one();
        let amount = balance / TOTAL_SUPPLY.load(deps.storage)? * time_period * const_ratio;
        let reward = amount / time_period;
        to_binary(&reward)
        //this returns the total stake we would have to give to the person out of the total balance we have in our vault, if he deposited the tokens for one month based on time period the person has submitted us
        //now we can use the archaway js to simply return the value of stake we would have to send him when he pays the loan for that month
        // we can give him the stake in the form of tokens he submitted us.
        // also can setup a constant here to get a proper value I have set it to 1 for now
    }

    pub fn get_dyanamic_interest_rates(deps: Deps, addr: Addr) -> Result<QueryResponse, StdError> {
        let token_info = TOKEN_INFO.load(deps.storage)?;
        let mut balance = BALANCE_OF
            .load(deps.storage, addr.clone())
            .unwrap_or(Uint128::zero());
        //let balance_of=get_token_balance_of(&deps, info.sender.clone(), token_info.token_address.clone())?;
        let contribution = balance / TOTAL_SUPPLY.load(deps.storage)?;
        //aise to ye har baar zero aajega as int hona chaahiye
        // this represents the contribution of the user in the total balance of the vault
        // from this contribution we can calcualte the dyanamic rate , and it will change with the time period(each month simply)
        //here lambda would represent the long term average of the contribution of the user in the total balance of the vault
        //Here we can take a pretty good approximation of considering the contribution variable to follow the bernoulli distribution for the case when our lambda is 1/2
        // * links to  distribution and how to calculate the rate of interest based on the bernoulli distribution *
        //also if the contirbution value becomes very small then we can also take that value to be as
        // now overcome this distribution challenge as we would want the person to get the interest rate according to his contribution , we would have to take a factor that negates the e^-lambda part of the poisson distribution
        // or we can simplify it to as 1 + lambda + lambda^2/2
        // so we take this as a dyanamic interest curve according to which we give the interest rate for each person
        // now simply our interest owuld be a constant that we choose (example 8%) * (the ratio of the curve and the poisson ditribution value )
        //where the lambda would be replaced by the contribution value of the user
        // this wont be applicable for the starting users though as we would have to take the average of the contribution of the users in the vault
        // and then we can give the interest rate to the users based on the curve we have chosen

        let dyanamic_interest_ratio = Uint128::new(10);
        to_binary(&dyanamic_interest_ratio)
        // abhi constant bhej rha hun wahan js mei sahi krna hai iss calculation ko , kyonki yahan saara int mei ho rha hai
    }

    pub fn get_fixed_interest_ratio(deps: Deps) -> Result<QueryResponse, StdError> {
        to_binary(&FIXED_RATE.load(deps.storage).unwrap_or(Uint128::new(10)))
    }

    pub fn get_total_supply(deps: Deps) -> Result<QueryResponse, StdError> {
        let total_supply = TOTAL_SUPPLY.load(deps.storage)?;

        to_binary(&total_supply)
    }

    pub fn get_balance_of(deps: Deps, addr: Addr) -> Result<QueryResponse, StdError> {
        let balance_of = BALANCE_OF.load(deps.storage, addr)?;

        to_binary(&balance_of)
    }
}

// #[cfg(test)]
// mod tests {
//     use cosmwasm_std::{
//         coins,
//         testing::{mock_dependencies, mock_env, mock_info},
//         Addr, StdError, Uint128,
//     };

//     use crate::{
//         contract::{execute, instantiate},
//         msg::{ExecuteMsg, InstantiateMsg},
//         ContractError,
//     };

//     #[test]
//     fn test_instantiate() {
//         let mut deps = mock_dependencies();

//         let msg = InstantiateMsg {
//             token_symbol: "ABC".to_string(),
//             token_contract_address: Addr::unchecked("abcdef"),
//         };
//         let info = mock_info("creator", &coins(1000, "earth"));

//         // we can just call .unwrap() to assert this was a success
//         let res = instantiate(deps.as_mut(), mock_env(), info, msg);
//         assert!(res.is_ok());

//         // Assert the response contains the expected attributes
//         let response = res.unwrap();
//         assert_eq!(response.attributes.len(), 2);
//         assert_eq!(response.attributes[0].key, "method");
//         assert_eq!(response.attributes[0].value, "instantiate");
//         assert_eq!(response.attributes[1].key, "total_supply");
//         assert_eq!(response.attributes[1].value, Uint128::zero().to_string());
//     }

//     #[test]
//     fn test_execute_receive() {
//         let mut deps = mock_dependencies();
//         let info = mock_info("sender", &[]);

//         let msg = InstantiateMsg {
//             token_symbol: "ABC".to_string(),
//             token_contract_address: Addr::unchecked("abcdef"),
//         };
//         // we can just call .unwrap() to assert this was a success
//         let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg);
//         assert!(res.is_ok());

//         // Assert the response contains the expected attributes
//         let response = res.unwrap();
//         assert_eq!(response.attributes.len(), 2);
//         assert_eq!(response.attributes[0].key, "method");
//         assert_eq!(response.attributes[0].value, "instantiate");
//         assert_eq!(response.attributes[1].key, "total_supply");
//         assert_eq!(response.attributes[1].value, Uint128::zero().to_string());

//         let msg = ExecuteMsg::Deposit {
//             amount: Uint128::new(10),
//         };
//         let err = execute(deps.as_mut(), mock_env(), info, msg).unwrap_err();

//         assert_eq!(
//             err,
//             ContractError::Std(StdError::GenericErr {
//                 msg: "Querier system error: No such contract: abcdef".to_string()
//             })
//         );
//     }

//     #[test]
//     fn test_execute_withdraw() {
//         let mut deps = mock_dependencies();
//         let info = mock_info("sender", &[]);

//         let msg = InstantiateMsg {
//             token_symbol: "ABC".to_string(),
//             token_contract_address: Addr::unchecked("abcdef"),
//         };
//         // we can just call .unwrap() to assert this was a success
//         let res = instantiate(deps.as_mut(), mock_env(), info.clone(), msg);
//         assert!(res.is_ok());

//         // Assert the response contains the expected attributes
//         let response = res.unwrap();
//         assert_eq!(response.attributes.len(), 2);
//         assert_eq!(response.attributes[0].key, "method");
//         assert_eq!(response.attributes[0].value, "instantiate");
//         assert_eq!(response.attributes[1].key, "total_supply");
//         assert_eq!(response.attributes[1].value, Uint128::zero().to_string());

//         let msg = ExecuteMsg::Withdraw {
//             shares: Uint128::new(10),
//         };
//         let err = execute(deps.as_mut(), mock_env(), info, msg).unwrap_err();

//         assert_eq!(
//             err,
//             ContractError::Std(StdError::GenericErr {
//                 msg: "Querier system error: No such contract: abcdef".to_string()
//             })
//         );
//     }
// }
