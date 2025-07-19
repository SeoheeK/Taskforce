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

interface ProgressStepperProps {
  steps: Step[]
  className?: string
  orientation?: "horizontal" | "vertical"
}

export function ProgressStepper({ steps, className, orientation = "vertical" }: ProgressStepperProps) {
  if (orientation === "horizontal") {
    return (
      <div className={cn("bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 p-4", className)}>
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center">
                  {step.completed ? (
                    <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  ) : step.current ? (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-white">{step.id}</span>
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-medium",
                      step.current
                        ? "text-blue-600 dark:text-blue-400"
                        : step.completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "w-12 h-px mx-4 mt-[-20px]",
                    step.completed ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "w-80 bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 p-6",
        className,
      )}
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Project Setup</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Follow these steps to create your AI team project
          </p>
        </div>

        <nav className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="relative">
              <div className="flex items-start space-x-3">
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
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p
                    className={cn(
                      "text-sm font-medium",
                      step.current
                        ? "text-blue-600 dark:text-blue-400"
                        : step.completed
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-slate-500 dark:text-slate-400",
                    )}
                  >
                    {step.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{step.description}</p>
                </div>
              </div>

              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-6 bg-slate-200 dark:bg-slate-700" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  )
}
