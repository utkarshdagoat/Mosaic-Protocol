#[cfg(not(feature = "library"))]
use cosmwasm_std::entry_point;
use cosmwasm_std::{to_binary, Binary, Deps, DepsMut, Env, MessageInfo, Response, StdResult, Uint128};
use cw2::set_contract_version;
use query::query_voters_count;

use crate::error::ContractError;
use crate::msg::{ExecuteMsg,  InstantiateMsg, QueryMsg};
use crate::state::{MemeberType, TokenInfo, MEMBERS, PROPOSAL_COUNT, TOKEN_INFO};
// version info for migration info
const CONTRACT_NAME: &str = "crates.io:governance";
const CONTRACT_VERSION: &str = env!("CARGO_PKG_VERSION");

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn instantiate(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: InstantiateMsg,
) -> Result<Response, ContractError> {
    let token_info = TokenInfo {
        token_denom: msg.token_symbol,
        token_address: msg.token_contract_address,
    }; 

    let proposal_count = Uint128::zero();
    PROPOSAL_COUNT.save(deps.storage, &proposal_count)?;

    let member = deps.api.addr_validate(&info.sender.to_string())?;
    MEMBERS.save(deps.storage, member, &MemeberType::Creater)?;

    TOKEN_INFO.save(deps.storage, &token_info)?;
    set_contract_version(deps.storage, CONTRACT_NAME, CONTRACT_VERSION).unwrap();
    
    Ok(Response::new()
        .add_attribute("method", "instantiate"))
}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn execute(
    deps: DepsMut,
    _env: Env,
    info: MessageInfo,
    msg: ExecuteMsg,
) -> Result<Response, ContractError> {
    match msg {
        ExecuteMsg::CreateProposal {desc,title} => execute::try_create_proposal(deps, _env, info, desc,title),
        ExecuteMsg::JoinDao { MemberType } => execute::try_join_dao(deps, _env,info,MemberType ),
        ExecuteMsg::Vote { id , value} => execute::try_vote(deps, _env, info, id , value),
    }
}

pub mod execute {
    use cosmwasm_std::{Addr, Coin, CosmosMsg, Uint128, WasmMsg, WasmQuery};
    use cw20::Cw20QueryMsg;
    use serde::de::value;

    use crate::state::{MemeberType, Proposal, MEMBERS, PROPOSALS, PROPOSAL_COUNT};

