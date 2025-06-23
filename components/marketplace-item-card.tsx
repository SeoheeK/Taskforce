"use client"
import { Card } from "@/components/ui/card"
import type React from "react"

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
  status?: string // New field for status badge
  status_icon?: React.ElementType // New field for status icon
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
      <div className="flex justify-between items-center">
        {item.status && (
          <span className="text-xs font-medium bg-white/20 px-2 py-1 rounded-full flex items-center space-x-1">
            {item.status_icon && <item.status_icon className="h-3 w-3" />}
            <span>{item.status}</span>
          </span>
        )}
        <div className="flex items-center space-x-1 ml-auto">
          <Heart className="h-4 w-4 fill-white" />
          <span className="text-sm font-semibold">{item.likes}</span>
        </div>
      </div>
      <div className="flex-grow mt-2">
        <h3 className="text-xl font-bold line-clamp-2">{item.name}</h3>
        <p className="text-sm mt-1 line-clamp-2">{item.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs mt-2">
        <div className="flex items-center space-x-1">
          <User className="h-3 w-3" />
          <span>{item.creator_name || "Unknown"}</span>
        </div>
        <div className="flex items-center space-x-1">
          <Download className="h-3 w-3" />
          <span>{item.downloads}</span>
        </div>
        <div className="flex items-center space-x-1">
          <CalendarDays className="h-3 w-3" />
          <span>{formatDistanceToNow(new Date(item.updated_at), { addSuffix: true, locale: ko })}</span>
        </div>
      </div>
    </Card>
  )
}
