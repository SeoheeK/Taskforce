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

interface HorizontalProgressProps {
  steps: Step[]
  className?: string
}

export function HorizontalProgress({ steps, className }: HorizontalProgressProps) {
  return (
    <div
      className={cn("bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 pb-8 mb-8", className)}
    >
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">Project Setup</h2>
          <p className="text-slate-600 dark:text-slate-400">Follow these steps to create your AI team project</p>
        </div>

        {/* Progress Steps */}
        <div className="relative">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center relative">
                {/* Step Circle */}
                <div className="flex items-center justify-center mb-3">
                  {step.completed ? (
                    <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg">
                      <Check className="w-5 h-5 text-white" />
                    </div>
                  ) : step.current ? (
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
                      <span className="text-sm font-semibold text-white">{step.id}</span>
                    </div>
                  ) : (
                    <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                    </div>
                  )}
                </div>

                {/* Step Content */}
                <div className="text-center max-w-32">
                  <p
                    className={cn(
                      "text-sm font-medium mb-1",
                      step.current
                        ? "text-blue-600 dark:text-blue-400"
                        : step.completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">{step.description}</p>
                </div>

                {/* Connecting Line */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-1/2 w-full h-px -z-10",
                      step.completed ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700",
                    )}
                    style={{
                      transform: "translateX(20px)",
                      width: "calc(100vw / 4 - 40px)",
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
