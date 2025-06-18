"use client"

import type React from "react"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight, Share2 } from "lucide-react"

interface ResourceItem {
  id: number
  title: string
  description: string
  href: string
  icon: React.ElementType
  color: string
  stats: { total: number; active: number }
  features: string[]
}

interface ResourceCardProps {
  item: ResourceItem
}

export function ResourceCard({ item }: ResourceCardProps) {
  const getTagColors = (index: number) => {
    const tagColors = [
      "bg-green-100 text-green-700 border border-green-200",
      "bg-purple-100 text-purple-700 border border-purple-200",
      "bg-orange-100 text-orange-700 border border-orange-200",
      "bg-blue-100 text-blue-700 border border-blue-200",
    ]
    return tagColors[index % 4]
  }

  return (
    <Card className="hover:shadow-lg transition-all duration-300 group flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className={`h-10 w-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}>
            <item.icon className="h-5 w-5 text-white" />
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">총 {item.stats.total}개</p>
            <p className="text-xs font-medium text-green-600">활성 {item.stats.active}개</p>
          </div>
        </div>
        <CardTitle className="text-base">{item.title}</CardTitle>
        <CardDescription className="text-gray-600 text-xs leading-relaxed">{item.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col justify-between pt-0 h-full">
        <div className="space-y-3 mb-4">
          <div className="flex flex-wrap gap-1.5">
            {item.features.slice(0, 4).map((feature, index) => (
              <span key={index} className={`${getTagColors(index)} px-2 py-0.5 rounded-full text-xs font-medium`}>
                {feature}
              </span>
            ))}
          </div>
          {item.features.length > 4 && <p className="text-xs text-gray-500">+{item.features.length - 4}개 더</p>}
        </div>

        <div className="flex flex-col gap-2 mt-auto">
          <Link href={item.href}>
            <Button
              size="sm"
              className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
            >
              관리하기
              <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <Link href="/marketplace/upload">
            <Button variant="outline" size="sm" className="w-full">
              <Share2 className="h-3 w-3 mr-2" />
              마켓플레이스에 공유
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
