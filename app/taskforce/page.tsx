"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import {
  ArrowRight,
  ArrowLeft,
  Target,
  Lightbulb,
  Sparkles,
  Clock,
  Zap,
  AlertCircle,
  Goal,
  UserCog,
  Settings,
  RefreshCw,
} from "lucide-react"

interface ProjectTemplate {
  id: string
  name: string
  description: string
  icon: string
  suggestedExperts: string[]
  estimatedDuration: string
}

interface ExpertRecommendation {
  id: number
  name: string
  role: string
  description: string
  avatar_url: string
  relevanceScore: number
  reason: string
  priority: "high" | "medium" | "low"
}

const projectTemplates: ProjectTemplate[] = [
  {
    id: "mobile-app",
    name: "모바일 앱 개발",
    description: "새로운 모바일 애플리케이션 기획부터 출시까지",
    icon: "📱",
    suggestedExperts: ["개발자", "디자이너", "PM", "마케터"],
    estimatedDuration: "2-3개월",
  },
  {
    id: "marketing-campaign",
    name: "마케팅 캠페인",
    description: "브랜드 인지도 향상을 위한 통합 마케팅 전략",
    icon: "📢",
    suggestedExperts: ["마케터", "분석가", "디자이너", "전략가"],
    estimatedDuration: "1-2개월",
  },
  {
    id: "business-strategy",
    name: "비즈니스 전략",
    description: "시장 분석 및 사업 전략 수립",
    icon: "📊",
    suggestedExperts: ["전략가", "분석가", "PM"],
    estimatedDuration: "3-4주",
  },
  {
    id: "product-launch",
    name: "제품 출시",
    description: "신제품 런칭을 위한 종합적인 계획 수립",
    icon: "🚀",
    suggestedExperts: ["PM", "마케터", "전략가", "QA"],
    estimatedDuration: "1-2개월",
  },
  {
    id: "custom",
    name: "커스텀 프로젝트",
    description: "나만의 특별한 프로젝트를 직접 설계",
    icon: "⚡",
    suggestedExperts: [],
    estimatedDuration: "유동적",
  },
]

