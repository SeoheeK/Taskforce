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
import { ArrowRight, ArrowLeft, Target, Users, Lightbulb, CheckCircle, Sparkles, Clock, Zap } from "lucide-react"

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
  const [recommendedExperts, setRecommendedExperts] = useState<ExpertRecommendation[]>([])
  const [selectedExperts, setSelectedExperts] = useState<number[]>([])

  const [formData, setFormData] = useState({
    // Step 1: 기본 정보
    title: "",
    description: "",
    objectives: "",

    // Step 2: 프로젝트 유형 및 배경
    template: "",
    background: "",
    challenges: "",
    targetAudience: "",
    budget: "",
    timeline: "",

    // Step 3: 설정
    priority: "medium",
    deadline: "",
  })

  const totalSteps = 4

  useEffect(() => {
    if (currentStep === 3 && formData.description && formData.background) {
      generateExpertRecommendations()
    }
  }, [currentStep, formData.description, formData.background])

  const generateExpertRecommendations = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/ai/recommend-experts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          background: formData.background,
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
      title: formData.title || template.name,
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
      const response = await fetch("/api/taskforce/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
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
        return formData.title && formData.description && formData.objectives
      case 2:
        return formData.template && formData.background
      case 3:
        return selectedExperts.length > 0
      case 4:
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            새 태스크포스 생성
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
            <span>기본 정보</span>
            <span>프로젝트 배경</span>
            <span>전문가 선택</span>
            <span>최종 검토</span>
          </div>
        </div>

        {/* Step 1: 기본 정보 */}
        {currentStep === 1 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">프로젝트 기본 정보</CardTitle>
              <CardDescription>프로젝트의 핵심 정보를 입력해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  프로젝트 제목 *
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="예: 혁신적인 헬스케어 모바일 앱 개발"
                  className="mt-2 h-12"
                />
              </div>

              <div>
                <Label htmlFor="description" className="text-base font-medium">
                  프로젝트 설명 *
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="프로젝트의 목적, 범위, 기대 결과를 구체적으로 설명해주세요..."
                  rows={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="objectives" className="text-base font-medium">
                  주요 목표 *
                </Label>
                <Textarea
                  id="objectives"
                  value={formData.objectives}
                  onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                  placeholder="이 프로젝트를 통해 달성하고자 하는 구체적인 목표들을 나열해주세요..."
                  rows={3}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: 프로젝트 유형 및 배경 */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl">프로젝트 유형 선택</CardTitle>
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

            {formData.template && (
              <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
                <CardHeader>
                  <CardTitle>프로젝트 배경 및 상황</CardTitle>
                  <CardDescription>프로젝트의 배경과 현재 상황을 자세히 설명해주세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="background" className="text-base font-medium">
                      프로젝트 배경 *
                    </Label>
                    <Textarea
                      id="background"
                      value={formData.background}
                      onChange={(e) => setFormData({ ...formData, background: e.target.value })}
                      placeholder="왜 이 프로젝트가 필요한가요? 현재 상황과 문제점을 설명해주세요..."
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
                      placeholder="프로젝트 진행 중 예상되는 어려움이나 위험 요소가 있나요?"
                      rows={3}
                      className="mt-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="targetAudience" className="text-base font-medium">
                        타겟 대상
                      </Label>
                      <Input
                        id="targetAudience"
                        value={formData.targetAudience}
                        onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                        placeholder="예: 20-30대 직장인"
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="budget" className="text-base font-medium">
                        예산 범위
                      </Label>
                      <Select
                        value={formData.budget}
                        onValueChange={(value) => setFormData({ ...formData, budget: value })}
                      >
                        <SelectTrigger className="mt-2">
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
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Step 3: AI 전문가 추천 및 선택 */}
        {currentStep === 3 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl flex items-center justify-center">
                <Sparkles className="h-6 w-6 mr-2 text-yellow-500" />
                AI 추천 전문가
              </CardTitle>
              <CardDescription>프로젝트 분석을 바탕으로 최적의 전문가 팀을 추천해드립니다</CardDescription>
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
                      프로젝트 "{formData.title}"의 성공을 위해 다음 전문가들이 필요합니다. 각 전문가의 역할과 기여도를
                      확인하고 팀을 구성하세요.
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
                      <h4 className="font-semibold text-green-900 mb-2">✅ 선택된 팀 구성</h4>
                      <p className="text-sm text-green-800">
                        <strong>{selectedExperts.length}명</strong>의 전문가가 선택되었습니다. 이 팀으로 프로젝트를
                        성공적으로 완수할 수 있을 것입니다.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 4: 최종 검토 */}
        {currentStep === 4 && (
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">최종 검토</CardTitle>
              <CardDescription>태스크포스 생성 전 모든 정보를 확인해주세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">📋 프로젝트 정보</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">제목:</span>
                        <p className="font-medium">{formData.title}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">설명:</span>
                        <p className="text-sm">{formData.description}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">목표:</span>
                        <p className="text-sm">{formData.objectives}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">🎯 프로젝트 배경</h3>
                    <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">유형:</span>
                        <p className="font-medium">{projectTemplates.find((t) => t.id === formData.template)?.name}</p>
                      </div>
                      <div>
                        <span className="text-sm text-gray-600">배경:</span>
                        <p className="text-sm">{formData.background}</p>
                      </div>
                      {formData.targetAudience && (
                        <div>
                          <span className="text-sm text-gray-600">타겟:</span>
                          <p className="text-sm">{formData.targetAudience}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">👥 선택된 전문가 팀</h3>
                  <div className="space-y-3">
                    {recommendedExperts
                      .filter((expert) => selectedExperts.includes(expert.id))
                      .map((expert) => (
                        <div key={expert.id} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                          <Avatar className="w-10 h-10">
                            <AvatarImage src={expert.avatar_url || "/placeholder.svg"} alt={expert.name} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                              {expert.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{expert.name}</p>
                            <p className="text-sm text-blue-600">{expert.role}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
