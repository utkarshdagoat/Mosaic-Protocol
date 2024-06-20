import { GetLoan } from "@/components/dashboard/get-loan";

export default function Dashboard() {
  return (
    <>
      <div className="max-w-[60rem] h-[92vh] mx-auto py-4">
        <div className="flex flex-row justify-between">
          <h1 className="text-4xl font-mosaic">Dashboard</h1>
          <GetLoan />
        </div>
        <div className="flex h-full items-center justify-center">
            <p className="text-gray-300 text-center leading-8 font-medium text-2xl">
                Welcome to the dashboard. <br /> You can get a loan by clicking the button above.
            </p>
        </div>
      </div>
    </>
  );
}
