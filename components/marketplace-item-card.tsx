"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  is_paid: boolean
  file_url?: string
}

interface MarketplaceItemCardProps {
  item: MarketplaceItem
}

export function MarketplaceItemCard({ item }: MarketplaceItemCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="text-xl">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400">{item.type}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-grow justify-between">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-3">{item.description}</p>
        <div className="mt-auto">
          {item.is_paid ? (
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-gray-900 dark:text-gray-50">${item.price.toFixed(2)}</span>
              <Button asChild>
                <Link href={`/marketplace/item/${item.id}`}>Purchase</Link>
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-green-600">Free</span>
              <Button asChild variant="outline">
                <Link href={`/marketplace/item/${item.id}`}>View Details</Link>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
