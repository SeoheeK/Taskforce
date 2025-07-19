"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface DomainCardProps {
  domain: {
    id: string
    icon: string
    title: string
    tags: string[]
  }
  isSelected: boolean
  onSelect: (id: string) => void
}

export function DomainCard({ domain, isSelected, onSelect }: DomainCardProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <Card
        className={cn(
          "cursor-pointer transition-all duration-200 h-full",
          isSelected
            ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950"
            : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700",
        )}
        onClick={() => onSelect(domain.id)}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className="text-3xl mb-3">{domain.icon}</div>
          <h3 className="text-base font-medium text-slate-900 dark:text-slate-100 mb-2">{domain.title}</h3>
          <div className="flex flex-wrap gap-1 mt-auto">
            {domain.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
