"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"

interface Question {
  id: string
  title: string
  description: string
  placeholder: string
  required?: boolean
}

interface QuestionAccordionProps {
  questions: Question[]
  answers: Record<string, string>
  onAnswerChange: (questionId: string, answer: string) => void
}

export function QuestionAccordion({ questions, answers, onAnswerChange }: QuestionAccordionProps) {
  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <motion.div
          key={question.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="border-slate-200 dark:border-slate-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">
                {question.title}
                {question.required && <span className="text-red-500 ml-1">*</span>}
              </CardTitle>
              <p className="text-sm text-slate-600 dark:text-slate-400">{question.description}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor={question.id} className="sr-only">
                  {question.title}
                </Label>
                <Textarea
                  id={question.id}
                  placeholder={question.placeholder}
                  value={answers[question.id] || ""}
                  onChange={(e) => onAnswerChange(question.id, e.target.value)}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
