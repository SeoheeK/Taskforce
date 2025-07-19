"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Bot, Target, Package, Wrench, ExternalLink, FileText } from "lucide-react"
import { motion } from "framer-motion"

interface ProjectDraftProps {
  domain: string
  answers: Record<string, string>
}

export function ProjectDraft({ domain, answers }: ProjectDraftProps) {
  // Generate team suggestions based on domain
  const getTeamSuggestions = () => {
    const baseTeam = [
      { role: "Project Manager", type: "human", description: "Oversees project execution and coordination" },
      { role: "AI Coordinator", type: "ai", description: "Manages AI agent interactions and workflows" },
    ]

    const domainSpecificTeams: Record<string, any[]> = {
      "corporate-strategy": [
        ...baseTeam,
        { role: "Strategy Analyst", type: "human", description: "Analyzes business requirements and processes" },
        { role: "Strategy AI", type: "ai", description: "Provides strategic insights and recommendations" },
        { role: "Market Research AI", type: "ai", description: "Conducts market analysis and competitive research" },
      ],
      "rd-product": [
        ...baseTeam,
        { role: "Technical Lead", type: "human", description: "Guides technical implementation" },
        { role: "Research AI", type: "ai", description: "Conducts technical research and analysis" },
        { role: "Prototype AI", type: "ai", description: "Assists with rapid prototyping" },
      ],
      marketing: [
        ...baseTeam,
        { role: "Marketing Manager", type: "human", description: "Oversees campaign strategy and execution" },
        { role: "Content AI", type: "ai", description: "Generates marketing content and copy" },
        { role: "Analytics AI", type: "ai", description: "Analyzes campaign performance and metrics" },
      ],
      sales: [
        ...baseTeam,
        { role: "Sales Manager", type: "human", description: "Manages sales strategy and execution" },
        { role: "Lead Gen AI", type: "ai", description: "Identifies and qualifies potential leads" },
        { role: "CRM AI", type: "ai", description: "Manages customer relationship data" },
      ],
      "operations-scm": [
        ...baseTeam,
        { role: "Operations Manager", type: "human", description: "Oversees operational processes" },
        { role: "Process AI", type: "ai", description: "Analyzes and optimizes workflows" },
        { role: "Automation AI", type: "ai", description: "Identifies automation opportunities" },
      ],
      "customer-experience": [
        ...baseTeam,
        { role: "CX Manager", type: "human", description: "Oversees customer experience initiatives" },
        { role: "Sentiment AI", type: "ai", description: "Analyzes customer feedback and sentiment" },
        { role: "Journey AI", type: "ai", description: "Maps and optimizes customer journeys" },
      ],
      "it-system": [
        ...baseTeam,
        { role: "IT Manager", type: "human", description: "Oversees technical implementation" },
        { role: "System AI", type: "ai", description: "Analyzes system architecture and requirements" },
        { role: "DevOps AI", type: "ai", description: "Assists with deployment and operations" },
      ],
      "policy-public": [
        ...baseTeam,
        { role: "Policy Analyst", type: "human", description: "Analyzes policy implications and requirements" },
        { role: "Research AI", type: "ai", description: "Conducts policy research and analysis" },
        { role: "Documentation AI", type: "ai", description: "Assists with document preparation and review" },
      ],
    }

    return domainSpecificTeams[domain] || baseTeam
  }

  // Extract objective from answers
  const getObjective = () => {
    return answers.goal || "Define and execute project objectives"
  }

  // Generate deliverables based on domain
  const getDeliverables = () => {
    const deliverablesByDomain: Record<string, string[]> = {
      "corporate-strategy": [
        "Strategic Plan Document",
        "Market Analysis Report",
        "Implementation Roadmap",
        "Stakeholder Presentation",
      ],
      "rd-product": ["Product Specifications", "Prototype/MVP", "Technical Documentation", "Testing Results"],
      marketing: ["Campaign Strategy Document", "Creative Assets", "Performance Dashboard", "ROI Analysis Report"],
      sales: [
        "Sales Strategy Plan",
        "Channel Development Plan",
        "Sales Enablement Materials",
        "Performance Metrics Dashboard",
      ],
      "operations-scm": [
        "Process Documentation",
        "Optimization Recommendations",
        "Implementation Plan",
        "Performance Metrics",
      ],
      "customer-experience": [
        "Customer Journey Maps",
        "Voice of Customer Analysis",
        "Experience Improvement Plan",
        "CX Metrics Dashboard",
      ],
      "it-system": [
        "System Architecture Document",
        "Implementation Plan",
        "Testing Documentation",
        "User Training Materials",
      ],
      "policy-public": [
        "Policy Proposal Document",
        "Impact Analysis Report",
        "Implementation Framework",
        "Stakeholder Engagement Plan",
      ],
    }

    return (
      deliverablesByDomain[domain] || [
        "Project Documentation",
        "Implementation Plan",
        "Progress Reports",
        "Final Deliverable",
      ]
    )
  }

  // Generate tool recommendations based on domain
  const getToolRecommendations = () => {
    const toolsByDomain: Record<string, string[]> = {
      "corporate-strategy": ["Miro", "Notion", "Tableau", "Slack"],
      "rd-product": ["GitHub", "Figma", "Jira", "Confluence"],
      marketing: ["HubSpot", "Canva", "Google Analytics", "Buffer"],
      sales: ["Salesforce", "HubSpot", "Calendly", "Zoom"],
      "operations-scm": ["Asana", "Power BI", "Process Street", "Monday"],
      "customer-experience": ["Qualtrics", "Hotjar", "Zendesk", "Miro"],
      "it-system": ["GitHub", "Docker", "Jenkins", "Terraform"],
      "policy-public": ["Notion", "Airtable", "Tableau", "Microsoft Teams"],
    }

    return toolsByDomain[domain] || ["Notion", "Slack", "GitHub", "Figma"]
  }

  const team = getTeamSuggestions()
  const objective = getObjective()
  const deliverables = getDeliverables()
  const tools = getToolRecommendations()

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Objective */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Target className="w-4 h-4 text-blue-500 mr-2" />
          <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">
            Objective & Strategy
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-slate-700 dark:text-slate-300">
          <p>{objective}</p>
        </CardContent>
      </Card>

      {/* Team Suggestions */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Users className="w-4 h-4 text-emerald-500 mr-2" />
          <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">Recommended Team</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {team.map((member, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-900 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback
                      className={`text-xs ${
                        member.type === "ai" ? "bg-blue-100 text-blue-600" : "bg-emerald-100 text-emerald-600"
                      }`}
                    >
                      {member.type === "ai" ? (
                        <Bot className="w-3 h-3" />
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
                    <p className="text-xs text-slate-500 dark:text-slate-400">{member.description}</p>
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

      {/* Deliverables */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Package className="w-4 h-4 text-purple-500 mr-2" />
          <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">
            Expected Deliverables
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {deliverables.map((deliverable, index) => (
              <div
                key={index}
                className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-100 dark:border-purple-900"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{deliverable}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tool Recommendations */}
      <Card className="border-slate-200 dark:border-slate-800">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Wrench className="w-4 h-4 text-orange-500 mr-2" />
          <CardTitle className="text-base font-medium text-slate-900 dark:text-slate-100">Recommended Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-2">
            {tools.map((tool, index) => (
              <div
                key={index}
                className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-100 dark:border-orange-900 text-center"
              >
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{tool}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-2">
        <Button className="flex-1 flex items-center justify-center space-x-2 text-sm">
          <FileText className="w-4 h-4" />
          <span>Start with this plan</span>
        </Button>
        <Button variant="outline" className="flex-1 flex items-center justify-center space-x-2 text-sm">
          <ExternalLink className="w-4 h-4" />
          <span>Export to Notion</span>
        </Button>
      </div>
    </motion.div>
  )
}