    use super::*;
    pub const CREATE_PROPOSAL_COST: Uint128 = Uint128::new(100000000000000000);
    pub const VOTE_COST: Uint128 = Uint128::new(100000000000000000);
    pub fn try_create_proposal(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        desc: String,
        title: String,
    ) -> Result<Response, ContractError> {
        // Ensure the user has enough tokens to create a proposal
        // let token_balance = query_token_balance(&deps, info.sender.clone())?;
        // if token_balance < CREATE_PROPOSAL_COST {
        //     return Err(ContractError::InsufficientFundsProposal {  } );
        // }
   
        let token_info =TOKEN_INFO.load(deps.storage)?;
         
        let transfer_msg = cw20::Cw20ExecuteMsg::BurnFrom {
            owner: info.sender.to_string(),
            amount: CREATE_PROPOSAL_COST,
        };

        let msg: CosmosMsg = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: token_info.token_address.to_string(),
            msg: to_binary(&transfer_msg)?,
            funds:info.funds,
        });
        let mut proposal_count = PROPOSAL_COUNT.load(deps.storage)?;
        proposal_count += Uint128::new(1);
    
        let proposal = Proposal{
            id: proposal_count,
            creator: info.sender.clone(),
            description: desc,
            vote_count_yes: Uint128::zero(),
            vote_count_no: Uint128::zero(),
            start_time: env.block.time.seconds(),
            end_time: env.block.time.seconds() + 604800,
            voters: Vec::new(),
            title   
        };
    
        PROPOSALS.save(deps.storage, proposal_count.into(), &proposal)?;
        PROPOSAL_COUNT.save(deps.storage, &proposal_count)?;
    
        Ok(Response::new()
            .add_message(msg)
            .add_attribute("method", "create_proposal")
            .add_attribute("proposal_id", proposal_count))
    }

    pub fn try_vote(
        deps: DepsMut,
        env: Env,
        info: MessageInfo,
        id: Uint128,
        value: Uint128,
    ) -> Result<Response, ContractError> {
        let mut proposal = 
        match PROPOSALS.load(deps.storage, id.into()) {
            Ok(proposal) => proposal,
            Err(_) => return Err(ContractError::ProposalNotFound {}),
        };

        let token_info =TOKEN_INFO.load(deps.storage)?;
        
    
        if env.block.time.seconds() > proposal.end_time {
            return Err(ContractError::ProposalEnded {});
        }
    
        if proposal.voters.iter().any(|v|v == info.sender.clone()) {
            return Err(ContractError::AlreadyVoted {});
        }
    
        // // Ensure the user has enough tokens to vote
        // let token_balance = query_token_balance(&deps, info.sender.clone())?;
        // if token_balance < VOTE_COST {
        //     return Err(ContractError::InsufficientFundsVote {  });
        // }
    
        let transfer_msg = cw20::Cw20ExecuteMsg::BurnFrom {
            owner: info.sender.to_string(),
            amount: VOTE_COST,
        };

        let msg: CosmosMsg = CosmosMsg::Wasm(cosmwasm_std::WasmMsg::Execute {
            contract_addr: token_info.token_address.to_string(),
            msg: to_binary(&transfer_msg)?,
            funds:info.funds,
        });

        // 0 -> No, 1 -> Yes
        if value == Uint128::from(1 as u32) {
            proposal.vote_count_yes += Uint128::new(1);
        }else{
            proposal.vote_count_no += Uint128::new(1);
        }
        
        proposal.voters.push(info.sender);
    
        PROPOSALS.save(deps.storage, id.into(), &proposal)?;
    
        Ok(Response::new()
            .add_message(msg)
            .add_attribute("method", "vote")
            .add_attribute("proposal_id", id))
    }

    // fn query_token_balance(deps: &DepsMut, addr: Addr) -> Result<Uint128, ContractError> {
    // let token_info = TOKEN_INFO.load(deps.storage)?;
    // let balance: Uint128 = deps
    //     .querier
    //     .query(&cosmwasm_std::QueryRequest::Wasm(WasmQuery::Smart {
    //         contract_addr: token_info.token_address.to_string(),
    //         msg: to_binary(&Cw20QueryMsg::Balance { address: addr.to_string() })?,
    //     }))
    //     .map_err(|_| ContractError::TokenQueryFailed {})?;

    // Ok(balance)
    // }


    pub fn try_join_dao(
        deps: DepsMut,
        _env: Env,
        info: MessageInfo,
        member_type: Uint128,
    ) -> Result<Response, ContractError> {
        if MEMBERS.may_load(deps.storage, info.sender.clone())?.is_some() {
            return Err(ContractError::AlreadyMember {});
        }
        if(member_type > Uint128::from(3 as u32)){
            return Err(ContractError::InvalidMemberType {});
        }

        let mut MemberType = MemeberType::Staker;
        if member_type == Uint128::from(1 as u32){
            MemberType = MemeberType::Core;
        }else if member_type == Uint128::from(2 as u32){
            MemberType = MemeberType::Dev;
        }else if member_type == Uint128::from(3 as u32){
            MemberType = MemeberType::Staker;   
        }

        let addr = deps.api.addr_validate(&info.sender.to_string())?;
        MEMBERS.save(deps.storage, addr, &MemberType)?;
    
        Ok(Response::new()
            .add_attribute("method", "join_dao")
            .add_attribute("member", info.sender.to_string()))
    }
    


    

}

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn query(deps: Deps, _env: Env, msg: QueryMsg) -> StdResult<Binary> {
    match msg {
        QueryMsg:: GetVotersCount { id } => query_voters_count(deps, id),
        QueryMsg::GetProposals {} => query::query_proposals(deps),
        QueryMsg::GetMembers {} => query::query_members(deps),
    }
}

pub mod query {
    use std::ops::Add;

    use cosmwasm_std::{Addr, Order, QueryResponse, StdError};

    use crate::{msg::{Members, Proposals}, state::{MemeberType, Proposal, MEMBERS, PROPOSALS }};

    use super::*;


    pub fn query_voters_count(deps: Deps, id: Uint128) -> Result<QueryResponse, StdError> {
        let proposal = PROPOSALS.load(deps.storage, id.into())?;
        to_binary(&(proposal.vote_count_yes, proposal.vote_count_no))
    }


    pub fn query_proposals(deps: Deps) -> Result<QueryResponse, StdError> {
        let keys : Result<Vec<_>,_>  = PROPOSALS.keys(deps.storage, None, None, Order::Ascending).collect();
        
        let proposals: Result<Vec<Proposal>,_> = keys?.into_iter().map(|key| {
            let id = key;
            PROPOSALS.load(deps.storage, id)
        }).collect();
        let proposals = proposals?;

        to_binary(&Proposals(proposals))
    }


    pub fn query_members(deps:Deps) -> Result<QueryResponse, StdError> {
        let members: Result<Vec<(Addr, MemeberType)>,StdError> = MEMBERS
            .range(deps.storage, None, None, Order::Ascending)
            .map(|item| {
                let (k, v) = item?;
                Ok((k, v))
            })
            .collect();
        to_binary(&Members(members?))
    }

}
