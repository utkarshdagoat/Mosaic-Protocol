import Heading from "@/components/dashboard/commons/heading";
import {
  ActiveLoansColumns,
  ActiveLoans,
} from "@/components/dashboard/loans/loan-tables/active-loans-columns";
import {
  PastLoansColumns,
  PastLoans,
} from "@/components/dashboard/loans/loan-tables/past-loans-columns";
import { DataTable } from "./loan-tables/data-table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoansInfo() {
  const activeLoansData: ActiveLoans[] = [
    {
      id: "1",
      amount: "15000",
      takenDate: new Date("2023-01-15"),
      paidPercentage: "0.2016",
    },
    {
      id: "2",
      amount: "25000",
      takenDate: new Date("2022-11-22"),
      paidPercentage: "0.5067",
    },
    {
      id: "3",
      amount: "12000",
      takenDate: new Date("2023-04-10"),
      paidPercentage: "0.1010",
    },
  ];

  const pastLoansData: PastLoans[] = [
    {
      id: "1",
      amount: "1800",
      collateral: "10000",
      takenDate: new Date("2021-03-15"),
      finalRepaymentDate: new Date("2023-03-15"),
    },
    {
      id: "2",
      amount: "200",
      collateral: "1200",
      takenDate: new Date("2020-07-10"),
      finalRepaymentDate: new Date("2022-07-10"),
    },
    {
      id: "3",
      amount: "1000",
      collateral: "10000",
      takenDate: new Date("2019-11-22"),
      finalRepaymentDate: new Date("2021-11-22"),
    },
  ];

  return (
    <div className="w-full pb-8">
      <Heading>Loans</Heading>
      <Tabs defaultValue="active">
        <TabsList className="*:w-[45vw] w-full md:w-[50%]">
          <TabsTrigger value="active">Active Loans</TabsTrigger>
          <TabsTrigger value="past">Past Loans</TabsTrigger>
        </TabsList>
        <TabsContent value="active">
          <DataTable columns={ActiveLoansColumns} data={activeLoansData} />
        </TabsContent>
        <TabsContent value="past">
          <DataTable columns={PastLoansColumns} data={pastLoansData} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
