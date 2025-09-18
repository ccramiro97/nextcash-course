import Cashflow from "./cashflow";
import RecentTransactions from "./recent-transactions";

export default async function DashboardPage({ searchParams }:
  { searchParams: Promise<{ cfyear: string }> }) {
  const today = new Date();
  const searchParamsValues = await searchParams;
  let cfyear = Number(searchParamsValues.cfyear ?? today.getFullYear());

  if (isNaN(cfyear)) {
    cfyear = today.getFullYear();
  }

  return (
    <div className="max-w-screen-xl mx-auto py-5">
      <h1 className="text-4xl font-semibold pb-5">Dashboard</h1>
      <Cashflow year={cfyear} />
      <RecentTransactions />
    </div>
  );
}