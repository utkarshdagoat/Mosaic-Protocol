import GetLoan from "./get-loan";
import { useState } from "react";
import TypingAnimation from "@/components/ui/typing-animation";

export default function DashboardHeader() {
  const [userEmail, setUserEmail] = useState("abcd@gmail.com");
  
  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-4xl inline-flex gap-2 text-foreground/80 font-mosaic">
        Hi{" "}
        <TypingAnimation
          className="text-primary"
          text={`${userEmail.split("@")[0]} :)`}
        />
      </h1>
      <GetLoan />
    </div>
  );
}
