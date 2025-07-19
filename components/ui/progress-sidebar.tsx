"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  description: string
  completed: boolean
  current: boolean
}

interface ProgressSidebarProps {
  steps: Step[]
  className?: string
}

export function ProgressSidebar({ steps, className }: ProgressSidebarProps) {
  return (
    <div className={cn("w-80 bg-slate-50 border-r border-slate-200 p-6", className)}>
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Project Setup</h2>
          <p className="text-sm text-slate-600 mt-1">Follow these steps to create your AI team project</p>
        </div>

        <nav className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                {step.completed ? (
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                ) : step.current ? (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-white">{step.id}</span>
                  </div>
                ) : (
                  <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-slate-500">{step.id}</span>
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={cn(
                    "text-sm font-medium",
                    step.current ? "text-blue-600" : step.completed ? "text-emerald-600" : "text-slate-500",
                  )}
                >
                  {step.title}
                </p>
                <p className="text-xs text-slate-500 mt-1">{step.description}</p>
              </div>

              {index < steps.length - 1 && <div className="absolute left-10 mt-8 w-px h-6 bg-slate-200" />}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
