import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getRecentTransactions } from "@/data/getRecentTransactions";
import { format } from "date-fns/format";
import { PencilIcon } from "lucide-react";
import Link from "next/link";
import numeral from "numeral";


export default async function RecentTransactions() {
  const recentTransactions = await getRecentTransactions();
  const transactionTypeBadge = (type: string) => type == 'income' ? 'bg-lime-500' : 'bg-orange-500';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>Recent Transactions</span>
          <div className="flex gap-2">
            <Button asChild>
              <Link href="/dashboard/transactions">View All</Link>
            </Button>
            <Button asChild>
              <Link href="/dashboard/transactions/new">Create New</Link>
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!recentTransactions?.length ? <p className="text-center py-10 text-lg text-muted-foreground">You have no transactions yet. Start by hitting &quot;Create New&quot; to create your first transaction.</p> :
          <Table className="mt-4">
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentTransactions.map(transaction => (
                <TableRow key={transaction.id}>
                  <TableCell>{format(transaction.transactionDate, "do MMM yyyy")}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell className="capitalize">
                    <Badge className={transactionTypeBadge(transaction.transactionType!)}>{transaction.transactionType}</Badge>
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{numeral(transaction.amount).format("0,0[.]00")}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" asChild size="icon" aria-label="Edit Transaction">
                      <Link href={`/dashboard/transactions/${transaction.id}`}>
                        <PencilIcon />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        }
      </CardContent>
    </Card>
  )
}