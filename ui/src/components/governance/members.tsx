import { useToast } from "../ui/use-toast";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningArchwayClient, StdFee, Coin } from '@archwayhq/arch3.js';
import { ChainInfo } from "@/lib/chain";
import { useWalletStore } from "@/hooks/useStore";
import { useEffect, useState } from "react";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow { }
}


type Member = {
  address: string;
  role: "creator" | "staker" | "dev";
};

export default function Members() {

  const { walletAddress } = useWalletStore()
  const [membersResult, setMembersResult] = useState<Member[]>([]);
  // const members: Member[] = [
  //   {
  //     address: "0x1a2B3C4d5E6F789A",
  //     role: "creator",
  //   },
  //   {
  //     address: "0xBcDeF0123456789A",
  //     role: "staker",
  //   },
  //   {
  //     address: "0x9876543210FEDCBA",
  //     role: "dev",
  //   },
  // ];

  const MembersQuery = async () => {
    if (window.keplr && walletAddress) {
      const offlineSigner = window.keplr.getOfflineSigner(ChainInfo.chainId);
      const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      const CONTRACT_ADDRESS = import.meta.env.VITE_GOVERNANCE_CONTRACT;

      let entrypoint = {
        get_members: {}
      }

      let tx = await CosmWasmClient.queryContractSmart(CONTRACT_ADDRESS, entrypoint);
      console.log(tx)
      if (tx.length > 0) {
        console.log("here")
        for (let i = 0; i < tx.length; i++) {
          let role = tx[i][1]
          let address = tx[i][0]
          if (membersResult.find((member) => member.address === address) === undefined ) {
            console.log("found")
            setMembersResult([...membersResult, { address, role }])
          }
        }
      }
    }
  }
  useEffect(() => {
    MembersQuery()
  }, [walletAddress])
  return (
    <div className="pt-4 ps-4 border-l">
      <h1 className="text-2xl font-semibold">Members</h1>
      <TooltipProvider>
        {membersResult.map((member) => (
          <div
            className="w-full flex items-center justify-between border rounded-md my-3 py-1 pr-2"
            key={member.address}
          >
            <Tooltip>
              <TooltipTrigger>
                <CopyAddress address={member.address} />
              </TooltipTrigger>
              <TooltipContent side="left">
                <p className="text-muted-foreground">{member.address}</p>
              </TooltipContent>
            </Tooltip>
            <MemberBadge role={member.role} />
          </div>
        ))}
      </TooltipProvider>
    </div>
  );
}

export function CopyAddress({ address }: { address: string }) {
  const truncatedAddress = `${address.slice(0, 4)}...${address.slice(-4)}`;
  const { toast } = useToast();
  return (
    <Button
      className="font-mono"
      size={"sm"}
      variant={"linkHover2"}
      onClick={() => {
        toast({
          description: "Address copied to clipboard",
        });
        navigator.clipboard.writeText(address);
      }}
    >
      {truncatedAddress}
    </Button>
  );
}

function MemberBadge({ role }: { role: Member["role"] }) {
  return (
    <div
      className={`${role === "creator"
          ? "bg-primary"
          : role === "staker"
            ? "bg-indigo-400"
            : "bg-emerald-400"
        } rounded-full px-2 w-20 text-center text-xs font-mono py-1 text-white`}
    >
      {role}
    </div>
  );
}
