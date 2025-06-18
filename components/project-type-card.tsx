"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ProjectType {
  id: string
  title: string
  description: string
  icon: string
  examples: string[]
}

interface ProjectTypeCardProps {
  projectType: ProjectType
  selected: boolean
  onSelect: () => void
}

export function ProjectTypeCard({ projectType, selected, onSelect }: ProjectTypeCardProps) {
  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-md",
        selected ? "ring-2 ring-blue-500 border-blue-200 bg-blue-50" : "border-slate-200 hover:border-slate-300",
      )}
      onClick={onSelect}
    >
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="text-3xl">{projectType.icon}</div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-900 mb-2">{projectType.title}</h3>
            <p className="text-sm text-slate-600 mb-3">{projectType.description}</p>
            <div className="space-y-1">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Examples:</p>
              <ul className="text-xs text-slate-500 space-y-1">
                {projectType.examples.map((example, index) => (
                  <li key={index}>• {example}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
