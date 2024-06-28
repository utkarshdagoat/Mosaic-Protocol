import { Button } from "@/components/ui/button";
import GetLoan from "./get-loan";
import TypingAnimation from "@/components/ui/typing-animation";
import { useUserStore, useWalletStore } from "@/hooks/useStore";
import { ChainInfo } from "@/lib/chain";
import { useToast } from "@/components/ui/use-toast";
import { Window as KeplrWindow } from "@keplr-wallet/types";
import { useEffect } from "react";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow {}
}

export default function DashboardHeader() {
  const { user } = useUserStore();
  const { walletAddress, setWalletAddress } = useWalletStore();
  const { toast } = useToast();

  const connectWalletHandle = async () => {
    const chainId = ChainInfo.chainId;
    if (!window.keplr) {
      toast({
        description: "Please install Keplr wallet to proceed",
      });
    } else {
      await window.keplr.enable(chainId);
      const address = await window.keplr.getKey(chainId);
      console.log(address);
      setWalletAddress(address.bech32Address);
    }
  };

  useEffect(() => {
    console.log("wallet", walletAddress);
  }, [walletAddress]);

  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-4xl inline-flex gap-2 text-foreground/80 font-mosaic">
        Hi{" "}
        <TypingAnimation
          className="text-primary"
          text={user?.email.split("@")[0] ? "" : walletAddress || "there"}
          // text={user?.email === undefined ? "" : user.email.split("@")[0]}
        />
      </h1>
      <div className="flex gap-6">
        <Button onClick={connectWalletHandle}>Connect Wallet</Button>
        <GetLoan />
      </div>
    </div>
  );
}
