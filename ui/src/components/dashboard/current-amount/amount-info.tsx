import {
  InfoCard,
  InfoCardProps,
} from "@/components/dashboard/commons/info-card";
import AmountDisplay from "./amount-display";
import Heading from "@/components/dashboard/commons/heading";

export default function AmountInfo() {
  const data: InfoCardProps[] = [
    {
      title: "mUSDC Balance",
      type: "component",
      data: <AmountDisplay amount={12500.45} currency="mUSDC" />,
    },
    {
      title: "Rewards",
      type: "component",
      data: <AmountDisplay amount={1045} currency="mosaic" />,
    },
  ];
  return (
    <div>
      <Heading>Current Amount</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {data.map((item, index) => (
          <InfoCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
