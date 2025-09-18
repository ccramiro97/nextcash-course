import { db } from "@/db";
import { categoriesTable, transactionTable } from "@/db/schema";
import { auth } from "@clerk/nextjs/server";
import { desc, eq } from "drizzle-orm";
import "server-only";

export async function getRecentTransactions() {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const transactions = await db.select({
    id: transactionTable.id,
    description: transactionTable.description,
    amount: transactionTable.amount,
    transactionDate: transactionTable.transactionDate,
    category: categoriesTable.name,
    transactionType: categoriesTable.type
  }).from(transactionTable)
    .where(eq(transactionTable.userId, userId))
    .orderBy(desc(transactionTable.transactionDate))
    .limit(5)
    .leftJoin(categoriesTable, eq(transactionTable.categoryId, categoriesTable.id));

  return transactions;
}