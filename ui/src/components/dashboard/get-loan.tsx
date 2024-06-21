import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import leapLogo from "@/assets/leap.png"
import { SigningArchwayClient } from '@archwayhq/arch3.js';


export function GetLoan() {
  const ChainInfo = { chainId: 'constantine-3', chainName: 'Constantine Testnet', rpc: 'https://rpc.constantine.archway.io', rest: 'https://api.constantine.archway.io', stakeCurrency: { coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 }, bip44: { coinType: 118 }, bech32Config: { bech32PrefixAccAddr: 'archway', bech32PrefixAccPub: 'archwaypub', bech32PrefixValAddr: 'archwayvaloper', bech32PrefixValPub: 'archwayvaloperpub', bech32PrefixConsAddr: 'archwayvalcons', bech32PrefixConsPub: 'archwayvalconspub', }, currencies: [{ coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 }], feeCurrencies: [{ coinDenom: 'CONST', coinMinimalDenom: 'aconst', coinDecimals: 18 }], coinType: 118, gasPriceStep: { low: 0, average: 0.1, high: 0.2 }, features: ['cosmwasm'], };
  async function connectKeplrWallet(chainName, chainRpcUrl, chainId) {
    if (typeof window.keplr === 'undefined') {
      console.warn('Keplr wallet not found. Please install Keplr first.');
      return;
    }

    if (typeof window.keplr.experimentalSuggestChain === 'function') {
      try {
        await window.keplr.experimentalSuggestChain({
          chainId: chainId,
          chainName: chainName,
          rpcUrl: chainRpcUrl,
        });
      } catch (error) {
        console.warn('Error suggesting chain:', error);
      }
    }

    // Enable Keplr for the chain
    try {
      await window.keplr.enable(chainId);
      console.log(`Keplr enabled for chain: ${chainName}`);
    } catch (error) {
      console.error('Error enabling Keplr:', error);
      return;
    }

    let offlineSigner;
    try {
      offlineSigner = await window.getOfflineSignerAuto(chainId);
    } catch (error) {
      console.error('Error getting Keplr signer:', error)
      return;
    }
    const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
    const accounts = await offlineSigner.getAccounts();
    const queryHandler = CosmWasmClient.queryContractSmart;
    console.log('Wallet connected', { offlineSigner: offlineSigner, CosmWasmClient: CosmWasmClient, accounts: accounts, chain: ChainInfo, queryHandler: queryHandler, });
  }
  return (
    <>
      <Dialog>
        <DialogTrigger>
          <Button>Get Loan</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Get a Loan</DialogTitle>
          </DialogHeader>
          <Label className="text-muted-foreground" htmlFor="amount" />
          <Input
            id="amount"
            name="amount"
            placeholder="Enter Loan Amount (USDC)"
          />
          <Input
            id="time"
            placeholder="Enter time period for the loan (say 5 months)"
          />
          <p className="text-xs mt-2 text-muted-foreground">Select the loan type</p>
          <div className="flex flex-row gap-2">
            <Button variant="secondary" className="flex-1">Fixed</Button>
            <Button variant="secondary" className="flex-1">Dynamic</Button>
          </div>

          <div className="flex flex-row gap-2">
            <Input className="flex-1" placeholder="Your wallet Address"></Input>
            <Button variant={'ghost'} size={'icon'} onClick={connectKeplrWallet}><img src={leapLogo} /></Button>
          </div>

          <Button>Apply</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
