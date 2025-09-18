"use client";

import { AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { deleteTransaction } from "./actions";

export default function DeleteTransactionDialog({
  transactionId,
  transactionDate }:
  {
    transactionId: number;
    transactionDate: string
  }) {
  const router = useRouter();

  const handleDeleteConfirm = async () => {
    const result = await deleteTransaction(transactionId);

    if (result?.error) {
      toast.error(`Error: ${result.message}`);
      return;
    }

    toast.success(`Success`);

    const [year, month] = transactionDate.split('-');

    router.push(`/dashboard/transactions?year=${year}&month=${month}`);
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Trash2Icon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This transaction will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            Cancel
          </AlertDialogCancel>
          <Button onClick={handleDeleteConfirm} variant="destructive">Delete</Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}