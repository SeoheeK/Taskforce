import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

export default function MarketplaceItemPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Placeholder data for demonstration
  const item = {
    id: id,
    name: `Resource ${id}`,
    type: "Template",
    description: `This is a detailed description for Resource ${id}. It provides comprehensive insights and tools for various AI applications.`,
    price: 49.99,
    creator: "AI Solutions Inc.",
    createdAt: "2023-10-26",
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
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-50">${item.price.toFixed(2)}</span>
            <Button>Purchase</Button>
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Created by: {item.creator} on {item.createdAt}
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
