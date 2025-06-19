"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface Step {
  id: number
  title: string
  completed: boolean
  current: boolean
}

interface MobileProgressProps {
  steps: Step[]
  className?: string
}

export function MobileProgress({ steps, className }: MobileProgressProps) {
  return (
    <div className={cn("bg-white border-b border-slate-200 p-4", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center">
              {step.completed ? (
                <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" />
                </div>
              ) : step.current ? (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">{step.id}</span>
                </div>
              ) : (
                <div className="w-6 h-6 bg-slate-200 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-slate-500">{step.id}</span>
                </div>
              )}
            </div>

            {index < steps.length - 1 && (
              <div className={cn("w-8 h-px mx-2", step.completed ? "bg-emerald-500" : "bg-slate-200")} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-2">
        <p className="text-sm font-medium text-slate-900">{steps.find((step) => step.current)?.title}</p>
      </div>
    </div>
  )
}
