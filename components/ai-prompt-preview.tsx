"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Sparkles } from "lucide-react"
import { motion } from "framer-motion"

interface AIPromptPreviewProps {
  projectSubtype: string
  answers: Record<string, string>
  subtypeName: string
}

export function AIPromptPreview({ projectSubtype, answers, subtypeName }: AIPromptPreviewProps) {
  const [copied, setCopied] = useState(false)

  const generatePrompt = () => {
    const answeredQuestions = Object.entries(answers).filter(([_, answer]) => answer.trim() !== "")

    if (answeredQuestions.length === 0) {
      return "Start answering questions to see your AI project prompt preview..."
    }

    let prompt = `# AI Task Force Project Brief\n\n`
    prompt += `**Project Type:** ${subtypeName}\n\n`

    answeredQuestions.forEach(([questionId, answer]) => {
      const questionTitles: Record<string, string> = {
        problem: "## Problem Statement",
        objective: "## Project Objective",
        scope: "## Project Scope",
        constraints: "## Constraints & Requirements",
        success: "## Success Criteria",
        timeline: "## Timeline & Milestones",
        resources: "## Required Resources",
        stakeholders: "## Key Stakeholders",
        deliverables: "## Expected Deliverables",
        risks: "## Potential Risks & Challenges",
      }

      const title = questionTitles[questionId] || `## ${questionId.charAt(0).toUpperCase() + questionId.slice(1)}`
      prompt += `${title}\n${answer}\n\n`
    })

    prompt += `## AI Task Force Instructions\n`
    prompt += `Please analyze this project brief and provide:\n`
    prompt += `1. Recommended team composition with specific AI agent roles\n`
    prompt += `2. Detailed project execution plan with phases and milestones\n`
    prompt += `3. Risk assessment and mitigation strategies\n`
    prompt += `4. Success metrics and KPIs\n`
    prompt += `5. Resource allocation recommendations\n\n`
    prompt += `Focus on creating an actionable, comprehensive plan that addresses all aspects of this ${subtypeName.toLowerCase()} project.`

    return prompt
  }

  const handleCopy = async () => {
    const prompt = generatePrompt()
    await navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const prompt = generatePrompt()
  const hasContent = Object.values(answers).some((answer) => answer.trim() !== "")

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-blue-500" />
            <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">
              AI Project Prompt Preview
            </CardTitle>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {subtypeName}
            </Badge>
            {hasContent && (
              <Button variant="ghost" size="sm" onClick={handleCopy} className="h-8 w-8 p-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
            <pre className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap font-mono overflow-x-auto">
              {prompt}
            </pre>
          </div>
          {hasContent && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleCopy} size="sm" className="flex items-center space-x-2">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? "Copied!" : "Copy Prompt"}</span>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
