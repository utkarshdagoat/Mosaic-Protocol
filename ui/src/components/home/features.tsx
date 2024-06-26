import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";

import mosaicToken from "@/assets/tokens/mosaic-token.svg";
import mUSDC from "@/assets/tokens/musdc-token.svg";
import dao from "@/assets/tokens/dao.svg";

type Feature = {
  title: string;
  description: string;
  image: string;
  alt: string;
};

export default function Features() {
  const features: Feature[] = [
    {
      title: "Algorithmic Stablecoin",
      description:
        "Mosaic is an algorithmic stablecoin protocol that aims to provide a decentralized, scalable, and secure stablecoin.",
      image: mosaicToken,
      alt: "Algorithmic Stablecoin",
    },
    {
      title: "Collaterized Debt Positions",
      description:
        "Users can mint Mosaic's stablecoin, Mosaic USD (mUSD), by depositing collateral in the form of various crypto assets.",
      image: mUSDC,
      alt: "collaterized debt",
    },
    {
      title: "Truly decentralized via DAO",
      description:
        "Mosaic is governed by a DAO, which allows token holders to vote on proposals and changes to the protocol.",
      image: dao,
      alt: "DAO",
    },
  ];
  return (
    <section className="relative max-w-full mb-12">
      <div className="mx-auto max-w-screen-xl px-4 md:px-8">
        <h1 className="text-6xl text-center tracking-tight md:text-5xl">
          Discover the{" "}
          <span className="font-mosaic text-6xl tracking-wide text-primary uppercase">
            Mosaic
          </span>{" "}
          Experience
        </h1>
        <div className="grid grid-cols-1 gap-4  max-w-6xl mt-8 mx-auto md:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  title,
  description,
  image,
  alt,
}: {
  title: string;
  description: string;
  image: string;
  alt: string;
}) {
  return (
    <Card className="bg-primary/20 p-2 border-none">
      <div className="bg-background rounded-md">
        <CardHeader>
          <CardTitle className="leading-6">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={image} alt={alt} className="w-24 h-24 mx-auto" />
        </CardContent>
      </div>
    </Card>
  );
}
