import { db } from '@/db';
import { transactionTable } from '@/db/schema';
import { auth } from '@clerk/nextjs/server';
import { and, eq } from 'drizzle-orm';
import 'server-only';

export default async function getTransaction(transactionId: number) {
  const { userId } = await auth();

  if (!userId) return null;

  const [transaction] = await db.select().from(transactionTable).where(
    and(
      eq(transactionTable.id, transactionId),
      eq(transactionTable.userId, userId),
    )
  );

  return transaction;
}