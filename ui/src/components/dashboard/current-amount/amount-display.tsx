import NumberTicker from "@/components/ui/number-ticker";
import mosaicToken from "@/assets/tokens/mosaic-token.svg";
import usdcToken from "@/assets/tokens/usdc-token.svg";

interface AmountDisplayProps {
  amount: number;
  currency: "mUSDC" | "mosaic";
}

export default function AmountDisplay(props: AmountDisplayProps) {
  return (
    <p className="text-lg md:text-3xl gap-2 inline-flex font-bold text-foreground">
      <img
        src={props.currency == "mUSDC" ? usdcToken : mosaicToken}
        className="w-10 h-10"
      />
      <NumberTicker value={props.amount} />{" "}
    </p>
  );
}
