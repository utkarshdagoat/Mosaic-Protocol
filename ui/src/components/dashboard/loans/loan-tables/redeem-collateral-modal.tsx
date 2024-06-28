import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { useState, useEffect } from "react";
import { useWalletStore } from "@/hooks/useStore";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningArchwayClient, StdFee, Coin } from '@archwayhq/arch3.js';
import { ChainInfo } from "@/lib/chain";
import { useToast } from "@/components/ui/use-toast";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow { }
}


const EXCHANGE_RATE_API = import.meta.env.VITE_EXCHANGE_RATE_API
const dataFetch = async () => {
  const res = await axios.get(EXCHANGE_RATE_API)
  const data = await res.data
  return data
}
export default function RedeemCollateralModal() {
  const {toast} = useToast();
  const [USDAmount, setUSDAmount] = useState(0)
  const [ArchAmount, setArchAmount] = useState(0)
  const { walletAddress } = useWalletStore()
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      const data = await dataFetch()
      const price = data.data.price;
      if (price) {
        setArchAmount(USDAmount / (price * 100))
      }
    }, 750)

    return () => clearTimeout(delayDebounceFn)
  }, [USDAmount])



  const handleSumbit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (window.keplr && walletAddress) {
      const offlineSigner = window.keplr.getOfflineSigner(ChainInfo.chainId);
      const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      const CONTRACT_ADDRESS = import.meta.env.VITE_VAULT_CONTRACT;

      let entrypoint = {
        withdraw: {
          amount_in_collateral: BigInt(USDAmount * 10 ** 10).toString(),
          amount_out_collateral: BigInt(ArchAmount*10 ** 18).toString()
        }
      }
      let funds: Coin[] = [{ amount: BigInt((0.01) * 10 ** 18).toString(), denom: "aconst" }]
      let gas: StdFee = {
        amount: [{
          amount: "300000000",
          denom: "aconst"
        },
        ],
        gas: "3000000"
      }
      try {
      let tx = await CosmWasmClient.execute(walletAddress,CONTRACT_ADDRESS,entrypoint, gas,"memo",funds);
      console.log(tx)
      toast({
        title: "Success",
        description: "txHash: " + tx.transactionHash,
      });
      } catch (error) {
        toast({
          title: "Error",
          description: "Error redeeming collateral",
          variant:"destructive"
        });
      } 
    }
  };

  
  return (
    <Dialog>
      <DialogTrigger>
        <Button variant={"outline"}>Redeem</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Redeem Collateral</DialogTitle>
        </DialogHeader>
        <form className="flex flex-col gap-4" onSubmit={handleSumbit}>
          <div>
            <Label>Amount $</Label>
            <Input
              type="number"
              placeholder="Repayment amount (in USD)"
              onChange={(e) => setUSDAmount(parseFloat(e.target.value))}
            />
          </div>
          <div className="bg-muted/40 border py-3 px-4 rounded-md flex justify-between">
            <h1 className="text-sm text-muted-foreground font-semibold">
              Collateral Reimbursed
            </h1>
            <div className="text-foreground inline-flex items-center gap-2 text-sm font-semibold">
              {ArchAmount} ARCH
            </div>
          </div>
          <Button type="submit">Redeem</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
