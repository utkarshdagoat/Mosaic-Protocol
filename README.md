# Mosaic Protocol

Welcome to Mosaic, a groundbreaking loan lending platform designed to unlock the potential of decentralized finance (DeFi) through innovative borrowing and lending solutions. At Mosaic, we empower users to leverage their assets and access financial services in a seamless, secure, and rewarding manner.

### <a href="https://mosaic-protocol.gitbook.io/mosaic"> See our documentation and user flow</a>
### See our pdf for implmentation of the dynamic Collateral <a href="https://github.com/utkarshdagoat/Mosaic-Protocol/blob/main/dynamic_collateral.pdf">here</a> 
### Developer Documentation and Contract Architecture

### Entry Points for `Vault Contract`
It can be found in <a href="https://github.com/utkarshdagoat/Mosaic-Protocol/blob/main/contracts/vault/src/contract.rs">here</a>
#### instantiate (Initialization)
**Arguments:**
- **InstantiateMsg:** A message containing the following fields:
  - **token_symbol:** String representing the symbol of the token accepted by the vault.
  - **token_contract_address:** String representing the address of the token contract on the blockchain.

**Return Value:**
- **Response object:** This object can contain various attributes, including:
  - **messages:** An array of Cosmos messages to be executed during contract instantiation (e.g., setting storage values).
  - **attributes:** Key-value pairs representing additional information about the instantiation process (e.g., total supply initialized).

## execute 
**Arguments:**
- **ExecuteMsg:** A message variant specifying the action to be performed. It can be one of the following:
  - **ExecuteMsg::Deposit { amount }:** Deposit a certain amount of tokens into the vault.
    - **amount:** Uint128 value representing the quantity of tokens to be deposited.
  - **ExecuteMsg::Withdraw { shares }:** Withdraw a specific number of shares and receive the corresponding tokens.
    - **shares:** Uint128 value representing the number of shares to be withdrawn.

## query
**Arguments:**
- **QueryMsg:** A message variant specifying the type of data to be retrieved. It can be one of the following:
  - **QueryMsg::GetTotalSupply {}:** Get the total supply of tokens currently deposited in the vault.
  - **QueryMsg::GetBalanceOf { address }:** Get the balance (number of shares) held by a specific address in the vault.
  - **QueryMsg::GetStakeOnDeposit { address, timePeriod } (Incomplete):** This function is intended to calculate the potential stake a user would receive based on their deposit and time period, but it's currently not implemented correctly.
    - **address:** String representing the address of the user querying the stake.
    - **timePeriod:** Uint128 value (likely intended to represent time in months).
  - **QueryMsg::GetDynamicInterstRates { address } (Incomplete):** This function is intended to calculate dynamic interest rates based on user contribution, but it's currently not implemented correctly.
    - **address:** String representing the address of the user querying the interest rate.
  - **QueryMsg::GetFixedInterstRates {}:** Get the fixed interest rate currently configured for the vault.