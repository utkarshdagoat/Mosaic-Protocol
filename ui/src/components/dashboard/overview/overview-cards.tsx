import {
  InfoCardProps,
  InfoCard,
} from "@/components/dashboard/commons/info-card";
import { useState } from "react";
import Heading from "@/components/dashboard/commons/heading";

export default function OverviewCards() {
  const [totalAssets, setTotalAssets] = useState("0");
  const [totalRepayments, setTotalRepayments] = useState("1045");
  const [creditScore, setCreditScore] = useState("470");

  const data: InfoCardProps[] = [
    {
      title: "Total Assets",
      type: "value",
      unit: "$",
      data: totalAssets,
    },
    {
      title: "Total Repayments",
      type: "value",
      unit: "$",
      data: totalRepayments,
    },
    {
      title: "Credit Score",
      type: "value",
      unit: "pts",
      data: creditScore,
    },
  ];

  return (
    <div>
      <Heading>Overview</Heading>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.map((item, index) => (
          <InfoCard key={index} {...item} />
        ))}
      </div>
    </div>
  );
}
