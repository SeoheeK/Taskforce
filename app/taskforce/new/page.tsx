"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react"
import { StepProgress } from "@/components/ui/step-progress"
import { DomainCard } from "@/components/domain-card"
import { ToggleOption } from "@/components/toggle-option"
import { FormQuestion } from "@/components/form-question"
import { PromptPreview } from "@/components/prompt-preview"
import { ProjectDraft } from "@/components/project-draft"
import { motion, AnimatePresence } from "framer-motion"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"

const projectDomains = [
  {
    id: "corporate-strategy",
    icon: "🧭",
    title: "Corporate Strategy",
    tags: ["New Business", "Vision", "Governance"],
  },
  {
    id: "rd-product",
    icon: "🧪",
    title: "R&D / Product Dev",
    tags: ["MVP", "PoC", "AI Service"],
  },
  {
    id: "marketing",
    icon: "📣",
    title: "Marketing",
    tags: ["Campaign", "Funnel", "Brand"],
  },
  {
    id: "sales",
    icon: "🛍",
    title: "Sales",
    tags: ["Channel Strategy", "B2B", "Promotion"],
  },
  {
    id: "operations-scm",
    icon: "⚙️",
    title: "Operations / SCM",
    tags: ["Automation", "Supply Chain", "Efficiency"],
  },
  {
    id: "customer-experience",
    icon: "💬",
    title: "Customer Experience",
    tags: ["VOC", "CS Flow", "Journey"],
  },
  {
    id: "it-system",
    icon: "💻",
    title: "IT / System",
    tags: ["System Migration", "Data Infra", "DevOps"],
  },
  {
    id: "policy-public",
    icon: "📜",
    title: "Policy / Public",
    tags: ["Policy Proposal", "Gov Collaboration", "Public Data"],
  },
  {
    id: "compliance-risk",
    icon: "⚖️",
    title: "Compliance / Risk",
    tags: ["ESG", "Internal Audit", "Risk Assessment"],
  },
  {
    id: "finance-investment",
    icon: "💰",
    title: "Finance / Investment",
    tags: ["Budget", "M&A", "Investment Analysis"],
  },
  {
    id: "hr-organization",
    icon: "👥",
    title: "HR / Organization",
    tags: ["Org Design", "Learning", "Recruiting"],
  },
  {
    id: "sustainability-esg",
    icon: "🌱",
    title: "Sustainability / ESG",
    tags: ["Carbon Strategy", "CSR", "Reporting"],
  },
  {
    id: "data-analytics",
    icon: "📊",
    title: "Data / Analytics",
    tags: ["Data Strategy", "Predictive Analytics", "BI"],
  },
  {
    id: "legal-ip",
    icon: "📜",
    title: "Legal / IP",
    tags: ["Contract Review", "IP Strategy", "Legal Risk"],
  },
  {
    id: "change-management",
    icon: "🔄",
    title: "Change Management",
    tags: ["Transformation", "Change Readiness"],
  },
  {
    id: "partnership-ecosystem",
    icon: "🤝",
    title: "Partnership / Ecosystem",
    tags: ["Alliance", "Open Innovation"],
  },
]

const toggleOptions = [
  {
    id: "projectScope",
    title: "Internal vs External facing?",
    options: [
      { value: "internal", label: "Internal" },
      { value: "external", label: "External" },
    ],
    type: "toggle",
  },
  {
    id: "timelineUrgency",
    title: "Timeline urgency?",
    options: [
      { value: "standard", label: "Standard" },
      { value: "urgent", label: "Urgent" },
    ],
    type: "toggle",
  },
  {
    id: "crossDepartmental",
    title: "Cross-departmental?",
    options: [
      { value: "single", label: "Single dept" },
      { value: "cross", label: "Cross-dept" },
    ],
    type: "toggle",
  },
]

