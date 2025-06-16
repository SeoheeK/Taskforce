"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  FileText,
  Download,
  Eye,
  Search,
  Calendar,
  User,
  Clock,
  CheckCircle,
  FileImage,
  FileCode,
  Presentation,
  Sheet,
  File,
  MessageSquare,
  Archive,
  Copy,
  Users,
  Zap,
  Star,
  TrendingUp,
  BarChart3,
  Plus,
  Briefcase,
} from "lucide-react"

interface CompletedProject {
  id: number
  title: string
  description: string
  status: "completed"
  completedAt: string
  duration: number // days
  totalDeliverables: number
  participants: number
  successRate: number
  template: ProjectTemplate
  deliverables: Deliverable[]
  stats: {
    totalHours: number
    avgRating: number
    efficiency: number
  }
}

interface ProjectTemplate {
  id: number
  name: string
  description: string
  personas: Array<{
    id: number
    name: string
    role: string
    expertise: string[]
  }>
  mcpTools: Array<{
    id: number
    name: string
    type: string
    config: any
  }>
  messageTypes: string[]
  outputFormats: string[]
  interactionModes: string[]
  evaluationMetrics: string[]
  missionTypes: string[]
  roleCapabilities: string[]
  knowledgeAssets: string[]
  workflow: Array<{
    step: number
    name: string
    description: string
    estimatedHours: number
  }>
}

interface Deliverable {
  id: number
  title: string
  description: string
  fileName: string
  fileType: string
  fileSize: number
  category: string
  status: string
  version: string
  tags: string[]
  createdAt: string
  updatedAt: string
  createdBy: {
    id: number
    name: string
    role: string
    avatar: string
  }
  rating: number
  downloadCount: number
}

