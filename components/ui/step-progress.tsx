"use client"

import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

interface Step {
  id: number
  title: string
  description?: string
  completed: boolean
  current: boolean
}

interface StepProgressProps {
  steps: Step[]
  className?: string
  variant?: "sidebar" | "stepper"
}

export function StepProgress({ steps, className, variant = "sidebar" }: StepProgressProps) {
  if (variant === "stepper") {
    return (
      <div
        className={cn(
          "w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-4",
          className,
        )}
      >
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">
                  {step.completed ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : step.current ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-sm font-medium text-white">{step.id}</span>
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                    </div>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs",
                      step.current
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : step.completed
                          ? "text-emerald-600 dark:text-emerald-400 font-medium"
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
                    "w-full h-px mx-2 sm:mx-4",
                    step.completed ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700",
                  )}
                  style={{ maxWidth: "24px" }}
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
      className={cn("w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6", className)}
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Task Force Setup</h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Define your AI project</p>
        </div>

        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center">
                  {step.completed ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  ) : step.current ? (
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <span className="text-sm font-medium text-white">{step.id}</span>
                    </motion.div>
                  ) : (
                    <div className="w-8 h-8 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{step.id}</span>
                    </div>
                  )}
                </div>
                <div className="mt-3 text-center">
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
                  {step.description && (
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{step.description}</p>
                  )}
                </div>
              </div>

              {index < steps.length - 1 && (
                <div
                  className={cn("w-16 h-px mx-4", step.completed ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700")}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
