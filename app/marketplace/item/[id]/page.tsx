"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon, DownloadIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  is_paid: boolean
  creator_id: string
  file_url?: string
  created_at: string
}

export default function MarketplaceItemPage({ params }: { params: { id: string } }) {
  const { id } = params
  const router = useRouter()
  const { toast } = useToast()
  const [item, setItem] = useState<MarketplaceItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  useEffect(() => {
    async function fetchItem() {
      try {
        const res = await fetch(`/api/marketplace/items/${id}`)
        if (!res.ok) {
          throw new Error("Failed to fetch item")
        }
        const data = await res.json()
        setItem(data)
      } catch (error) {
        console.error("Error fetching item:", error)
        toast({
          title: "Error",
          description: "Could not load marketplace item.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    fetchItem()
  }, [id, toast])

  const handlePurchase = async () => {
    if (!item) return

    setIsProcessingPayment(true)
    // In a real app, you'd get the actual userId from your auth system
    const userId = "user_123" // Placeholder buyer ID for demonstration

    try {
      const res = await fetch("/api/marketplace/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: item.id, userId }),
      })
      const data = await res.json()

      if (res.ok && data.url) {
        router.push(data.url) // Redirect to Stripe Checkout
      } else {
        toast({
          title: "Purchase Failed",
          description: data.error || "Could not initiate payment.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error during purchase:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during purchase.",
        variant: "destructive",
      })
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleDownload = () => {
    if (item?.file_url) {
      window.open(item.file_url, "_blank")
      toast({
        title: "Download Started",
        description: "Your download should begin shortly.",
      })
    } else {
      toast({
        title: "Download Failed",
        description: "No download link available for this item.",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Loading item details...</p>
      </div>
    )
  }

  if (!item) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Item not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="outline" asChild>
        <Link href="/marketplace">
          <ArrowLeftIcon className="mr-2 h-4 w-4" /> Back to Marketplace
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{item.name}</CardTitle>
          <CardDescription className="text-lg">{item.type}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700 dark:text-gray-300">{item.description}</p>
          <div className="flex items-center justify-between">
            {item.is_paid ? (
              <>
                <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">${item.price.toFixed(2)}</span>
                <Button onClick={handlePurchase} disabled={isProcessingPayment}>
                  {isProcessingPayment ? "Processing..." : "Purchase"}
                </Button>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-green-600">Free</span>
                <Button onClick={handleDownload}>
                  <DownloadIcon className="mr-2 h-4 w-4" /> Download
                </Button>
              </>
            )}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created by: {item.creator_id} on {new Date(item.created_at).toLocaleDateString()}
          </div>
        </CardContent>
      </Card>

      {/* Placeholder for Feedback/Reviews section */}
      <Card>
        <CardHeader>
          <CardTitle>Customer Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400">No reviews yet. Be the first!</p>
        </CardContent>
      </Card>
    </div>
  )
}
