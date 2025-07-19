"use client"

import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface FormQuestionProps {
  id: string
  title: string
  helperText: string
  placeholder: string
  value: string
  onChange: (value: string) => void
  required?: boolean
}

export function FormQuestion({
  id,
  title,
  helperText,
  placeholder,
  value,
  onChange,
  required = false,
}: FormQuestionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-2"
    >
      <div className="space-y-1">
        <Label htmlFor={id} className="text-sm font-medium text-slate-900 dark:text-slate-100">
          {title} {required && <span className="text-red-500">*</span>}
        </Label>
        <p className="text-xs text-slate-500 dark:text-slate-400">{helperText}</p>
      </div>
      <Textarea
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-h-[100px] text-sm"
      />
    </motion.div>
  )
}
