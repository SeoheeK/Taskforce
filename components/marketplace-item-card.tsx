"use client"
import { Card } from "@/components/ui/card"
import { Heart, Download, CalendarDays, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale" // Import Korean locale

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  is_paid: boolean
  file_url?: string
  creator_id: string
  creator_name?: string
  likes: number // New field
  downloads: number // New field
  updated_at: string // New field (ISO string)
  gradient_from?: string // New field for card background
  gradient_to?: string // New field for card background
}

interface MarketplaceItemCardProps {
  item: MarketplaceItem
}

export function MarketplaceItemCard({ item }: MarketplaceItemCardProps) {
  const defaultGradientFrom = "from-blue-500"
  const defaultGradientTo = "to-purple-500"

  const gradientClass = `bg-gradient-to-br ${item.gradient_from || defaultGradientFrom} ${item.gradient_to || defaultGradientTo}`

  return (
    <Card
      className={`relative p-4 rounded-lg shadow-md text-white h-48 flex flex-col justify-between ${gradientClass}`}
    >
      <div className="absolute top-3 right-3 flex items-center space-x-2">
        <Heart className="h-4 w-4 fill-white" />
        <span className="text-sm font-semibold">{item.likes}</span>
      </div>
      <div className="flex-grow">
        {/* Placeholder for "Running" status if needed */}
        {/* <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full">Running</span> */}
        <h3 className="text-xl font-bold mt-2 line-clamp-2">{item.name}</h3>
        <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center space-x-2">
          <User className="h-3 w-3" />
          <span>{item.creator_name || "Unknown"}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Download className="h-3 w-3" />
          <span>{item.downloads}</span>
        </div>
        <div className="flex items-center space-x-2">
          <CalendarDays className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true, locale: ko })}</span>
        </div>
      </div>
    </Card>
  )
}
