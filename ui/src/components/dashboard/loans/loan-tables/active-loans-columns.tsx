import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import RedeemCollateralModal from "./redeem-collateral-modal";

export type ActiveLoans = {
  id: string;
  amount: string;
  takenDate: Date;
  paidPercentage: string;
};

export const ActiveLoansColumns: ColumnDef<ActiveLoans | { actions: true }>[] =
  [
    {
      accessorKey: "amount",
      header: () => <div className="font-semibold">Amount</div>,
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amount);

        return <div className="font-medium">{formatted}</div>;
      },
    },
    {
      accessorKey: "takenDate",
      header: "Date Taken",
      cell: ({ row }) => {
        const date = new Date(row.getValue("takenDate"));
        return <div>{date.toLocaleDateString("en-GB")}</div>;
      },
    },
    {
      accessorKey: "paidPercentage",
      header: "% Paid",
      cell: ({ row }) => {
        return (
          <div className="font-semibold">
            {(parseFloat(row.getValue("paidPercentage")) * 100).toFixed(2)}%
          </div>
        );
      },
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-primary">Redeem Collateral</div>,
      cell: ({ row }) => {
        return <RedeemCollateralModal />;
      },
    },
  ];
