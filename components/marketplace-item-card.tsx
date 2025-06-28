"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardDescription, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Bot,
  MessageSquare,
  Zap,
  FileText,
  GitBranch,
  ClipboardList,
  FolderIcon as FolderTemplate,
  FileOutput,
  Users,
  Heart,
  Calendar,
  Download,
} from "lucide-react"

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
  likes: number // Added
  updated_at: string // Added
  downloads: number // Added
}

interface MarketplaceItemCardProps {
  item: MarketplaceItem
}

// Map resource types to icons for consistent display
const typeIcons: { [key: string]: React.ElementType } = {
  Persona: Bot,
  "Prompt 템플릿": MessageSquare,
  "MCP 전략": Zap,
  "Output Format": FileText,
  "Workflow 템플릿": GitBranch,
  "평가표 템플릿": ClipboardList,
  "프로젝트 템플릿": FolderTemplate,
  "산출물 템플릿": FileOutput,
  "회의 유형 / 포맷": Users,
}

export function MarketplaceItemCard({ item }: MarketplaceItemCardProps) {
  const IconComponent = typeIcons[item.type] || Bot // Default to Bot icon

  // Format date for display
  const formattedDate = new Date(item.updated_at).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card className="flex items-center p-4 space-x-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <Avatar className="w-14 h-14 flex-shrink-0">
        <AvatarFallback className="bg-gray-100 dark:bg-gray-800">
          <IconComponent className="w-8 h-8 text-gray-600 dark:text-gray-400" />
        </AvatarFallback>
      </Avatar>
      <div className="flex-grow">
        <CardTitle className="text-lg font-semibold">{item.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {item.description}
        </CardDescription>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1 space-x-3">
          <p>작성자: {item.creator_name || "Unknown Creator"}</p>
          <div className="flex items-center gap-1">
            <Heart className="w-3 h-3" />
            <span>{item.likes}</span>
          </div>
          <div className="flex items-center gap-1">
            <Download className="w-3 h-3" />
            <span>{item.downloads}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            <span>{formattedDate}</span>
          </div>
        </div>
      </div>
      <div className="flex-shrink-0 text-right">
        {item.is_paid ? (
          <p className="text-lg font-bold text-gray-900 dark:text-gray-50">${item.price.toFixed(2)}</p>
        ) : (
          <p className="text-lg font-bold text-green-600">Free</p>
        )}
        <Button asChild variant="ghost" className="mt-2 p-0 h-auto text-sm">
          <Link href={`/marketplace/item/${item.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  )
}
