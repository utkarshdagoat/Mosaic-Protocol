import DashboardHeader from "@/components/dashboard/header/dashboard-header";
import VacantState from "@/components/dashboard/vacant-state";
import OccupiedState from "@/components/dashboard/occupied-state";

import { useState } from "react";
import styles from './pages.module.css'
import {Button} from "@/components/ui/button"
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningArchwayClient, StdFee, Coin } from '@archwayhq/arch3.js';
import { ChainInfo } from "@/lib/chain";
import { useWalletStore } from "@/hooks/useStore";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow { }
}
export default function Dashboard() {
  const [vacant, setVacant] = useState(false);
  const {walletAddress} = useWalletStore();
  const callContract = async () => {
    if (window.keplr && walletAddress) {
      const offlineSigner = window.keplr.getOfflineSigner(ChainInfo.chainId);
      const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      const CONTRACT_ADDRESS = import.meta.env.VITE_VAULT_CONTRACT;
      const TOKEN_CONTRACT = import.meta.env.VITE_TOKEN_CONTRACT;

      let entrypoint = {
        withdraw: {
          amount_in_collateral: BigInt(5 * 10 ** 10).toString(),
          amount_out_collateral: BigInt(1* 10**17).toString()
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

      let tx = await CosmWasmClient.execute(walletAddress,CONTRACT_ADDRESS,entrypoint, gas,"memo",funds);
      console.log(tx)

    }
  }
  return (
    <>
      <div className={`max-w-[64rem] w-80% h-screen space-y-8 mx-auto py-4 px-8 lg:px-4 ${styles.sleek_scrollbar}`}>
        <DashboardHeader />
        <Button onClick={callContract}>Reddem</Button>
        {vacant ? <VacantState /> : <OccupiedState />}
      </div>
    </>
  );
}
