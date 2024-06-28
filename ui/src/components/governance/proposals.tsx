import { Button } from "@/components/ui/button";
import { Plus, CheckCheckIcon, MoveRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardDescription,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Window as KeplrWindow } from "@keplr-wallet/types";
import { SigningArchwayClient, StdFee, Coin } from '@archwayhq/arch3.js';
import { ChainInfo } from "@/lib/chain";
import { useWalletStore } from "@/hooks/useStore";
import { useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface Window extends KeplrWindow { }
}


type Proposal = {
  title: string;
  description: string;
  hasVoted: boolean;
  yesCount: number;
  noCount: number;
  startTime?: Date;
  endTime?: Date;
};

export default function Proposals() {
  const sampleProposals: Proposal[] = [
    {
      title: "Proposal 1",
      description: "This is a description for proposal 1",
      hasVoted: false,
      yesCount: 72,
      noCount: 33,
      startTime: new Date(),
      endTime: new Date(),
    },
    {
      title: "Proposal 2",
      description: "This is a description for proposal 2",
      hasVoted: true,
      yesCount: 15,
      noCount: 88,
    },
    {
      title: "Proposal 3",
      description: "This is a description for proposal 3",
      hasVoted: false,
      yesCount: 47,
      noCount: 62,
    },
    {
      title: "Proposal 3",
      description: "This is a description for proposal 3",
      hasVoted: false,
      yesCount: 47,
      noCount: 62,
    },
  ];
  const { walletAddress } = useWalletStore()
  

  const ProposasQuery = async () => {

    if (window.keplr && walletAddress) {
      const offlineSigner = window.keplr.getOfflineSigner(ChainInfo.chainId);
      const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      const CONTRACT_ADDRESS = import.meta.env.VITE_GOVERNANCE_CONTRACT;

      let entrypoint = {
        get_proposals: {}
      }

      let tx = await CosmWasmClient.queryContractSmart(CONTRACT_ADDRESS, entrypoint);
      console.log("proposals", tx)
      if (tx.length > 0) {
        console.log("here")
        for (let i = 0; i < tx.length; i++) {
          let role = tx[i][1]
          let address = tx[i][0]
        }
      }
    }
  }


  useEffect(() => {
    ProposasQuery()
  }, [walletAddress])
  return (
    <div className="pr-4 pt-4">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-semibold">Proposals</h1>
        <AddProposal />
      </div>
      <div className="space-y-4 mt-4">
        {sampleProposals.map((proposal) => (
          <ProposalCard key={proposal.title} proposal={proposal} />
        ))}
      </div>
    </div>
  );
}

function AddProposal() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const {walletAddress} = useWalletStore()
  const {toast} = useToast()
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //TODO: Add proposal to the governance
    e.preventDefault();


    e.preventDefault();
    if (window.keplr && walletAddress) {
      const offlineSigner = window.keplr.getOfflineSigner(ChainInfo.chainId);
      const CosmWasmClient = await SigningArchwayClient.connectWithSigner(ChainInfo.rpc, offlineSigner);
      const CONTRACT_ADDRESS = import.meta.env.VITE_GOVERNANCE_CONTRACT;

      let entrypoint = {
        create_proposal: {
          desc:description,
          title 
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
        console.log(error)
        toast({
          title: "Error",
          description: "Error creating proposal check your funds",
          variant:"destructive"
        });
      } 
    }
  };

  return (
    <Dialog>
      <DialogTrigger>
        {" "}
        <Button size={"icon"} className="rounded-full">
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a proposal</DialogTitle>
          <DialogDescription>
            You can add a proposal to the governance.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <Label htmlFor="title">Title</Label>
            <input
              id="title"
              type="text"
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Proposal title"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <textarea
              id="description"
              className="w-full border rounded-md p-2 text-sm"
              placeholder="Proposal description (a one liner to describe the proposal)"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button size={"default"} className="mt-4">
            Add Proposal
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="space-y-1">
            <CardTitle className="text-muted-foreground brightness-[60%]">
              {proposal.title}
            </CardTitle>
            <CardDescription>{proposal.description}</CardDescription>
          </div>
          {proposal.hasVoted ? (
            <span className="inline-flex font-semibold text-muted-foreground">
              <CheckCheckIcon className="w-8 text-primary" />
              Voted{" "}
            </span>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="inline-flex items-center gap-4"
            >
              <RadioGroup className="inline-flex gap-4">
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="yes" id="yes" />
                  <Label htmlFor="yes">Yes</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="no" id="no" />
                  <Label htmlFor="no">No</Label>
                </div>
              </RadioGroup>
              <Button size={"iconSm"} className="rounded-full">
                <CheckCheckIcon className="w-4" />
              </Button>
            </form>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <VoteChart yesCount={proposal.yesCount} noCount={proposal.noCount} />
        {proposal.startTime && proposal.endTime && (
          <TimeLine startTime={proposal.startTime} endTime={proposal.endTime} />
        )}
      </CardContent>
    </Card>
  );
}

function VoteChart({
  yesCount,
  noCount,
}: {
  yesCount: number;
  noCount: number;
}) {
  const yesPercentage =
    ((yesCount / (yesCount + noCount)) * 100).toFixed(0) + "%";
  const noPercentage =
    ((noCount / (yesCount + noCount)) * 100).toFixed(0) + "%";
  console.log(yesPercentage);
  console.log(noPercentage);
  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="w-50 border p-4 rounded-sm">
        <p className="inline-flex font-semibold gap-2">
          Yes <MoveRight className="w-4" /> {yesCount}{" "}
          <span className="text-muted-foreground">({yesPercentage})</span>
        </p>
      </div>
      <div className="w-50 border p-4 rounded-sm">
        <p className="inline-flex font-semibold gap-2">
          No <MoveRight className="w-4" /> {noCount}{" "}
          <span className="text-muted-foreground">({noPercentage})</span>
        </p>
      </div>
    </div>
  );
}

function TimeLine({ startTime, endTime }: { startTime: Date; endTime: Date }) {
  return (
    <div className="flex items-center justify-center font-medium bg-accent text-muted-foreground p-2 rounded-md gap-2">
      {startTime.toLocaleString()} <MoveRight /> {endTime.toLocaleString()}
    </div>
  );
}