const formQuestions = [
  {
    id: "goal",
    title: "What is the main goal of this project?",
    helperText: "Define the primary objective and purpose of this task force project.",
    placeholder:
      "e.g., Develop a new customer onboarding process that reduces setup time by 50% while improving satisfaction scores.",
    required: true,
  },
  {
    id: "background",
    title: "Describe the current situation and background.",
    helperText: "Provide context about the current state and why this project is needed.",
    placeholder:
      "e.g., Our current onboarding process takes an average of 14 days and involves multiple handoffs between departments...",
    required: true,
  },
  {
    id: "constraints",
    title: "What constraints or risks should we consider?",
    helperText: "List any limitations, requirements, or potential challenges.",
    placeholder: "e.g., Budget limitations, regulatory requirements, technical constraints, stakeholder concerns...",
    required: false,
  },
  {
    id: "deliverables",
    title: "What are the expected outputs or deliverables?",
    helperText: "Describe the tangible results you expect from this project.",
    placeholder: "e.g., Process documentation, implementation plan, training materials, dashboard for monitoring...",
    required: true,
  },
  {
    id: "stakeholders",
    title: "Who are the key stakeholders involved?",
    helperText: "List the main stakeholders and their roles or interests.",
    placeholder:
      "e.g., Customer Success team (process owners), IT department (system implementation), Executive team (approval)...",
    required: false,
  },
  {
    id: "timeline",
    title: "What is your expected timeline?",
    helperText: "Provide information about project duration and key milestones.",
    placeholder:
      "e.g., Total duration: 3 months. Key milestones: Research (2 weeks), Design (4 weeks), Implementation (6 weeks)...",
    required: false,
  },
  {
    id: "success",
    title: "How will you measure success?",
    helperText: "Define the metrics or criteria to evaluate project success.",
    placeholder:
      "e.g., Reduce onboarding time to 7 days or less, Improve customer satisfaction scores to 8+/10, Decrease support tickets by 30%...",
    required: false,
  },
  {
    id: "additional",
    title: "Any additional information?",
    helperText: "Share any other relevant details that might help the AI task force.",
    placeholder: "e.g., Previous attempts, related projects, specific preferences, additional context...",
    required: false,
  },
]

