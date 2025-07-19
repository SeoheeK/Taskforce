"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

interface Question {
  id: string
  type: "text" | "textarea" | "select" | "multiselect"
  title: string
  description: string
  placeholder?: string
  options?: string[]
  required?: boolean
}

interface QuestionCardProps {
  question: Question
  value: any
  onChange: (value: any) => void
}

export function QuestionCard({ question, value, onChange }: QuestionCardProps) {
  const renderInput = () => {
    switch (question.type) {
      case "text":
        return (
          <Input placeholder={question.placeholder} value={value || ""} onChange={(e) => onChange(e.target.value)} />
        )

      case "textarea":
        return (
          <Textarea
            placeholder={question.placeholder}
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            rows={4}
          />
        )

      case "select":
        return (
          <Select value={value || ""} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={question.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case "multiselect":
        return (
          <div className="space-y-3">
            {question.options?.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={value?.includes(option) || false}
                  onCheckedChange={(checked) => {
                    const currentValue = value || []
                    if (checked) {
                      onChange([...currentValue, option])
                    } else {
                      onChange(currentValue.filter((v: string) => v !== option))
                    }
                  }}
                />
                <Label htmlFor={option} className="text-sm font-normal">
                  {option}
                </Label>
              </div>
            ))}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Card className="border-slate-200">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-medium text-slate-900">
          {question.title}
          {question.required && <span className="text-red-500 ml-1">*</span>}
        </CardTitle>
        <p className="text-sm text-slate-600">{question.description}</p>
      </CardHeader>
      <CardContent>{renderInput()}</CardContent>
    </Card>
  )
}
