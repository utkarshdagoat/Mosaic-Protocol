import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
  import { useStepper } from "../ui/stepper";
  import { Button } from "@/components/ui/button";
  import KycWrapper from "@/components/kyc/kyc-wrapper";
  
  export interface KycProps {
    hasCompletedAllSteps: boolean;
    setHasCompletedAllSteps: (value: React.SetStateAction<boolean>) => void;
  }
  
  export default function Kyc(props: KycProps) {
    const { nextStep } = useStepper();
  
    return (
      <>
        <Card className="bg-background border-none">
          <CardHeader>
            <CardTitle className="font-semibold">
              KYC Verification{" "}
              <span className="text-white/35">(for payments)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="text-muted-foreground">
              As per the financial guidelines, KYC is required to process your
              payments for our payment gateway.
            </p>
            <p className="text-muted-foreground">
              You are free to use the developer API, though for the payments, you
              need to complete your KYC (which can be done later as well).
            </p>
          </CardContent>
          <CardFooter className="flex gap-4 justify-end">
            <Button
              variant={"ghost"}
              onClick={() => {
                props.setHasCompletedAllSteps(true);
                nextStep();
              }}
            >
             {props.hasCompletedAllSteps ? "Continue" : "Do it later"} 
            </Button>
            <KycWrapper props={props}>
              <Button>Complete KYC</Button>
            </KycWrapper>
          </CardFooter>
        </Card>
      </>
    );
  }