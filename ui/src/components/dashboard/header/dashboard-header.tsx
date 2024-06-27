import GetLoan from "./get-loan";
import TypingAnimation from "@/components/ui/typing-animation";
import { useUserStore } from "@/hooks/useStore";

export default function DashboardHeader() {
  const {user} = useUserStore() 
  
  return (
    <div className="flex flex-row justify-between">
      <h1 className="text-4xl inline-flex gap-2 text-foreground/80 font-mosaic">
        Hi{" "}
        <TypingAnimation
          className="text-primary"
          text={`${user?.email.split("@")[0]} :)`}
        />
      </h1>
      <GetLoan />
    </div>
  );
}