export default function NewTaskforcePage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [isGeneratingStrategy, setIsGeneratingStrategy] = useState(false)
  const [recommendedExperts, setRecommendedExperts] = useState<ExpertRecommendation[]>([])
  const [selectedExperts, setSelectedExperts] = useState<number[]>([])

  const [formData, setFormData] = useState({
    // Step 1: Problem Definition
    currentSituation: "",
    problemDescription: "",
    solutionGoals: "",
    background: "",
    keyIssues: "",

    // Step 2: Goal Setting
    objectives: "",
    quantitativeKPIs: "",
    qualitativeKPIs: "",
    template: "",

    // Step 3: Strategy (AI Generated)
    approachStrategy: "",
    challenges: "",
    resourcesNeeded: "",

    // Step 4: Expert Recommendation
    // (uses recommendedExperts state)

    // Step 5: Team Formation
    teamStructure: "",
    rolesResponsibilities: "",

    // Step 6: Project Setting
    timeline: "",
    budget: "",
    meetingCadence: "weekly",
    deliverables: "",
    successMetrics: "",
    priority: "medium",
    deadline: "",
  })

  const totalSteps = 6

  useEffect(() => {
    if (currentStep === 3 && formData.background && formData.objectives && !formData.approachStrategy) {
      generateStrategy()
    }
  }, [currentStep, formData.background, formData.objectives])

  useEffect(() => {
    if (currentStep === 4 && formData.approachStrategy) {
      generateExpertRecommendations()
    }
  }, [currentStep, formData.approachStrategy])

  const generateStrategy = async () => {
    setIsGeneratingStrategy(true)
    try {
      const response = await fetch("/api/ai/generate-strategy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSituation: formData.currentSituation,
          problemDescription: formData.problemDescription,
          solutionGoals: formData.solutionGoals,
          background: formData.background,
          keyIssues: formData.keyIssues,
          objectives: formData.objectives,
          quantitativeKPIs: formData.quantitativeKPIs,
          qualitativeKPIs: formData.qualitativeKPIs,
          template: formData.template,
        }),
      })

      const strategy = await response.json()
      setFormData({
        ...formData,
        approachStrategy: strategy.approachStrategy,
        challenges: strategy.challenges,
        resourcesNeeded: strategy.resourcesNeeded,
      })
    } catch (error) {
      console.error("전략 생성 실패:", error)
      // 기본 전략 제공
      setFormData({
        ...formData,
        approachStrategy:
          "프로젝트 목표 달성을 위한 단계별 접근 방식을 수립하고, 핵심 이해관계자들과의 협력을 통해 체계적으로 진행합니다.",
        challenges: "일정 관리, 품질 보장, 리소스 최적화 등의 과제가 예상됩니다.",
        resourcesNeeded: "프로젝트 관리 도구, 전문 인력, 기술적 리소스가 필요합니다.",
      })
    } finally {
      setIsGeneratingStrategy(false)
    }
  }

  const generateExpertRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/recommend-experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSituation: formData.currentSituation,
          problemDescription: formData.problemDescription,
          solutionGoals: formData.solutionGoals,
          background: formData.background,
          objectives: formData.objectives,
          approachStrategy: formData.approachStrategy,
          challenges: formData.challenges,
          template: formData.template,
        }),
      })

      const recommendations = await response.json()
      setRecommendedExperts(recommendations)

      // 높은 우선순위 전문가들을 자동 선택
      const highPriorityExperts = recommendations.filter((expert: ExpertRecommendation) => expert.priority === "high")
      setSelectedExperts(highPriorityExperts.map((expert: ExpertRecommendation) => expert.id))
    } catch (error) {
      console.error("전문가 추천 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleTemplateSelect = (template: ProjectTemplate) => {
    setFormData({
      ...formData,
      template: template.id,
      timeline: template.estimatedDuration,
    })
  }

  const handleExpertToggle = (expertId: number) => {
    setSelectedExperts((prev) => (prev.includes(expertId) ? prev.filter((id) => id !== expertId) : [...prev, expertId]))
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      // 프로젝트 제목 자동 생성
      const autoGeneratedTitle = `${formData.template ? projectTemplates.find((t) => t.id === formData.template)?.name || "프로젝트" : "프로젝트"} - ${formData.problemDescription.slice(0, 30)}...`

      const response = await fetch("/api/taskforce/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: autoGeneratedTitle, // 자동 생성된 제목 추가
          selectedExperts,
          recommendedExperts,
        }),
      })

      const session = await response.json()
      router.push(`/taskforce/${session.id}`)
    } catch (error) {
      console.error("태스크포스 생성 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.currentSituation && formData.problemDescription && formData.solutionGoals
      case 2:
        return formData.objectives && formData.template
      case 3:
        return formData.approachStrategy
      case 4:
        return selectedExperts.length > 0
      case 5:
        return formData.teamStructure
      case 6:
        return true
      default:
        return false
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStepIcon = (step: number) => {
    switch (step) {
      case 1:
        return <AlertCircle className="h-8 w-8 text-white" />
      case 2:
        return <Goal className="h-8 w-8 text-white" />
      case 3:
        return <Lightbulb className="h-8 w-8 text-white" />
      case 4:
        return <Sparkles className="h-8 w-8 text-white" />
      case 5:
        return <UserCog className="h-8 w-8 text-white" />
      case 6:
        return <Settings className="h-8 w-8 text-white" />
      default:
        return <Target className="h-8 w-8 text-white" />
    }
  }

  const getStepTitle = (step: number) => {
    switch (step) {
      case 1:
        return "Problem Definition"
      case 2:
        return "Goal Setting"
      case 3:
        return "Strategy"
      case 4:
        return "Expert Recommendation"
      case 5:
        return "Team Formation"
      case 6:
        return "Project Setting"
      default:
        return "Step"
    }
  }

  const getStepDescription = (step: number) => {
    switch (step) {
      case 1:
        return "문제의 배경, 현황, 이슈를 정의하세요"
      case 2:
        return "달성하고자 하는 결과와 프로젝트 유형을 설정하세요"
      case 3:
        return "AI가 분석한 최적의 해결 전략을 확인하고 수정하세요"
      case 4:
        return "프로젝트에 필요한 전문가를 선택하세요"
      case 5:
        return "팀 구성과 역할 분담을 설계하세요"
      case 6:
        return "프로젝트 운영 계획을 수립하세요"
      default:
        return "Step Description"
    }
  }

  const getStepColor = (step: number) => {
    const colors = [
      "from-blue-500 to-purple-600",
      "from-green-500 to-teal-600",
      "from-yellow-500 to-orange-600",
      "from-purple-500 to-pink-600",
      "from-blue-600 to-indigo-700",
      "from-green-600 to-emerald-700",
    ]
    return colors[(step - 1) % colors.length]
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            New AI Team Project
          </h1>
          <p className="text-gray-600 text-lg">AI 전문가들과 함께 프로젝트를 성공적으로 완수하세요</p>
        </div>

        {/* 진행률 표시 */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-medium text-gray-600">진행률</span>
            <span className="text-sm font-medium text-gray-600">
              {currentStep}/{totalSteps}
            </span>
          </div>
          <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Problem</span>
            <span>Goal</span>
            <span>Strategy</span>
            <span>Experts</span>
            <span>Team</span>
            <span>Setting</span>
          </div>
        </div>

        {/* Step 1: Problem Definition */}
        {currentStep === 1 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getStepColor(1)} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getStepIcon(1)}
              </div>
              <CardTitle className="text-2xl">{getStepTitle(1)}</CardTitle>
              <CardDescription>{getStepDescription(1)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="currentSituation" className="text-base font-medium">
                  현재상황을 설명해 주세요. *
                </Label>
                <Textarea
                  id="currentSituation"
                  value={formData.currentSituation}
                  onChange={(e) => setFormData({ ...formData, currentSituation: e.target.value })}
                  placeholder="현재 직면하고 있는 상황을 구체적으로 설명해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="problemDescription" className="text-base font-medium">
                  무엇이 문제인가요? *
                </Label>
                <Textarea
                  id="problemDescription"
                  value={formData.problemDescription}
                  onChange={(e) => setFormData({ ...formData, problemDescription: e.target.value })}
                  placeholder="해결해야 할 핵심 문제점을 명확히 설명해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="solutionGoals" className="text-base font-medium">
                  팀원들과 무엇을 해결하고 싶은가요? *
                </Label>
                <Textarea
                  id="solutionGoals"
                  value={formData.solutionGoals}
                  onChange={(e) => setFormData({ ...formData, solutionGoals: e.target.value })}
                  placeholder="팀원들과 함께 달성하고자 하는 목표를 설명해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="background" className="text-base font-medium">
                  왜 TF가 필요한가?
                </Label>
                <Textarea
                  id="background"
                  value={formData.background}
                  onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                  placeholder="이 프로젝트가 필요한 배경과 이유를 설명해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="keyIssues" className="text-base font-medium">
                  핵심 이슈
                </Label>
                <Textarea
                  id="keyIssues"
                  value={formData.keyIssues}
                  onChange={(e) => setFormData({ ...formData, keyIssues: e.target.value })}
                  placeholder="해결해야 할 핵심 이슈들을 나열해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Goal Setting */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="text-center">
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${getStepColor(2)} rounded-full flex items-center justify-center mx-auto mb-4`}
                >
                  {getStepIcon(2)}
                </div>
                <CardTitle className="text-2xl">{getStepTitle(2)}</CardTitle>
                <CardDescription>{getStepDescription(2)}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="objectives" className="text-base font-medium">
                    달성하고자 하는 결과 *
                  </Label>
                  <Textarea
                    id="objectives"
                    value={formData.objectives}
                    onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                    placeholder="이 프로젝트를 통해 달성하고자 하는 구체적인 결과를 설명해주세요..."
                    rows={4}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="quantitativeKPIs" className="text-base font-medium">
                    정량적 KPI
                  </Label>
                  <Textarea
                    id="quantitativeKPIs"
                    value={formData.quantitativeKPIs}
                    onChange={(e) => setFormData({ ...formData, quantitativeKPIs: e.target.value })}
                    placeholder="측정 가능한 수치적 목표를 설정해주세요 (예: 사용자 증가율 20%, 전환율 5% 향상)..."
                    rows={3}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="qualitativeKPIs" className="text-base font-medium">
                    정성적 KPI
                  </Label>
                  <Textarea
                    id="qualitativeKPIs"
                    value={formData.qualitativeKPIs}
                    onChange={(e) => setFormData({ ...formData, qualitativeKPIs: e.target.value })}
                    placeholder="질적인 성공 기준을 설정해주세요 (예: 사용자 만족도 향상, 브랜드 인지도 증가)..."
                    rows={3}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle>프로젝트 유형 선택</CardTitle>
                <CardDescription>가장 적합한 프로젝트 템플릿을 선택하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectTemplates.map((template) => (
                    <div
                      key={template.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        formData.template === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => handleTemplateSelect(template)}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{template.icon}</div>
                        <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
                        <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                        <div className="flex items-center justify-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {template.estimatedDuration}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Strategy (AI Generated) */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getStepColor(3)} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getStepIcon(3)}
              </div>
              <CardTitle className="text-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                {getStepTitle(3)}
              </CardTitle>
              <CardDescription>{getStepDescription(3)}</CardDescription>
            </CardHeader>
            <CardContent>
              {isGeneratingStrategy ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">AI가 최적의 전략을 분석 중입니다...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
                      🤖 AI 분석 결과
                      <Button variant="ghost" size="sm" onClick={generateStrategy} className="ml-2 h-6 w-6 p-0">
                        <RefreshCw className="h-3 w-3" />
                      </Button>
                    </h3>
                    <p className="text-sm text-blue-800">
                      입력하신 문제 정의와 목표를 바탕으로 최적의 해결 전략을 도출했습니다. 필요에 따라 수정하실 수
                      있습니다.
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="approachStrategy" className="text-base font-medium">
                      해결을 위한 방향성 *
                    </Label>
                    <Textarea
                      id="approachStrategy"
                      value={formData.approachStrategy}
                      onChange={(e) => setFormData({ ...formData, approachStrategy: e.target.value })}
                      placeholder="AI가 전략을 생성 중입니다..."
                      rows={4}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="challenges" className="text-base font-medium">
                      예상되는 도전과제
                    </Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
                      placeholder="AI가 도전과제를 분석 중입니다..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="resourcesNeeded" className="text-base font-medium">
                      필요한 전문성과 리소스
                    </Label>
                    <Textarea
                      id="resourcesNeeded"
                      value={formData.resourcesNeeded}
                      onChange={(e) => setFormData({ ...formData, resourcesNeeded: e.target.value })}
                      placeholder="AI가 필요 리소스를 분석 중입니다..."
                      rows={3}
                      className="mt-2"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: Expert Recommendation */}
        {currentStep === 4 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getStepColor(4)} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getStepIcon(4)}
              </div>
              <CardTitle className="text-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                {getStepTitle(4)}
              </CardTitle>
              <CardDescription>{getStepDescription(4)}</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">AI가 최적의 전문가를 분석 중입니다...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                    <h3 className="font-semibold text-blue-900 mb-2">🎯 추천 이유</h3>
                    <p className="text-sm text-blue-800">
                      프로젝트 "{formData.problemDescription.slice(0, 50)}..."의 성공을 위해 다음 전문가들이 필요합니다.
                      각 전문가의 역할과 기여도를 확인하고 팀을 구성하세요.
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {recommendedExperts.map((expert) => (
                      <div
                        key={expert.id}
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedExperts.includes(expert.id)
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleExpertToggle(expert.id)}
                      >
                        <div className="flex items-start space-x-4">
                          <Checkbox checked={selectedExperts.includes(expert.id)} readOnly />
                          <Avatar className="w-12 h-12">
                            <AvatarImage src={expert.avatar_url || "/placeholder.svg"} alt={expert.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                              {expert.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="font-semibold text-gray-900">{expert.name}</h4>
                              <Badge className={getPriorityColor(expert.priority)}>
                                {expert.priority === "high" ? "필수" : expert.priority === "medium" ? "권장" : "선택"}
                              </Badge>
                              <div className="flex items-center text-sm text-gray-500">
                                <Zap className="h-3 w-3 mr-1" />
                                {expert.relevanceScore}% 적합
                              </div>
                            </div>
                            <p className="text-sm text-blue-600 mb-2">{expert.role}</p>
                            <p className="text-sm text-gray-600 mb-2">{expert.description}</p>
                            <div className="bg-yellow-50 p-2 rounded border-l-4 border-yellow-400">
                              <p className="text-sm text-yellow-800">
                                <strong>추천 이유:</strong> {expert.reason}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedExperts.length > 0 && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-2">✅ 선택된 전문가</h4>
                      <p className="text-sm text-green-800">
                        <strong>{selectedExperts.length}명</strong>의 전문가가 선택되었습니다. 다음 단계에서 팀 구성을
                        완료하세요.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 5: Team Formation */}
        {currentStep === 5 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getStepColor(5)} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getStepIcon(5)}
              </div>
              <CardTitle className="text-2xl">{getStepTitle(5)}</CardTitle>
              <CardDescription>{getStepDescription(5)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                <h3 className="font-semibold text-blue-900 mb-2">👥 선택된 전문가</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {recommendedExperts
                    .filter((expert) => selectedExperts.includes(expert.id))
                    .map((expert) => (
                      <div
                        key={expert.id}
                        className="flex items-center space-x-2 p-2 bg-white rounded-lg border border-blue-100"
                      >
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={expert.avatar_url || "/placeholder.svg"} alt={expert.name} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {expert.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm text-gray-900">{expert.name}</p>
                          <p className="text-xs text-blue-600">{expert.role}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              <div>
                <Label htmlFor="teamStructure" className="text-base font-medium">
                  팀 구성 방식 *
                </Label>
                <Textarea
                  id="teamStructure"
                  value={formData.teamStructure}
                  onChange={(e) => setFormData({ ...formData, teamStructure: e.target.value })}
                  placeholder="팀 구성 방식과 필요한 인력 구성을 설명해주세요 (내부 인력, 외부 전문가 포함)..."
                  rows={3}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="rolesResponsibilities" className="text-base font-medium">
                  역할 및 책임(R&R) 분담
                </Label>
                <Textarea
                  id="rolesResponsibilities"
                  value={formData.rolesResponsibilities}
                  onChange={(e) => setFormData({ ...formData, rolesResponsibilities: e.target.value })}
                  placeholder="각 팀원의 역할과 책임을 정의해주세요..."
                  rows={4}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 6: Project Setting */}
        {currentStep === 6 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div
                className={`w-16 h-16 bg-gradient-to-br ${getStepColor(6)} rounded-full flex items-center justify-center mx-auto mb-4`}
              >
                {getStepIcon(6)}
              </div>
              <CardTitle className="text-2xl">{getStepTitle(6)}</CardTitle>
              <CardDescription>{getStepDescription(6)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="deadline">프로젝트 마감일</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="priority">우선순위</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => setFormData({ ...formData, priority: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">높음</SelectItem>
                      <SelectItem value="medium">보통</SelectItem>
                      <SelectItem value="low">낮음</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="budget" className="text-base font-medium">
                  예산 범위
                </Label>
                <Select value={formData.budget} onValueChange={(value) => setFormData({ ...formData, budget: value })}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="예산 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">소규모 (1천만원 이하)</SelectItem>
                    <SelectItem value="medium">중규모 (1천만원 - 1억원)</SelectItem>
                    <SelectItem value="large">대규모 (1억원 이상)</SelectItem>
                    <SelectItem value="unlimited">예산 제한 없음</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="meetingCadence" className="text-base font-medium">
                  회의 주기
                </Label>
                <Select
                  value={formData.meetingCadence}
                  onValueChange={(value) => setFormData({ ...formData, meetingCadence: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">매일</SelectItem>
                    <SelectItem value="weekly">주 1회</SelectItem>
                    <SelectItem value="biweekly">격주</SelectItem>
                    <SelectItem value="monthly">월 1회</SelectItem>
                    <SelectItem value="asNeeded">필요시</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="deliverables" className="text-base font-medium">
                  산출물 구조
                </Label>
                <Textarea
                  id="deliverables"
                  value={formData.deliverables}
                  onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                  placeholder="프로젝트에서 생성될 주요 산출물을 나열해주세요..."
                  rows={3}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="successMetrics" className="text-base font-medium">
                  성과 측정 계획
                </Label>
                <Textarea
                  id="successMetrics"
                  value={formData.successMetrics}
                  onChange={(e) => setFormData({ ...formData, successMetrics: e.target.value })}
                  placeholder="프로젝트 성공을 측정하는 방법과 지표를 설명해주세요..."
                  rows={3}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* 네비게이션 버튼 */}
        <div className="flex justify-between mt-8">
          <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 1} className="flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" />
            이전
          </Button>

          <div className="flex space-x-2">
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center"
              >
                다음
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed() || isLoading}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 flex items-center"
              >
                {isLoading ? "생성 중..." : "태스크포스 시작"}
                <Zap className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
