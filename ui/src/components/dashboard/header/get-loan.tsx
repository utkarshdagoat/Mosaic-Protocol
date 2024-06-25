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

export default function GetLoan() {
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
            <Button variant={'ghost'} size={'icon'}><img src={leapLogo} /></Button>
          </div>

          <Button>Apply</Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
