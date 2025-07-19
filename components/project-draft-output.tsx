"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Bot, Target, Package, Wrench, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectDraftOutputProps {
  projectSubtype: string
  subtypeName: string
  answers: Record<string, string>
}

export function ProjectDraftOutput({ projectSubtype, subtypeName, answers }: ProjectDraftOutputProps) {
  const getTeamSuggestions = () => {
    const baseTeam = [
      { role: "Project Manager", type: "human", description: "Oversees project execution and coordination" },
      { role: "AI Coordinator", type: "ai", description: "Manages AI agent interactions and workflows" },
    ]

    const domainSpecificTeams: Record<string, any[]> = {
      "corporate-strategy-business": [
        ...baseTeam,
        { role: "Business Analyst", type: "human", description: "Analyzes business requirements and processes" },
        { role: "Strategy AI", type: "ai", description: "Provides strategic insights and recommendations" },
        { role: "Market Research AI", type: "ai", description: "Conducts market analysis and competitive research" },
      ],
      "corporate-strategy-vision": [
        ...baseTeam,
        { role: "Strategic Planner", type: "human", description: "Develops long-term strategic plans" },
        { role: "Vision AI", type: "ai", description: "Helps articulate and refine vision statements" },
        { role: "Trend Analysis AI", type: "ai", description: "Identifies industry trends and opportunities" },
      ],
      "rd-poc": [
        ...baseTeam,
        { role: "Technical Lead", type: "human", description: "Guides technical implementation" },
        { role: "Research AI", type: "ai", description: "Conducts technical research and analysis" },
        { role: "Prototype AI", type: "ai", description: "Assists with rapid prototyping" },
      ],
      "rd-mvp": [
        ...baseTeam,
        { role: "Product Manager", type: "human", description: "Defines product requirements and roadmap" },
        { role: "Development AI", type: "ai", description: "Assists with code generation and testing" },
        { role: "UX AI", type: "ai", description: "Provides user experience recommendations" },
      ],
      "marketing-campaign": [
        ...baseTeam,
        { role: "Marketing Manager", type: "human", description: "Oversees campaign strategy and execution" },
        { role: "Content AI", type: "ai", description: "Generates marketing content and copy" },
        { role: "Analytics AI", type: "ai", description: "Analyzes campaign performance and metrics" },
      ],
      "sales-channel": [
        ...baseTeam,
        { role: "Sales Manager", type: "human", description: "Manages sales strategy and execution" },
        { role: "Lead Gen AI", type: "ai", description: "Identifies and qualifies potential leads" },
        { role: "CRM AI", type: "ai", description: "Manages customer relationship data" },
      ],
    }

    return domainSpecificTeams[projectSubtype] || baseTeam
  }

  const getGoalOverview = () => {
    const objective = answers.objective || answers.problem || "Define and execute project objectives"
    const scope = answers.scope || "Project scope to be defined based on requirements"

    return {
      primary: objective,
      scope: scope,
      timeline: answers.timeline || "Timeline to be determined based on project complexity",
    }
  }

  const getDeliverables = () => {
    const deliverablesByType: Record<string, string[]> = {
      "corporate-strategy-business": [
        "Business Plan Document",
        "Market Analysis Report",
        "Financial Projections",
        "Implementation Roadmap",
      ],
      "corporate-strategy-vision": [
        "Vision Statement",
        "Strategic Framework",
        "Long-term Roadmap",
        "Stakeholder Alignment Plan",
      ],
      "rd-poc": ["Technical Proof of Concept", "Feasibility Report", "Architecture Documentation", "Risk Assessment"],
      "rd-mvp": ["Minimum Viable Product", "User Testing Results", "Technical Documentation", "Launch Plan"],
      "marketing-campaign": [
        "Campaign Strategy Document",
        "Creative Assets",
        "Performance Dashboard",
        "ROI Analysis Report",
      ],
      "sales-channel": [
        "Channel Strategy Plan",
        "Sales Process Documentation",
        "Training Materials",
        "Performance Metrics Dashboard",
      ],
    }

    return (
      deliverablesByType[projectSubtype] || [
        "Project Documentation",
        "Implementation Plan",
        "Progress Reports",
        "Final Deliverable",
      ]
    )
  }

  const getToolRecommendations = () => {
    const toolsByType: Record<string, string[]> = {
      "corporate-strategy-business": ["Miro", "Notion", "Tableau", "Slack"],
      "corporate-strategy-vision": ["Figma", "Miro", "Notion", "Loom"],
      "rd-poc": ["GitHub", "Docker", "Postman", "Slack"],
      "rd-mvp": ["GitHub", "Figma", "Vercel", "Linear"],
      "marketing-campaign": ["HubSpot", "Canva", "Google Analytics", "Buffer"],
      "sales-channel": ["Salesforce", "HubSpot", "Calendly", "Zoom"],
    }

    return toolsByType[projectSubtype] || ["Notion", "Slack", "GitHub", "Figma"]
  }

  const team = getTeamSuggestions()
  const goals = getGoalOverview()
  const deliverables = getDeliverables()
  const tools = getToolRecommendations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Goal Overview */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Target className="w-5 h-5 text-blue-500 mr-2" />
          <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">Goal Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Primary Objective</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{goals.primary}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Project Scope</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{goals.scope}</p>
          </div>
          <div>
            <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">Timeline</h4>
            <p className="text-sm text-slate-600 dark:text-slate-400">{goals.timeline}</p>
          </div>
        </CardContent>
      </Card>

      {/* Team Suggestions */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Users className="w-5 h-5 text-emerald-500 mr-2" />
          <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">Recommended Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback
                      className={`text-xs ${
                        member.type === "ai" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {member.type === "ai" ? (
                        <Bot className="w-4 h-4" />
                      ) : (
                        member.role
                          .split(" ")
                          .map((word: string) => word[0])
                          .join("")
                          .slice(0, 2)
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-slate-900 dark:text-slate-100 text-sm">{member.role}</p>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{member.description}</p>
                  </div>
                </div>
                <Badge variant={member.type === "ai" ? "default" : "secondary"} className="text-xs">
                  {member.type === "ai" ? "AI" : "Human"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Expected Deliverables */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Package className="w-5 h-5 text-purple-500 mr-2" />
          <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Expected Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="p-3 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-100 dark:border-purple-800"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{deliverable}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Recommendations */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="flex flex-row items-center space-y-0 pb-3">
          <Wrench className="w-5 h-5 text-orange-500 mr-2" />
          <CardTitle className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Recommended Tools & APIs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-100 dark:border-orange-800 text-center"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tool}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button className="flex-1 flex items-center justify-center space-x-2">
          <ExternalLink className="w-4 h-4" />
          <span>Start with Template</span>
        </Button>
        <Button variant="outline" className="flex-1 flex items-center justify-center space-x-2">
          <Package className="w-4 h-4" />
          <span>Export to Notion</span>
        </Button>
      </div>
    </motion.div>
  )
}
