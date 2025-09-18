"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";

export default function Filters({ year, month, yearsRange }:
  {
    year: number,
    month: number,
    yearsRange: number[]
  }) {
  const [selectedMonth, setMonth] = useState(month);
  const [selectedYear, setYear] = useState(year);

  return (
    <div className="flex gap-1">
      <Select value={selectedMonth.toString()} onValueChange={(newValue) => setMonth(Number(newValue))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 12 }).map((_, i) =>
          (<SelectItem key={i} value={`${i + 1}`}>
            {format(new Date(selectedYear, i, 1), "MMM")}
          </SelectItem>))}
        </SelectContent>
      </Select>
      <Select value={selectedYear.toString()} onValueChange={(newValue) => setYear(Number(newValue))}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {yearsRange.map((year) => (
            <SelectItem key={year} value={`${year}`}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild>
        <Link href={`/dashboard/transactions?year=${selectedYear}&month=${selectedMonth}`}>Go</Link>
      </Button>
    </div>
  );
}