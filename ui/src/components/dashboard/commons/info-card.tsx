import { Card, CardTitle } from "@/components/ui/card";
import NumberTicker from "@/components/ui/number-ticker";

type InfoCardPropsBase<T extends "value" | "component"> = {
  title: string;
  type: T;
  unit?: T extends "value" ? string : never;
  data: T extends "value" ? string : React.ReactNode;
};

export type InfoCardProps =
  | InfoCardPropsBase<"value">
  | InfoCardPropsBase<"component">;

export function InfoCard(props: InfoCardProps) {
  return (
    <Card className="flex justify-between items-center md:flex-col md:items-start gap-4 p-4">
      <CardTitle className="text-base text-muted-foreground">
        {props.title}
      </CardTitle>
      <div className="flex flex-col gap-2">
        {props.type === "value" ? (
          <p className="text-lg md:text-3xl font-bold text-foreground"><NumberTicker value={Number(props.data)} />  <span className="text-primary">{props.unit}</span></p>
        ) : (
          props.data
        )}
      </div>
    </Card>
  );
}
