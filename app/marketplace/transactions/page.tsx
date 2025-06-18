import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function MarketplaceTransactionsPage() {
  // Placeholder data
  const transactions = [
    { id: "txn_001", item: "Advanced NLP Template", type: "Purchase", amount: 29.99, date: "2023-10-20" },
    { id: "txn_002", item: "AI Persona: Marketing Guru", type: "Sale", amount: 19.99, date: "2023-10-22" },
    { id: "txn_003", item: "Project Workflow: Agile AI", type: "Purchase", amount: 39.99, date: "2023-10-25" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transaction History</CardTitle>
        <CardDescription>View your past purchases and sales.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction ID</TableHead>
              <TableHead>Item</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((txn) => (
              <TableRow key={txn.id}>
                <TableCell className="font-medium">{txn.id}</TableCell>
                <TableCell>{txn.item}</TableCell>
                <TableCell>{txn.type}</TableCell>
                <TableCell className="text-right">${txn.amount.toFixed(2)}</TableCell>
                <TableCell>{txn.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
