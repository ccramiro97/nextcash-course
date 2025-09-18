import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/data/getCategories";
import getTransaction from "@/data/getTransaction";
import Link from "next/link";
import { notFound } from "next/navigation";
import EditTransactionForm from "./edit-transaction-form";
import DeleteTransactionDialog from "./delete-transaction-dialog";

export default async function EditTransactionPage({ params }:
  { params: Promise<{ transactionId: string }> }) {
  const paramValues = await params;
  const transactionId = Number(paramValues.transactionId);

  if (isNaN(transactionId)) {
    return <div>Oops! Transaction not found</div>
  }

  const categories = await getCategories();
  const transaction = await getTransaction(transactionId);

  if (!transaction) {
    return notFound();
  }

  return (
    <Card className="mt-4 max-w-screen-md">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Edit Transaction</span>
          <DeleteTransactionDialog
            transactionId={transaction.id}
            transactionDate={transaction.transactionDate} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <EditTransactionForm transaction={transaction!} categories={categories} />
      </CardContent>
    </Card>
  );
}