export default function HistoryPage() {
  const [projects, setProjects] = useState<CompletedProject[]>([])
  const [selectedProject, setSelectedProject] = useState<CompletedProject | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [sortBy, setSortBy] = useState("completedAt")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  useEffect(() => {
    fetchCompletedProjects()
  }, [])

  const fetchCompletedProjects = async () => {
    // 임시 데이터 (실제로는 API 호출)
    setProjects([
      {
        id: 1,
        title: "모바일 헬스케어 앱 기획",
        description: "사용자 맞춤형 건강 관리 모바일 애플리케이션 전체 기획 및 설계",
        status: "completed",
        completedAt: "2024-01-15T16:30:00Z",
        duration: 12,
        totalDeliverables: 8,
        participants: 4,
        successRate: 95,
        stats: {
          totalHours: 156,
          avgRating: 4.8,
          efficiency: 92,
        },
        template: {
          id: 1,
          name: "모바일 앱 기획 템플릿",
          description: "모바일 애플리케이션 기획을 위한 종합 템플릿",
          personas: [
            {
              id: 1,
              name: "전략가 알렉스",
              role: "Strategic Planner",
              expertise: ["전략기획", "시장분석", "비즈니스모델"],
            },
            { id: 2, name: "개발자 사라", role: "Technical Lead", expertise: ["모바일개발", "시스템설계", "기술검토"] },
            { id: 3, name: "디자이너 마크", role: "UX Designer", expertise: ["UI/UX", "프로토타이핑", "사용자경험"] },
            { id: 4, name: "분석가 리나", role: "Data Analyst", expertise: ["데이터분석", "시장조사", "성과측정"] },
          ],
          mcpTools: [
            {
              id: 1,
              name: "Market Research Tool",
              type: "analysis",
              config: { sources: ["google-trends", "app-store"] },
            },
            {
              id: 2,
              name: "Prototype Generator",
              type: "design",
              config: { platform: "figma", templates: ["mobile"] },
            },
          ],
          messageTypes: ["structured", "creative", "analytical"],
          outputFormats: ["document", "presentation", "prototype", "report"],
          interactionModes: ["collaborative", "review", "brainstorming"],
          evaluationMetrics: ["feasibility", "innovation", "user-experience", "market-potential"],
          missionTypes: ["planning", "design", "analysis"],
          roleCapabilities: ["strategic-thinking", "technical-expertise", "creative-design", "data-analysis"],
          knowledgeAssets: ["mobile-trends", "healthcare-regulations", "user-research"],
          workflow: [
            { step: 1, name: "시장 조사 및 분석", description: "타겟 시장과 경쟁사 분석", estimatedHours: 24 },
            {
              step: 2,
              name: "사용자 요구사항 정의",
              description: "페르소나 및 사용자 스토리 작성",
              estimatedHours: 16,
            },
            { step: 3, name: "기능 명세서 작성", description: "핵심 기능 및 상세 요구사항 정의", estimatedHours: 32 },
            { step: 4, name: "UI/UX 설계", description: "와이어프레임 및 프로토타입 제작", estimatedHours: 40 },
            { step: 5, name: "기술 아키텍처 설계", description: "시스템 구조 및 기술 스택 정의", estimatedHours: 24 },
            { step: 6, name: "최종 발표자료 작성", description: "프로젝트 결과 정리 및 발표", estimatedHours: 20 },
          ],
        },
        deliverables: [
          {
            id: 1,
            title: "시장 분석 리포트",
            description: "헬스케어 앱 시장 현황 및 경쟁사 분석",
            fileName: "market_analysis.pdf",
            fileType: "pdf",
            fileSize: 2048576,
            category: "report",
            status: "final",
            version: "1.0",
            tags: ["시장분석", "경쟁사분석", "헬스케어"],
            createdAt: "2024-01-08T10:00:00Z",
            updatedAt: "2024-01-10T15:30:00Z",
            createdBy: { id: 4, name: "분석가 리나", role: "Data Analyst", avatar: "/placeholder.svg" },
            rating: 4.9,
            downloadCount: 23,
          },
          {
            id: 2,
            title: "앱 기획서",
            description: "헬스케어 앱 전체 기획 및 요구사항 문서",
            fileName: "app_specification.pdf",
            fileType: "pdf",
            fileSize: 3145728,
            category: "document",
            status: "final",
            version: "2.1",
            tags: ["기획서", "요구사항", "모바일앱"],
            createdAt: "2024-01-10T09:00:00Z",
            updatedAt: "2024-01-15T16:30:00Z",
            createdBy: { id: 1, name: "전략가 알렉스", role: "Strategic Planner", avatar: "/placeholder.svg" },
            rating: 4.8,
            downloadCount: 31,
          },
        ],
      },
      {
        id: 2,
        title: "마케팅 캠페인 최적화",
        description: "디지털 마케팅 캠페인 성과 분석 및 최적화 전략 수립",
        status: "completed",
        completedAt: "2024-01-12T14:20:00Z",
        duration: 8,
        totalDeliverables: 5,
        participants: 3,
        successRate: 88,
        stats: {
          totalHours: 96,
          avgRating: 4.6,
          efficiency: 87,
        },
        template: {
          id: 2,
          name: "마케팅 최적화 템플릿",
          description: "디지털 마케팅 캠페인 분석 및 최적화를 위한 템플릿",
          personas: [
            {
              id: 5,
              name: "마케터 제인",
              role: "Marketing Specialist",
              expertise: ["디지털마케팅", "캠페인기획", "성과분석"],
            },
            { id: 4, name: "분석가 리나", role: "Data Analyst", expertise: ["데이터분석", "시장조사", "성과측정"] },
            {
              id: 6,
              name: "크리에이터 톰",
              role: "Content Creator",
              expertise: ["콘텐츠제작", "카피라이팅", "브랜딩"],
            },
          ],
          mcpTools: [
            {
              id: 3,
              name: "Analytics Dashboard",
              type: "analytics",
              config: { platforms: ["google-analytics", "facebook"] },
            },
            { id: 4, name: "Content Generator", type: "content", config: { formats: ["social", "email", "blog"] } },
          ],
          messageTypes: ["analytical", "creative", "strategic"],
          outputFormats: ["report", "presentation", "dashboard"],
          interactionModes: ["analytical", "creative", "strategic"],
          evaluationMetrics: ["roi", "engagement", "conversion", "reach"],
          missionTypes: ["analysis", "optimization", "content-creation"],
          roleCapabilities: ["marketing-expertise", "data-analysis", "creative-thinking"],
          knowledgeAssets: ["marketing-trends", "consumer-behavior", "platform-algorithms"],
          workflow: [
            { step: 1, name: "현재 성과 분석", description: "기존 캠페인 데이터 분석", estimatedHours: 16 },
            {
              step: 2,
              name: "타겟 오디언스 재정의",
              description: "고객 세그먼트 및 페르소나 업데이트",
              estimatedHours: 12,
            },
            { step: 3, name: "최적화 전략 수립", description: "개선 방안 및 실행 계획 작성", estimatedHours: 20 },
            { step: 4, name: "콘텐츠 전략 개발", description: "새로운 콘텐츠 방향성 설정", estimatedHours: 24 },
            { step: 5, name: "성과 예측 모델링", description: "예상 성과 시뮬레이션", estimatedHours: 16 },
            { step: 6, name: "실행 가이드 작성", description: "단계별 실행 매뉴얼 제작", estimatedHours: 8 },
          ],
        },
        deliverables: [
          {
            id: 3,
            title: "캠페인 성과 분석 리포트",
            description: "기존 마케팅 캠페인의 상세 성과 분석",
            fileName: "campaign_analysis.pdf",
            fileType: "pdf",
            fileSize: 1572864,
            category: "report",
            status: "final",
            version: "1.0",
            tags: ["성과분석", "마케팅", "ROI"],
            createdAt: "2024-01-08T11:00:00Z",
            updatedAt: "2024-01-10T16:00:00Z",
            createdBy: { id: 4, name: "분석가 리나", role: "Data Analyst", avatar: "/placeholder.svg" },
            rating: 4.7,
            downloadCount: 18,
          },
        ],
      },
    ])
  }

  const handleCreateTemplate = async (project: CompletedProject) => {
    // 템플릿 생성 로직
    console.log("Creating template from project:", project.id)
    // 실제로는 API 호출하여 템플릿 저장
    alert(`"${project.template.name}" 템플릿이 생성되었습니다!`)
  }

  const handleUseTemplate = async (template: ProjectTemplate) => {
    // 템플릿을 새 프로젝트에 적용
    console.log("Using template:", template.id)
    // 실제로는 새 프로젝트 생성 페이지로 이동하면서 템플릿 데이터 전달
    window.location.href = `/taskforce/new?template=${template.id}`
  }

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-5 w-5 text-red-600" />
      case "figma":
        return <FileImage className="h-5 w-5 text-purple-600" />
      case "markdown":
        return <FileCode className="h-5 w-5 text-blue-600" />
      case "excel":
        return <Sheet className="h-5 w-5 text-green-600" />
      case "powerpoint":
        return <Presentation className="h-5 w-5 text-orange-600" />
      default:
        return <File className="h-5 w-5 text-gray-600" />
    }
  }

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600"
    if (rate >= 80) return "text-blue-600"
    if (rate >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesSearch
  })

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    switch (sortBy) {
      case "completedAt":
        return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
      case "successRate":
        return b.successRate - a.successRate
      case "duration":
        return a.duration - b.duration
      case "deliverables":
        return b.totalDeliverables - a.totalDeliverables
      default:
        return 0
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Archive className="h-8 w-8 mr-3 text-blue-600" />
            프로젝트 히스토리
          </h1>
          <p className="text-gray-600 mt-2">완료된 프로젝트와 산출물을 관리하고 템플릿으로 활용하세요</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">{projects.length}</div>
            <div className="text-sm text-gray-500">완료된 프로젝트</div>
          </div>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 프로젝트</p>
                <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 산출물</p>
                <p className="text-2xl font-bold text-green-600">
                  {projects.reduce((sum, p) => sum + p.totalDeliverables, 0)}
                </p>
              </div>
              <FileText className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">평균 성공률</p>
                <p className="text-2xl font-bold text-purple-600">
                  {Math.round(projects.reduce((sum, p) => sum + p.successRate, 0) / projects.length)}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 투입시간</p>
                <p className="text-2xl font-bold text-orange-600">
                  {projects.reduce((sum, p) => sum + p.stats.totalHours, 0)}h
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="프로젝트 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="정렬 기준" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="completedAt">완료일순</SelectItem>
            <SelectItem value="successRate">성공률순</SelectItem>
            <SelectItem value="duration">기간순</SelectItem>
            <SelectItem value="deliverables">산출물순</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 프로젝트 목록 */}
      <div className="grid gap-6">
        {sortedProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{project.title}</h3>
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      완료
                    </Badge>
                    <Badge className={`${getSuccessRateColor(project.successRate)} bg-opacity-10`}>
                      {project.successRate}% 성공률
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-4">{project.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{formatDate(project.completedAt)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.duration}일 소요</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.totalDeliverables}개 산출물</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{project.participants}명 참여</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{project.stats.totalHours}시간 투입</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{project.stats.avgRating}/5.0 평점</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BarChart3 className="h-4 w-4" />
                      <span>{project.stats.efficiency}% 효율성</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col space-y-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedProject(project)}>
                        <Eye className="h-4 w-4 mr-1" />
                        상세보기
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="flex items-center space-x-2">
                          <Archive className="h-5 w-5 text-blue-600" />
                          <span>{project.title}</span>
                        </DialogTitle>
                        <DialogDescription>{project.description}</DialogDescription>
                      </DialogHeader>

                      <Tabs defaultValue="overview" className="w-full">
                        <TabsList className="grid w-full grid-cols-4">
                          <TabsTrigger value="overview">개요</TabsTrigger>
                          <TabsTrigger value="deliverables">산출물</TabsTrigger>
                          <TabsTrigger value="template">템플릿</TabsTrigger>
                          <TabsTrigger value="stats">통계</TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">프로젝트 정보</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">완료일:</span>
                                  <span className="font-medium">{formatDate(project.completedAt)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">소요기간:</span>
                                  <span className="font-medium">{project.duration}일</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">참여자:</span>
                                  <span className="font-medium">{project.participants}명</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">성공률:</span>
                                  <span className={`font-medium ${getSuccessRateColor(project.successRate)}`}>
                                    {project.successRate}%
                                  </span>
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-lg">성과 지표</CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div className="flex justify-between">
                                  <span className="text-gray-600">총 투입시간:</span>
                                  <span className="font-medium">{project.stats.totalHours}시간</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">평균 평점:</span>
                                  <span className="font-medium">{project.stats.avgRating}/5.0</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">효율성:</span>
                                  <span className="font-medium">{project.stats.efficiency}%</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-600">산출물:</span>
                                  <span className="font-medium">{project.totalDeliverables}개</span>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">참여 페르소나</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                {project.template.personas.map((persona) => (
                                  <div
                                    key={persona.id}
                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
                                  >
                                    <Avatar>
                                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                        {persona.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <div>
                                      <div className="font-medium">{persona.name}</div>
                                      <div className="text-sm text-gray-600">{persona.role}</div>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {persona.expertise.slice(0, 2).map((skill, idx) => (
                                          <Badge key={idx} variant="outline" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="deliverables" className="space-y-4">
                          <div className="grid gap-4">
                            {project.deliverables.map((deliverable) => (
                              <Card key={deliverable.id}>
                                <CardContent className="p-4">
                                  <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-3 flex-1">
                                      {getFileIcon(deliverable.fileType)}
                                      <div className="flex-1">
                                        <h4 className="font-semibold text-gray-900">{deliverable.title}</h4>
                                        <p className="text-sm text-gray-600 mt-1">{deliverable.description}</p>
                                        <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                                          <span>{formatFileSize(deliverable.fileSize)}</span>
                                          <span>v{deliverable.version}</span>
                                          <div className="flex items-center space-x-1">
                                            <Star className="h-3 w-3 text-yellow-500" />
                                            <span>{deliverable.rating}</span>
                                          </div>
                                          <div className="flex items-center space-x-1">
                                            <Download className="h-3 w-3" />
                                            <span>{deliverable.downloadCount}</span>
                                          </div>
                                        </div>
                                        <div className="flex flex-wrap gap-1 mt-2">
                                          {deliverable.tags.map((tag, idx) => (
                                            <Badge key={idx} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                    <Button size="sm" variant="outline">
                                      <Download className="h-4 w-4 mr-1" />
                                      다운로드
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </TabsContent>

                        <TabsContent value="template" className="space-y-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-lg font-semibold">{project.template.name}</h3>
                              <p className="text-gray-600">{project.template.description}</p>
                            </div>
                            <Button
                              onClick={() => handleUseTemplate(project.template)}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Plus className="h-4 w-4 mr-1" />
                              템플릿 사용하기
                            </Button>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                  <Users className="h-4 w-4 mr-2" />
                                  AI 페르소나 ({project.template.personas.length})
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ScrollArea className="h-32">
                                  <div className="space-y-2">
                                    {project.template.personas.map((persona) => (
                                      <div key={persona.id} className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{persona.name}</span>
                                        <Badge variant="outline">{persona.role}</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                  <Zap className="h-4 w-4 mr-2" />
                                  MCP 도구 ({project.template.mcpTools.length})
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <ScrollArea className="h-32">
                                  <div className="space-y-2">
                                    {project.template.mcpTools.map((tool) => (
                                      <div key={tool.id} className="flex items-center justify-between text-sm">
                                        <span className="font-medium">{tool.name}</span>
                                        <Badge variant="outline">{tool.type}</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </ScrollArea>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                  <MessageSquare className="h-4 w-4 mr-2" />
                                  메시지 유형
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-1">
                                  {project.template.messageTypes.map((type, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {type}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base flex items-center">
                                  <FileText className="h-4 w-4 mr-2" />
                                  출력 형식
                                </CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="flex flex-wrap gap-1">
                                  {project.template.outputFormats.map((format, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {format}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">워크플로우</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {project.template.workflow.map((step) => (
                                  <div key={step.step} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                                      {step.step}
                                    </div>
                                    <div className="flex-1">
                                      <div className="font-medium">{step.name}</div>
                                      <div className="text-sm text-gray-600">{step.description}</div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        예상 소요시간: {step.estimatedHours}시간
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>

                        <TabsContent value="stats" className="space-y-6">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">시간 효율성</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-blue-600 mb-2">{project.stats.efficiency}%</div>
                                <div className="text-sm text-gray-600">
                                  예상 대비 {project.stats.efficiency > 100 ? "초과" : "절약"}
                                </div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">품질 점수</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="text-3xl font-bold text-green-600 mb-2">
                                  {project.stats.avgRating}/5.0
                                </div>
                                <div className="text-sm text-gray-600">평균 산출물 품질</div>
                              </CardContent>
                            </Card>

                            <Card>
                              <CardHeader>
                                <CardTitle className="text-base">성공률</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className={`text-3xl font-bold mb-2 ${getSuccessRateColor(project.successRate)}`}>
                                  {project.successRate}%
                                </div>
                                <div className="text-sm text-gray-600">목표 달성률</div>
                              </CardContent>
                            </Card>
                          </div>

                          <Card>
                            <CardHeader>
                              <CardTitle className="text-base">시간 분배</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                {project.template.workflow.map((step) => (
                                  <div key={step.step} className="flex items-center justify-between">
                                    <span className="text-sm">{step.name}</span>
                                    <div className="flex items-center space-x-2">
                                      <div className="w-32 bg-gray-200 rounded-full h-2">
                                        <div
                                          className="bg-blue-600 h-2 rounded-full"
                                          style={{
                                            width: `${(step.estimatedHours / project.stats.totalHours) * 100}%`,
                                          }}
                                        />
                                      </div>
                                      <span className="text-sm text-gray-600 w-12">{step.estimatedHours}h</span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </DialogContent>
                  </Dialog>

                  <Button
                    size="sm"
                    onClick={() => handleCreateTemplate(project)}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    템플릿 생성
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {sortedProjects.length === 0 && (
        <div className="text-center py-12">
          <Archive className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">완료된 프로젝트가 없습니다</h3>
          <p className="text-gray-600">첫 번째 프로젝트를 완료하면 여기에 표시됩니다.</p>
        </div>
      )}
    </div>
  )
}
