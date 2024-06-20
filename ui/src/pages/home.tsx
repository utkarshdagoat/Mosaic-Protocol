import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { MosaicBg } from "@/components/ui/mosaic-bg";

export default function Home() {
  return (
    <div className="w-full h-screen relative overflow-hidden flex flex-col gap-2 justify-center items-center">
      <MosaicBg />
      <h1 className="text-7xl tracking-wide font-mosaic text-primary">
        Mosaic <span className="text-muted-foreground">Protocol</span>
      </h1>
      <p className="text-muted-foreground font-semibold mb-4">
        Dynamic Multi-Chain Loan lending platform for{" "}
        <span className="text-primary">ArchWay</span>
      </p>
      <Button
        className="rounded-full font-medium"
        size={"lg"}
        variant={"expandIcon"}
        iconPlacement="right"
        Icon={MoveRight}
      >
        Get Started
      </Button>
    </div>
  );
}
