import { Step, Stepper, type StepItem } from "@/components/ui/stepper";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import SignUp from "./sign-up";
import VerifyOtp from "./verify-otp";
import Kyc from "./kyc";

import signupImg from "@/assets/onboard/signup.svg";
import verificationImg from "@/assets/onboard/verification.svg";
import kycImg from "@/assets/onboard/kyc.svg";

import { useState } from "react";
import { Link } from "react-router-dom";

export default function OnboardStepper() {
  const steps = [
    { label: "Sign Up" },
    { label: "Verification" },
    { label: "KYC" },
  ] satisfies StepItem[];

  const stepMetadata = [
    { label: "Welcome to Mosaic Protocol!", img: signupImg },
    { label: "Let's verify your email!", img: verificationImg },
    { label: "Complete KYC to Start!", img: kycImg },
  ];

  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [hasCompletedAllSteps, setHasCompletedAllSteps] = useState(false);
  console.log("hasCompletedAllSteps", hasCompletedAllSteps);

  return (
    <div className="flex w-full h-screen gap-4">
      <div className="w-[40%] flex items-center border-r flex-col justify-center">
        <p className="text-3xl mb-6 font-medium">
          {stepMetadata[step].label}
        </p>
        <img src={stepMetadata[step].img} className="h-[300px]" alt="Sign Up" />
      </div>
      <div className="flex flex-col gap-4 w-[56%] my-0 ms-auto justify-center align-center">
        <Stepper
          initialStep={0}
          steps={steps}
          
          className="w-[60%] justify-start"
        >
          {steps.map(({ label }, index) => {
            return (
              <Step key={label} label={label}>
                <div className="w-[64%] h-[20rem]">
                  {index == 0 && (
                    <SignUp
                      email={email}
                      setEmail={setEmail}
                      step={step}
                      setStep={setStep}
                    />
                  )}
                  {index == 1 && !hasCompletedAllSteps && (
                    <VerifyOtp email={email} step={step} setStep={setStep} />
                  )}
                  {index == 2 && !hasCompletedAllSteps && (
                    <div className="w-full flex justify-center-align-center">
                      <Kyc
                        hasCompletedAllSteps={hasCompletedAllSteps}
                        setHasCompletedAllSteps={setHasCompletedAllSteps}
                      />
                    </div>
                  )}
                </div>
              </Step>
            );
          })}
          {hasCompletedAllSteps && (
            <Card className="bg-background w-[64%] h-[20rem] border-none">
              <CardHeader>
                <CardTitle>You are now ready to use Mosaic Protocol!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  You have completed all the steps required to use Mosaic. Now
                  login into the dashboard.
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Link to="/login">
                  <Button size={"lg"}>Login</Button>
                </Link>
              </CardFooter>
            </Card>
          )}
        </Stepper>
      </div>
    </div>
  );
}
