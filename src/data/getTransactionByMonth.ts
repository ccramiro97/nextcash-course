import { db } from '@/db';
import { categoriesTable, transactionTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { format } from 'date-fns';
import { and, desc, eq, gte, lte } from 'drizzle-orm';
import 'server-only'

export async function getTransactionsByMonth({ year, month }: { year: number, month: number }) {
  const { userId } = await auth();

  if (!userId) return null;

  const earliestDate = new Date(year, month - 1, 1);
  const latestDate = new Date(year, month, 0);
  const transactions = await db.select({
    id: transactionTable.id,
    description: transactionTable.description,
    amount: transactionTable.amount,
    transactionDate: transactionTable.transactionDate,
    category: categoriesTable.name,
    transactionType: categoriesTable.type
  }).from(transactionTable).where(
    and(
      eq(transactionTable.userId, userId),
      gte(transactionTable.transactionDate, format(earliestDate, "yyyy-MM-dd")),
      lte(transactionTable.transactionDate, format(latestDate, "yyyy-MM-dd"))
    ),
  ).orderBy(desc(transactionTable.transactionDate))
    .leftJoin(categoriesTable, eq(transactionTable.categoryId, categoriesTable.id));

  return transactions;
}