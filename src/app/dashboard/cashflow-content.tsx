"use client";

import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import numeral from "numeral";
import { Bar, BarChart, CartesianGrid, Legend, XAxis, YAxis } from "recharts";

type Prop = {
  annualCashflow: {
    month: number;
    income: number;
    expenses: number;
  }[]
};

export function CashflowContent({ annualCashflow }: Prop) {
  const today = new Date();
  const totalAnnualIncome = annualCashflow.reduce((previous, cashflow) => previous + cashflow.income, 0);
  const totalAnnualExpense = annualCashflow.reduce((previous, cashflow) => previous + cashflow.expenses, 0);
  const balance = totalAnnualIncome - totalAnnualExpense;

  return (
    <>
      <ChartContainer config={{
        income: {
          label: "Income",
          color: "#84cc16"
        },
        expenses: {
          label: "Expenses",
          color: "#f97316"
        }
      }} className="w-full h-[300px]">
        <BarChart data={annualCashflow}>
          <CartesianGrid vertical={false} />
          <YAxis tickFormatter={(value) => {
            return `${numeral(value).format("0,0")}`
          }} />
          <XAxis tickFormatter={(value) => {
            return format(new Date(today.getFullYear(), value, 1), "MMM");
          }} />
          <ChartTooltip content={<ChartTooltipContent labelFormatter={(value, payload) => {
            const month = payload[0]?.payload?.month;
            return format(new Date(today.getFullYear(), month - 1, 1), "MMMM");
          }} />} />
          <Legend
            verticalAlign="top"
            align="right"
            height={30}
            iconType="circle"
            formatter={(value) => {
              return <span className="capitalize text-primary">{value}</span>;
            }} />
          <Bar dataKey="income" radius={4} fill="var(--color-income)" />
          <Bar dataKey="expenses" radius={4} fill="var(--color-expenses)" />
        </BarChart>
      </ChartContainer>
      <div className="border-l px-4 flex flex-col gap-4 justify-center">
        <div>
          <span className="text-muted-foreground font-bold text-sm">Income</span>
          <h2 className="text-3xl">{numeral(totalAnnualIncome).format("0,0[.]00")}</h2>
        </div>
        <div className="border-1"></div>
        <div>
          <span className="text-muted-foreground font-bold text-sm">Expenses</span>
          <h2 className="text-3xl">{numeral(totalAnnualExpense).format("0,0[.]00")}</h2>
        </div>
        <div className="border-1"></div>
        <div>
          <span className="text-muted-foreground font-bold text-sm">Balance</span>
          <h2 className={cn("text-3xl font-bold", balance >= 0 ? "text-lime-500" : "text-orange-500")}>{numeral(balance).format("0,0[.]00")}</h2>
        </div>
      </div>
    </>
  );
}