"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { cn } from "@/lib/utils"

interface ToggleOptionProps {
  id: string
  title: string
  options: {
    value: string
    label: string
  }[]
  value: string
  onChange: (value: string) => void
  type?: "toggle" | "radio"
}

export function ToggleOption({ id, title, options, value, onChange, type = "radio" }: ToggleOptionProps) {
  if (type === "toggle" && options.length === 2) {
    return (
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-sm text-slate-900 dark:text-slate-100">
          {title}
        </Label>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-xs",
              value === options[0].value ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
            )}
          >
            {options[0].label}
          </span>
          <Switch
            id={id}
            checked={value === options[1].value}
            onCheckedChange={(checked) => onChange(checked ? options[1].value : options[0].value)}
          />
          <span
            className={cn(
              "text-xs",
              value === options[1].value ? "text-slate-900 dark:text-slate-100" : "text-slate-500 dark:text-slate-400",
            )}
          >
            {options[1].label}
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <Label className="text-sm text-slate-900 dark:text-slate-100">{title}</Label>
      <RadioGroup value={value} onValueChange={onChange} className="flex gap-4">
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${id}-${option.value}`} />
            <Label htmlFor={`${id}-${option.value}`} className="text-sm">
              {option.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}
