"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useToast } from "@/hooks/use-toast"

interface Transaction {
  id: string
  item_id: string
  item_name: string
  item_type: string
  buyer_id: string
  seller_id: string
  amount: number
  platform_fee: number
  seller_payout: number
  stripe_charge_id: string | null
  status: string
  created_at: string
}

export default function MarketplaceTransactionsPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    async function fetchTransactions() {
      try {
        // In a real app, you'd pass the actual userId from your auth system
        const userId = "user_123" // Placeholder user ID for demonstration
        const res = await fetch(`/api/marketplace/transactions?userId=${userId}`)
        if (!res.ok) {
          throw new Error("Failed to fetch transactions")
        }
        const data = await res.json()
        setTransactions(data)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Error",
          description: "Could not load transaction history.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchTransactions()
  }, [toast])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading transactions...</p>
      </div>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Transaction History</CardTitle>
        <CardDescription>View your past purchases and sales.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-gray-500">No transactions found.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Item Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Role</TableHead> {/* Buyer/Seller */}
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Platform Fee</TableHead>
                <TableHead className="text-right">Payout</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((txn) => {
                // Determine if the current user is the buyer or seller (using placeholder userId)
                const currentUserIsBuyer = txn.buyer_id === "user_123" // Replace with actual user ID
                const role = currentUserIsBuyer ? "Buyer" : "Seller"
                const displayAmount = currentUserIsBuyer ? txn.amount : txn.seller_payout

                return (
                  <TableRow key={txn.id}>
                    <TableCell className="font-medium">{txn.item_name}</TableCell>
                    <TableCell>{txn.item_type}</TableCell>
                    <TableCell>{role}</TableCell>
                    <TableCell className="text-right">${displayAmount.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${txn.platform_fee.toFixed(2)}</TableCell>
                    <TableCell className="text-right">${txn.seller_payout.toFixed(2)}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          txn.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : txn.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </TableCell>
                    <TableCell>{new Date(txn.created_at).toLocaleDateString()}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
