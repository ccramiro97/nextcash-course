'use server';

import { db } from "@/db";
import { transactionTable } from "@/db/schema";
import { transactionSchema } from "@/validation/transactionSchema";
import { auth } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import z from "zod";

const updateTransactionSchema = transactionSchema.and(z.object({
  id: z.number(),
}));

export async function updateTransaction(data: {
  id: number;
  transactionDate: string;
  description: string;
  amount: number;
  categoryId: number;
}) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized"
    };
  }

  const validation = updateTransactionSchema.safeParse(data);

  if (!validation.success) {
    return {
      error: true,
      message: validation.error.issues[0].message
    };
  }

  await db.update(transactionTable).set({
    description: data.description,
    amount: data.amount.toString(),
    transactionDate: data.transactionDate,
    categoryId: data.categoryId,
  }).where(and(
    eq(transactionTable.userId, userId),
    eq(transactionTable.id, data.id),
  ));
}


export async function deleteTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) {
    return {
      error: true,
      message: "Unauthorized"
    };
  }

  await db.delete(transactionTable).where(and(
    eq(transactionTable.userId, userId),
    eq(transactionTable.id, transactionId)
  ));
}