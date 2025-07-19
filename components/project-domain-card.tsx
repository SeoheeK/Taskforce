"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface ProjectSubtype {
  id: string
  name: string
  icon: string
  description: string
  tags: string[]
}

interface ProjectDomain {
  id: string
  title: string
  description: string
  color: string
  subtypes: ProjectSubtype[]
}

interface ProjectDomainCardProps {
  domain: ProjectDomain
  selectedSubtype: string | null
  onSubtypeSelect: (subtypeId: string) => void
}

export function ProjectDomainCard({ domain, selectedSubtype, onSubtypeSelect }: ProjectDomainCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Domain Header */}
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">{domain.title}</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">{domain.description}</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)} className="ml-4">
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </Button>
          </div>

          {/* Quick Preview Tags */}
          <div className="flex flex-wrap gap-2">
            {domain.subtypes.slice(0, 3).map((subtype) => (
              <Badge key={subtype.id} variant="secondary" className="text-xs">
                {subtype.icon} {subtype.name}
              </Badge>
            ))}
          </div>

          {/* Expanded Subtypes */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  {domain.subtypes.map((subtype) => (
                    <div
                      key={subtype.id}
                      className={cn(
                        "p-4 rounded-lg border-2 cursor-pointer transition-all duration-200",
                        selectedSubtype === subtype.id
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950"
                          : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600",
                      )}
                      onClick={() => onSubtypeSelect(subtype.id)}
                    >
                      <div className="flex items-start space-x-3">
                        <div className="text-2xl">{subtype.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-1">{subtype.name}</h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{subtype.description}</p>
                          <div className="flex flex-wrap gap-1">
                            {subtype.tags.map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  )
}