export default function NewTaskforcePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null)
  const [toggleValues, setToggleValues] = useState<Record<string, string>>({
    projectScope: "internal",
    timelineUrgency: "standard",
    crossDepartmental: "single",
  })
  const [formAnswers, setFormAnswers] = useState<Record<string, string>>({})

  const isDesktop = useMediaQuery("(min-width: 1024px)")
  const router = useRouter()

  const steps = [
    {
      id: 1,
      title: "Project Domain",
      description: "Select domain type",
      completed: currentStep > 1,
      current: currentStep === 1,
    },
    {
      id: 2,
      title: "Quick Options",
      description: "Basic parameters",
      completed: currentStep > 2,
      current: currentStep === 2,
    },
    {
      id: 3,
      title: "Project Details",
      description: "Define requirements",
      completed: currentStep > 3,
      current: currentStep === 3,
    },
    {
      id: 4,
      title: "AI Prompt",
      description: "Review prompt",
      completed: currentStep > 4,
      current: currentStep === 4,
    },
    {
      id: 5,
      title: "Project Draft",
      description: "Review plan",
      completed: false,
      current: currentStep === 5,
    },
  ]

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleDomainSelect = (domainId: string) => {
    setSelectedDomain(domainId)
  }

  const handleToggleChange = (id: string, value: string) => {
    setToggleValues((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const handleFormAnswerChange = (id: string, value: string) => {
    setFormAnswers((prev) => ({
      ...prev,
      [id]: value,
    }))
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedDomain !== null
      case 2:
        return true // Toggle options are optional
      case 3:
        const requiredQuestions = formQuestions.filter((q) => q.required)
        return requiredQuestions.every((q) => formAnswers[q.id] && formAnswers[q.id].trim() !== "")
      case 4:
      case 5:
        return true
      default:
        return false
    }
  }

  const getSelectedDomainTitle = () => {
    if (!selectedDomain) return ""
    const domain = projectDomains.find((d) => d.id === selectedDomain)
    return domain ? domain.title : ""
  }

  const handleSubmit = async () => {
    try {
      // Create project data from form inputs
      const projectData = {
        title: formAnswers.goal?.split("\n")[0] || `New ${getSelectedDomainTitle()} Project`,
        problem_description: formAnswers.background || "",
        domain: getSelectedDomainTitle(),
        domain_id: selectedDomain,
        project_type: selectedDomain,
        details: {
          goal: formAnswers.goal || "",
          background: formAnswers.background || "",
          constraints: formAnswers.constraints || "",
          deliverables: formAnswers.deliverables || "",
          stakeholders: formAnswers.stakeholders || "",
          timeline: formAnswers.timeline || "",
          success_metrics: formAnswers.success || "",
          additional_info: formAnswers.additional || "",
          project_scope: toggleValues.projectScope,
          timeline_urgency: toggleValues.timelineUrgency,
          cross_departmental: toggleValues.crossDepartmental,
        },
        status: "planning",
        created_at: new Date().toISOString(),
      }

      // Submit to API
      const response = await fetch("/api/taskforce/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(projectData),
      })

      if (!response.ok) {
        throw new Error("Failed to create project")
      }

      const result = await response.json()

      // Redirect to projects page
      router.push("/total-projects")
    } catch (error) {
      console.error("Error creating project:", error)
      // You could add error handling UI here
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <div className="w-full">
        {/* Progress Bar */}
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="space-y-1">
              <h1 className="text-2xl lg:text-3xl font-semibold text-slate-900 dark:text-slate-100">
                New AI Task Force Project
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-400">
                Define your project requirements and let AI help you with team composition and planning.
              </p>
            </div>
            <StepProgress steps={steps} variant="horizontal" />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Step Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step 1: Project Domain Selection */}
                {currentStep === 1 && (
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Select Project Domain</h2>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Choose the domain that best matches your project type.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {projectDomains.map((domain) => (
                        <DomainCard
                          key={domain.id}
                          domain={domain}
                          isSelected={selectedDomain === domain.id}
                          onSelect={handleDomainSelect}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 2: Quick Structured Inputs */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Quick Project Parameters</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Set these basic parameters to help define your {getSelectedDomainTitle()} project.
                    </p>

                    <div className="space-y-4 bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                      {toggleOptions.map((option) => (
                        <ToggleOption
                          key={option.id}
                          id={option.id}
                          title={option.title}
                          options={option.options}
                          value={toggleValues[option.id]}
                          onChange={(value) => handleToggleChange(option.id, value)}
                          type={option.type as "toggle" | "radio"}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Free-Form Input */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Project Details</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Provide detailed information about your {getSelectedDomainTitle()} project.
                    </p>

                    <div className="space-y-6">
                      {formQuestions.map((question) => (
                        <FormQuestion
                          key={question.id}
                          id={question.id}
                          title={question.title}
                          helperText={question.helperText}
                          placeholder={question.placeholder}
                          value={formAnswers[question.id] || ""}
                          onChange={(value) => handleFormAnswerChange(question.id, value)}
                          required={question.required}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 4: AI Prompt Preview */}
                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">AI Prompt Preview</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Review the generated prompt that will guide your AI task force team.
                    </p>

                    <PromptPreview domain={getSelectedDomainTitle()} answers={formAnswers} toggles={toggleValues} />
                  </div>
                )}

                {/* Step 5: Project Draft */}
                {currentStep === 5 && (
                  <div className="space-y-4">
                    <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">Project Draft Summary</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Review the recommended team composition, deliverables, and tools for your project.
                    </p>

                    <ProjectDraft domain={selectedDomain || ""} answers={formAnswers} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="flex justify-between items-center mt-8 pt-4 border-t border-slate-200 dark:border-slate-700"
            >
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="text-sm flex items-center space-x-2 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </Button>

              <div className="flex items-center space-x-4">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Step {currentStep} of {steps.length}
                </span>

                {currentStep < 5 ? (
                  <Button onClick={handleNext} disabled={!canProceed()} className="text-sm flex items-center space-x-2">
                    <span>Next</span>
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} className="text-sm flex items-center space-x-2">
                    <Sparkles className="w-4 h-4" />
                    <span>Create Task Force</span>
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
