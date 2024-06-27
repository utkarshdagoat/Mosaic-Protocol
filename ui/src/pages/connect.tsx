import { useToast } from "@/components/ui/use-toast";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useState } from "react";
import { SigningArchwayClient,StdFee , Coin} from '@archwayhq/arch3.js';
import { Button } from "@/components/ui/button";
declare global {
    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    interface Window extends KeplrWindow { }
}
const ChainInfo = {
    chainId: 'constantine-3',
    chainName: 'Constantine Testnet',
    rpc: 'https://rpc.constantine.archway.io',
    rest: 'https://api.constantine.archway.io',
    stakeCurrency: { coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 },
    bip44: { coinType: 118 },
    bech32Config: { beh32PrefixAccAddr: 'archway', bech32PrefixAccPub: 'archwaypub', bech32PrefixValAddr: 'archwayvaloper', bech32PrefixValPub: 'archwayvaloperpub', bech32PrefixConsAddr: 'archwayvalcons', bech32PrefixConsPub: 'archwayvalconspub', },
    currencies: [{ coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 }],
    feeCurrencies: [{ coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 }],
    coinType: 118,
    gasPriceStep: { low: 0, average: 0.1, high: 0.2 },
    features: ['cosmwasm'],
};
export default function Connect() {
    const [walletAddress, setWalletAddress] = useState("")
    const { toast } = useToast()
    const connectWalletHandle = async () => {
        const chainId = ChainInfo.chainId;
        if (!window.keplr) {
            toast({
                description: "Please install Keplr wallet to proceed",
            });
        } else {
            await window.keplr.enable(chainId);
            const address = await window.keplr.getKey(chainId);
            setWalletAddress(address.bech32Address);
        }
    };

    const callContract = async () => {
        if(window.keplr){
            const offlineSigner =  window.keplr.getOfflineSigner(ChainInfo.chainId);
            const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
            const  accounts =  offlineSigner.getAccounts()
            const CONTRACT_ADDRESS = "archway1gxls4uu5fjgzyfley9uqq9c3a93k5juzc53kw9kkgu54kn02dq8smh8xl5";
            let entrypoint = {
               deposit:{
                amount_out_collateral:"10000000000000"
               } 
            }
            let funds : Coin[]= [{amount:BigInt(1 * (10**18)).toString(), denom:"aconst"}]
            let gas : StdFee = {
                amount: [{
                    amount:"300000000",
                    denom:"aconst"
                },
                ],
                gas:"3000000"
            }
            let tx = await CosmWasmClient.execute(walletAddress,CONTRACT_ADDRESS,entrypoint,gas,"memo",funds);
            console.log(tx)
        }
    }
    return (
        <>
            Wallet address : {walletAddress}
            <Button onClick={connectWalletHandle}>Click</Button>
            <Button onClick={callContract}>Call Contract</Button>
        </>
    )
}