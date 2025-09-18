"use client";

import TransactionForm, { transactionFormSchema } from "@/components/transaction-form";
import { Category } from "@/types/Category";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import z from "zod";
import { updateTransaction } from "./actions";

export default function EditTransactionForm({
  categories,
  transaction
}: {
  categories: Category[],
  transaction: {
    id: number;
    userId: string;
    description: string;
    amount: string;
    transactionDate: string;
    categoryId: number;
  }
}) {
  const router = useRouter();

  const handleSubmit = async (data: z.infer<typeof transactionFormSchema>) => {
    const result = await updateTransaction({
      id: transaction.id,
      amount: data.amount,
      transactionDate: format(data.transactionDate, "yyyy-MM-dd"),
      categoryId: data.categoryId,
      description: data.description
    });

    if (result?.error) {
      toast.error(`Error: ${result.message}`);
      return;
    }

    toast.success(`Success`);
    router.push(`/dashboard/transactions?month=${data.transactionDate.getMonth() + 1}&year=${data.transactionDate.getFullYear()}`);
  };

  return <TransactionForm
    defaultValues={{
      amount: Number(transaction.amount),
      categoryId: transaction.categoryId,
      description: transaction.description,
      transactionDate: new Date(transaction.transactionDate),
      transactionType: categories.find(category => category.id === transaction.categoryId)?.type ?? "income"
    }}
    categories={categories}
    onSubmit={handleSubmit} />
}