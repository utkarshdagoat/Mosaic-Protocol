import { ColumnDef } from "@tanstack/react-table";

export type PastLoans = {
  id: string;
  amount: string;
  collateral: string;
  takenDate: Date;
  finalRepaymentDate: Date;
};

export const PastLoansColumns: ColumnDef<PastLoans>[] = [
  {
    accessorKey: "amount",
    header: "Amount",
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
    accessorKey: "collateral",
    header: "Collateral",
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
    header: "Taken Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("takenDate"));
      return <div>{date.toLocaleDateString("en-GB")}</div>;
    },
  },
  {
    accessorKey: "finalRepaymentDate",
    header: "Final Repayment Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("takenDate"));
      return <div>{date.toLocaleDateString("en-GB")}</div>;
    },
  },
];
