"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Target,
  Lightbulb,
  Users,
  CheckCircle,
  Trophy,
  FileText,
  MessageSquare,
  Calendar,
  TrendingUp,
  Zap,
  Settings,
  Star,
  Award,
  AlertTriangle,
  Activity,
  Hammer,
  Clock,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Pause,
  MessageCircle,
  BarChart3,
  DollarSign,
  UserCheck,
  Briefcase,
  PieChart,
  Bot,
  Workflow,
  Key,
  Palette,
  Plus,
  MoreHorizontal,
  Edit,
  Save,
  X,
  Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Project {
  id: number
  title: string
  description: string
  category: string
  priority: "high" | "medium" | "low"
  status: "planning" | "in-progress" | "review" | "completed" | "cancelled"
  progress: number
  manager: {
    id: number
    name: string
    role: string
    avatar: string
  }
  dueDate: string
  createdAt: string
  updatedAt: string
  estimatedHours: number
  actualHours?: number
  tags: string[]
  teamSize: number
  budget?: string
  client?: string
  // 새로운 구조를 위한 데이터
  intro: {
    objectives: string[]
    background: string
    kpis: Array<{
      name: string
      target: string
      current: string
      unit: string
    }>
    strategy: string[]
  }
  resources: {
    personas: string[]
    messageTypes: string[]
    outputFormats: string[]
    interactionModes: string[]
    evaluationMetrics: string[]
    missionTypes: string[]
    roleCapabilities: string[]
    knowledgeAssets: string[]
    budget: {
      total: string
      allocated: string
      remaining: string
    }
    team: Array<{
      name: string
      role: string
      allocation: string
      cost: string
    }>
    tools: Array<{
      name: string
      type: string
      cost: string
      status: string
    }>
  }
  brainstorming: Array<{
    id: number
    idea: string
    author: string
    votes: number
    status: "new" | "discussed" | "approved" | "rejected"
  }>
  planning: {
    confirmedIdeas: string[]
    wbs: Array<{
      id: string
      taskName: string
      level: number
      parentId?: string
      mainActivities: string[]
      requiredResources: string[]
      assignee: {
        name: string
        avatar: string
      }
      startDate: string
      endDate: string
      duration: number
      status: "not-started" | "in-progress" | "completed" | "delayed"
      dependencies?: string[]
      progress: number
    }>
  }
  working: Array<{
    id: number
    title: string
    description: string
    assignee: {
      name: string
      avatar: string
    }
    status: "not-started" | "in-progress" | "blocked" | "completed" | "review"
    priority: "low" | "medium" | "high" | "urgent"
    progress: number
    startDate: string
    dueDate: string
    subtasks?: Array<{
      id: number
      title: string
      completed: boolean
    }>
    comments?: Array<{
      id: number
      author: string
      content: string
      timestamp: string
    }>
    dependencies?: number[]
  }>
  reviews: Array<{
    id: number
    taskId: number
    taskTitle: string
    type: "design-review" | "code-review" | "content-review" | "approval-request" | "quality-check"
    title: string
    description: string
    submittedBy: {
      name: string
      avatar: string
    }
    submittedAt: string
    priority: "low" | "medium" | "high" | "urgent"
    status: "pending" | "approved" | "rejected" | "needs-revision"
    dueDate: string
    attachments?: Array<{
      name: string
      url: string
      type: string
    }>
    comments: Array<{
      id: number
      author: string
      content: string
      timestamp: string
      decision?: "approve" | "reject" | "request-changes"
    }>
    reviewers: string[]
    currentReviewer?: string
  }>
  achievements: Array<{
    id: number
    title: string
    description: string
    completedDate: string
    impact: string
    deliverables: Array<{
      name: string
      type: string
      url: string
      description: string
    }>
    metrics: {
      name: string
      value: string
      improvement: string
    }[]
  }>
  meetings: {
    recent: Array<{
      id: number
      title: string
      type: string
      date: string
      participants: number
      status: "completed" | "in-progress" | "scheduled"
      sessionId?: number
    }>
    stats: {
      preMeeting: { total: number; completed: number; inProgress: number; scheduled: number }
      kickoff: { total: number; completed: number; inProgress: number; scheduled: number }
      planning: { total: number; completed: number; inProgress: number; scheduled: number }
      regular: { total: number; completed: number; inProgress: number; scheduled: number }
      issue: { total: number; completed: number; inProgress: number; scheduled: number }
      review: { total: number; completed: number; inProgress: number; scheduled: number }
      decision: { total: number; completed: number; inProgress: number; scheduled: number }
      retrospective: { total: number; completed: number; inProgress: number; scheduled: number }
    }
  }
  settings: {
    aiPersonas: Array<{
      id: number
      name: string
      role: string
      isActive: boolean
      capabilities: string[]
      customPrompts: string
    }>
    automation: {
      autoAssignTasks: boolean
      smartNotifications: boolean
      progressTracking: boolean
      reportGeneration: boolean
    }
    integrations: Array<{
      name: string
      type: string
      status: "connected" | "disconnected"
      apiKey: string
    }>
  }
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [reviewComment, setReviewComment] = useState("")
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const router = useRouter()

  const [editingObjectives, setEditingObjectives] = useState(false)
  const [editingKPIs, setEditingKPIs] = useState(false)
  const [editingResources, setEditingResources] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState(false)
  const [editingConfirmedIdeas, setEditingConfirmedIdeas] = useState(false)
  const [editingWBS, setEditingWBS] = useState(false)
  const [tempObjectives, setTempObjectives] = useState<string[]>([])
  const [tempKPIs, setTempKPIs] = useState<any[]>([])
  const [tempStrategy, setTempStrategy] = useState<string[]>([])
  const [tempConfirmedIdeas, setTempConfirmedIdeas] = useState<string[]>([])
  const [tempWBS, setTempWBS] = useState<any[]>([])

  const [autoSaveStatus, setAutoSaveStatus] = useState<"saved" | "saving" | "error" | null>(null)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastSaveTimeRef = useRef<Date | null>(null)

  useEffect(() => {
    // 확장된 임시 데이터
    const mockProjects: Project[] = [
      {
        id: 1,
        title: "Web Designing",
        description: "Create a responsive landing page design for the new product launch",
        category: "UI/UX Design",
        priority: "high",
        status: "in-progress",
        progress: 60,
        manager: {
          id: 1,
          name: "디자이너 마크",
          role: "UX Designer",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-01-15",
        createdAt: "2024-01-10T09:00:00Z",
        updatedAt: "2024-01-12T14:30:00Z",
        estimatedHours: 120,
        actualHours: 72,
        tags: ["design", "responsive", "landing-page"],
        teamSize: 3,
        budget: "₩5,000,000",
        client: "ABC Company",
        intro: {
          objectives: [
            "사용자 친화적인 반응형 랜딩 페이지 제작",
            "브랜드 아이덴티티를 반영한 시각적 디자인 구현",
            "전환율 15% 향상을 위한 UX 최적화",
          ],
          background:
            "신제품 출시를 앞두고 효과적인 마케팅 랜딩 페이지가 필요한 상황입니다. 기존 웹사이트의 전환율이 낮아 새로운 접근이 필요합니다.",
          kpis: [
            { name: "페이지 로딩 속도", target: "3초 이하", current: "2.1초", unit: "초" },
            { name: "전환율", target: "15%", current: "12%", unit: "%" },
            { name: "사용자 만족도", target: "4.5점", current: "4.2점", unit: "점" },
          ],
          strategy: [
            "사용자 중심 디자인 접근법 적용",
            "A/B 테스트를 통한 최적화",
            "모바일 퍼스트 반응형 디자인",
            "성능 최적화 및 SEO 고려",
          ],
        },
        resources: {
          personas: ["UX Designer", "UI Designer", "Frontend Developer"],
          messageTypes: ["Proposal", "Feedback", "Review"],
          outputFormats: ["Figma Design", "HTML/CSS", "Design System"],
          interactionModes: ["Collaborative Review", "Iterative Design"],
          evaluationMetrics: ["User Experience Score", "Performance Metrics"],
          missionTypes: ["Design Sprint", "User Testing"],
          roleCapabilities: ["Visual Design", "Prototyping", "User Research"],
          knowledgeAssets: ["Brand Guidelines", "Design System", "User Personas"],
          budget: {
            total: "₩5,000,000",
            allocated: "₩3,000,000",
            remaining: "₩2,000,000",
          },
          team: [
            { name: "디자이너 마크", role: "UX Designer", allocation: "100%", cost: "₩1,500,000" },
            { name: "UI Designer", role: "UI Designer", allocation: "80%", cost: "₩1,200,000" },
            { name: "Frontend Developer", role: "Developer", allocation: "50%", cost: "₩800,000" },
          ],
          tools: [
            { name: "Figma", type: "Design Tool", cost: "₩50,000/월", status: "active" },
            { name: "Adobe Creative Suite", type: "Design Tool", cost: "₩80,000/월", status: "active" },
            { name: "Vercel", type: "Hosting", cost: "₩30,000/월", status: "active" },
          ],
        },
        brainstorming: [
          { id: 1, idea: "인터랙티브 프로토타입 제작", author: "디자이너 마크", votes: 8, status: "approved" },
          { id: 2, idea: "마이크로 애니메이션 적용", author: "UI Designer", votes: 6, status: "discussed" },
          { id: 3, idea: "다크모드 지원", author: "Frontend Developer", votes: 4, status: "new" },
        ],
        planning: {
          confirmedIdeas: ["인터랙티브 프로토타입 제작", "마이크로 애니메이션 적용", "모바일 퍼스트 반응형 디자인"],
          wbs: [
            {
              id: "1",
              taskName: "1. 프로젝트 기획 및 분석",
              level: 1,
              mainActivities: ["프로젝트 킥오프", "요구사항 분석", "기술 스택 결정"],
              requiredResources: ["Project Manager", "Business Analyst"],
              assignee: { name: "디자이너 마크", avatar: "/placeholder.svg" },
              startDate: "2024-01-10",
              endDate: "2024-01-15",
              duration: 5,
              status: "completed",
              progress: 100,
            },
            {
              id: "1.1",
              taskName: "1.1 사용자 리서치",
              level: 2,
              parentId: "1",
              mainActivities: ["사용자 인터뷰", "설문조사", "페르소나 작성"],
              requiredResources: ["UX Researcher", "Survey Tools"],
              assignee: { name: "디자이너 마크", avatar: "/placeholder.svg" },
              startDate: "2024-01-10",
              endDate: "2024-01-12",
              duration: 2,
              status: "completed",
              progress: 100,
            },
            {
              id: "1.2",
              taskName: "1.2 경쟁사 분석",
              level: 2,
              parentId: "1",
              mainActivities: ["경쟁사 조사", "벤치마킹", "차별화 포인트 도출"],
              requiredResources: ["Market Analyst", "Research Tools"],
              assignee: { name: "분석가 리나", avatar: "/placeholder.svg" },
              startDate: "2024-01-12",
              endDate: "2024-01-15",
              duration: 3,
              status: "completed",
              progress: 100,
            },
            {
              id: "2",
              taskName: "2. 디자인 및 프로토타입",
              level: 1,
              mainActivities: ["와이어프레임", "시각 디자인", "프로토타입"],
              requiredResources: ["UI/UX Designer", "Design Tools"],
              assignee: { name: "UI Designer", avatar: "/placeholder.svg" },
              startDate: "2024-01-15",
              endDate: "2024-01-25",
              duration: 10,
              status: "in-progress",
              progress: 60,
            },
          ],
        },
        working: [
          {
            id: 1,
            title: "사용자 리서치 진행",
            description: "타겟 사용자 그룹을 대상으로 인터뷰 및 설문조사 실시",
            assignee: {
              name: "디자이너 마크",
              avatar: "/placeholder.svg",
            },
            status: "completed",
            priority: "high",
            progress: 100,
            startDate: "2024-01-10",
            dueDate: "2024-01-12",
            subtasks: [
              { id: 1, title: "인터뷰 질문지 작성", completed: true },
              { id: 2, title: "10명 사용자 인터뷰 진행", completed: true },
              { id: 3, title: "결과 분석 및 보고서 작성", completed: true },
            ],
            comments: [
              {
                id: 1,
                author: "디자이너 마크",
                content: "사용자들은 모바일에서의 사용성을 특히 중요하게 생각하는 것으로 나타났습니다.",
                timestamp: "2024-01-11T14:30:00Z",
              },
            ],
          },
          {
            id: 2,
            title: "와이어프레임 제작",
            description: "주요 페이지 레이아웃 및 사용자 흐름 설계",
            assignee: {
              name: "UI Designer",
              avatar: "/placeholder.svg",
            },
            status: "in-progress",
            priority: "high",
            progress: 75,
            startDate: "2024-01-12",
            dueDate: "2024-01-14",
            subtasks: [
              { id: 1, title: "메인 페이지 와이어프레임", completed: true },
              { id: 2, title: "제품 상세 페이지 와이어프레임", completed: true },
              { id: 3, title: "결제 프로세스 와이어프레임", completed: false },
            ],
            dependencies: [1],
          },
        ],
        reviews: [
          {
            id: 1,
            taskId: 2,
            taskTitle: "와이어프레임 제작",
            type: "design-review",
            title: "메인 페이지 와이어프레임 검토",
            description:
              "메인 페이지의 레이아웃과 사용자 흐름에 대한 검토가 필요합니다. 특히 모바일 반응형 디자인과 접근성을 중점적으로 확인해주세요.",
            submittedBy: {
              name: "UI Designer",
              avatar: "/placeholder.svg",
            },
            submittedAt: "2024-01-13T10:30:00Z",
            priority: "high",
            status: "pending",
            dueDate: "2024-01-14T18:00:00Z",
            attachments: [
              {
                name: "main-wireframe-v1.fig",
                url: "/placeholder.svg",
                type: "figma",
              },
            ],
            comments: [
              {
                id: 1,
                author: "UI Designer",
                content:
                  "초기 와이어프레임이 완성되었습니다. 사용자 리서치 결과를 반영하여 모바일 우선으로 설계했습니다.",
                timestamp: "2024-01-13T10:30:00Z",
              },
            ],
            reviewers: ["디자이너 마크", "Product Manager"],
            currentReviewer: "디자이너 마크",
          },
        ],
        achievements: [
          {
            id: 1,
            title: "사용자 리서치 완료",
            description: "10명의 타겟 사용자 인터뷰를 통해 핵심 인사이트를 도출했습니다.",
            completedDate: "2024-01-12",
            impact: "사용자 중심 디자인 방향 확립",
            deliverables: [
              {
                name: "사용자 리서치 보고서",
                type: "PDF",
                url: "/placeholder.svg",
                description: "10명 사용자 인터뷰 결과 및 인사이트 정리",
              },
              {
                name: "사용자 페르소나",
                type: "Figma",
                url: "/placeholder.svg",
                description: "3개 주요 사용자 페르소나 정의",
              },
            ],
            metrics: [
              { name: "인터뷰 완료율", value: "100%", improvement: "+100%" },
              { name: "핵심 인사이트", value: "15개", improvement: "+15개" },
            ],
          },
        ],
        meetings: {
          recent: [
            {
              id: 1,
              title: "프로젝트 킥오프 미팅",
              type: "킥오프 회의",
              date: "2024-01-10",
              participants: 5,
              status: "completed",
              sessionId: 1,
            },
            {
              id: 2,
              title: "사용자 리서치 결과 공유",
              type: "검토/피드백 회의",
              date: "2024-01-12",
              participants: 4,
              status: "completed",
              sessionId: 2,
            },
            {
              id: 3,
              title: "주간 진행 상황 점검",
              type: "정기 진행 회의",
              date: "2024-01-15",
              participants: 3,
              status: "in-progress",
              sessionId: 3,
            },
            {
              id: 4,
              title: "디자인 시스템 검토",
              type: "검토/피드백 회의",
              date: "2024-01-18",
              participants: 4,
              status: "scheduled",
            },
          ],
          stats: {
            preMeeting: { total: 3, completed: 2, inProgress: 1, scheduled: 0 },
            kickoff: { total: 1, completed: 1, inProgress: 0, scheduled: 0 },
            planning: { total: 4, completed: 2, inProgress: 1, scheduled: 1 },
            regular: { total: 6, completed: 3, inProgress: 2, scheduled: 1 },
            issue: { total: 2, completed: 1, inProgress: 1, scheduled: 0 },
            review: { total: 5, completed: 2, inProgress: 1, scheduled: 2 },
            decision: { total: 3, completed: 2, inProgress: 0, scheduled: 1 },
            retrospective: { total: 0, completed: 0, inProgress: 0, scheduled: 0 },
          },
        },
        settings: {
          aiPersonas: [
            {
              id: 1,
              name: "UX 전문가 AI",
              role: "UX Consultant",
              isActive: true,
              capabilities: ["사용자 리서치", "와이어프레임 검토", "UX 가이드라인"],
              customPrompts: "사용자 중심적 관점에서 디자인을 분석하고 개선점을 제안해주세요.",
            },
            {
              id: 2,
              name: "디자인 시스템 AI",
              role: "Design System Expert",
              isActive: true,
              capabilities: ["컴포넌트 설계", "일관성 검토", "접근성 가이드"],
              customPrompts: "디자인 시스템 관점에서 일관성과 재사용성을 검토해주세요.",
            },
          ],
          automation: {
            autoAssignTasks: true,
            smartNotifications: true,
            progressTracking: true,
            reportGeneration: false,
          },
          integrations: [
            { name: "Figma", type: "Design Tool", status: "connected", apiKey: "fig_..." },
            { name: "Slack", type: "Communication", status: "connected", apiKey: "xoxb_..." },
            { name: "Jira", type: "Project Management", status: "disconnected", apiKey: "" },
          ],
        },
      },
    ]

    const projectId = Number(params.id)

    setTimeout(() => {
      const foundProject = mockProjects.find((p) => p.id === projectId)

      if (foundProject) {
        setProject(foundProject)
        setTempObjectives([...foundProject.intro.objectives])
        setTempKPIs([...foundProject.intro.kpis])
        setTempStrategy([...foundProject.intro.strategy])
        setTempConfirmedIdeas([...foundProject.planning.confirmedIdeas])
        setTempWBS([...foundProject.planning.wbs])
        setError(null)
      } else {
        setError(`프로젝트 ID ${projectId}를 찾을 수 없습니다.`)
      }
      setLoading(false)
    }, 500)
  }, [params.id])

  // 자동 저장 기능
  const autoSave = useCallback(
    (data: any, type: string) => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current)
      }

      autoSaveTimeoutRef.current = setTimeout(() => {
        try {
          setAutoSaveStatus("saving")
          const autoSaveKey = `project_${params.id}_${type}_autosave`
          const saveData = {
            data,
            timestamp: new Date().toISOString(),
            projectId: params.id,
          }
          localStorage.setItem(autoSaveKey, JSON.stringify(saveData))
          setAutoSaveStatus("saved")
          lastSaveTimeRef.current = new Date()
          setHasUnsavedChanges(true)

          // 3초 후 저장 상태 메시지 숨기기
          setTimeout(() => setAutoSaveStatus(null), 3000)
        } catch (error) {
          console.error("Auto save failed:", error)
          setAutoSaveStatus("error")
          setTimeout(() => setAutoSaveStatus(null), 3000)
        }
      }, 2000) // 2초 디바운스
    },
    [params.id],
  )

  // 임시 저장된 데이터 확인
  useEffect(() => {
    const checkAutoSavedData = () => {
      const types = ["objectives", "kpis", "strategy", "confirmedIdeas", "wbs"]
      let hasAutoSavedData = false

      types.forEach((type) => {
        const autoSaveKey = `project_${params.id}_${type}_autosave`
        const savedData = localStorage.getItem(autoSaveKey)
        if (savedData) {
          hasAutoSavedData = true
        }
      })

      if (hasAutoSavedData) {
        setShowRestoreDialog(true)
      }
    }

    if (project) {
      checkAutoSavedData()
    }
  }, [project, params.id])

  // 편집 중인 데이터 변경 감지 및 자동 저장
  useEffect(() => {
    if (editingObjectives && project) {
      autoSave(tempObjectives, "objectives")
    }
  }, [tempObjectives, editingObjectives, autoSave, project])

  useEffect(() => {
    if (editingKPIs && project) {
      autoSave(tempKPIs, "kpis")
    }
  }, [tempKPIs, editingKPIs, autoSave, project])

  useEffect(() => {
    if (editingStrategy && project) {
      autoSave(tempStrategy, "strategy")
    }
  }, [tempStrategy, editingStrategy, autoSave, project])

  useEffect(() => {
    if (editingConfirmedIdeas && project) {
      autoSave(tempConfirmedIdeas, "confirmedIdeas")
    }
  }, [tempConfirmedIdeas, editingConfirmedIdeas, autoSave, project])

  useEffect(() => {
    if (editingWBS && project) {
      autoSave(tempWBS, "wbs")
    }
  }, [tempWBS, editingWBS, autoSave, project])

  // 페이지 언로드 시 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (
        hasUnsavedChanges &&
        (editingObjectives || editingKPIs || editingStrategy || editingConfirmedIdeas || editingWBS)
      ) {
        e.preventDefault()
        e.returnValue = "저장되지 않은 변경사항이 있습니다. 페이지를 떠나시겠습니까?"
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [hasUnsavedChanges, editingObjectives, editingKPIs, editingStrategy, editingConfirmedIdeas, editingWBS])

  const handleReviewDecision = (reviewId: number, decision: "approve" | "reject" | "request-changes") => {
    if (!project) return

    const updatedReviews = project.reviews.map((review) => {
      if (review.id === reviewId) {
        const newComment = {
          id: review.comments.length + 1,
          author: "Current User",
          content: reviewComment,
          timestamp: new Date().toISOString(),
          decision: decision,
        }

        let newStatus: "pending" | "approved" | "rejected" | "needs-revision" = "pending"
        if (decision === "approve") newStatus = "approved"
        else if (decision === "reject") newStatus = "rejected"
        else if (decision === "request-changes") newStatus = "needs-revision"

        return {
          ...review,
          status: newStatus,
          comments: [...review.comments, newComment],
        }
      }
      return review
    })

    setProject({ ...project, reviews: updatedReviews })
    setReviewComment("")
    setIsReviewModalOpen(false)
    setSelectedReview(null)
  }

  const openReviewModal = (review: any) => {
    setSelectedReview(review)
    setIsReviewModalOpen(true)
  }

  const restoreAutoSavedData = () => {
    const types = ["objectives", "kpis", "strategy", "confirmedIdeas", "wbs"]

    types.forEach((type) => {
      const autoSaveKey = `project_${params.id}_${type}_autosave`
      const savedData = localStorage.getItem(autoSaveKey)

      if (savedData) {
        try {
          const { data } = JSON.parse(savedData)

          switch (type) {
            case "objectives":
              setTempObjectives(data)
              break
            case "kpis":
              setTempKPIs(data)
              break
            case "strategy":
              setTempStrategy(data)
              break
            case "confirmedIdeas":
              setTempConfirmedIdeas(data)
              break
            case "wbs":
              setTempWBS(data)
              break
          }
        } catch (error) {
          console.error(`Failed to restore ${type}:`, error)
        }
      }
    })

    setShowRestoreDialog(false)
    setHasUnsavedChanges(true)
  }

  const clearAutoSavedData = (type?: string) => {
    if (type) {
      const autoSaveKey = `project_${params.id}_${type}_autosave`
      localStorage.removeItem(autoSaveKey)
    } else {
      // 모든 타입의 자동 저장 데이터 삭제
      const types = ["objectives", "kpis", "strategy", "confirmedIdeas", "wbs"]
      types.forEach((t) => {
        const autoSaveKey = `project_${params.id}_${t}_autosave`
        localStorage.removeItem(autoSaveKey)
      })
    }
    setHasUnsavedChanges(false)
  }

  const discardAutoSavedData = () => {
    clearAutoSavedData()
    setShowRestoreDialog(false)
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">프로젝트 정보를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">프로젝트를 찾을 수 없습니다</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <Button onClick={() => router.back()} variant="outline">
              이전 페이지로
            </Button>
            <Button onClick={() => router.push("/total-projects")}>프로젝트 목록으로</Button>
          </div>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "completed":
      case "approved":
        return "bg-green-100 text-green-800"
      case "waiting":
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "blocked":
      case "rejected":
        return "bg-red-100 text-red-800"
      case "review":
      case "needs-revision":
        return "bg-purple-100 text-purple-800"
      case "not-started":
      case "scheduled":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
      case "urgent":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <AlertTriangle className="h-4 w-4 text-red-600" />
      case "high":
        return <Activity className="h-4 w-4 text-red-600" />
      case "medium":
        return <Activity className="h-4 w-4 text-yellow-600" />
      case "low":
        return <Activity className="h-4 w-4 text-green-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const getReviewTypeIcon = (type: string) => {
    switch (type) {
      case "design-review":
        return <Eye className="h-4 w-4" />
      case "code-review":
        return <FileText className="h-4 w-4" />
      case "content-review":
        return <MessageSquare className="h-4 w-4" />
      case "approval-request":
        return <CheckCircle className="h-4 w-4" />
      case "quality-check":
        return <Star className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getReviewTypeName = (type: string) => {
    switch (type) {
      case "design-review":
        return "디자인 검토"
      case "code-review":
        return "코드 검토"
      case "content-review":
        return "콘텐츠 검토"
      case "approval-request":
        return "승인 요청"
      case "quality-check":
        return "품질 검사"
      default:
        return "검토"
    }
  }

  const saveObjectives = () => {
    if (project) {
      setProject({
        ...project,
        intro: {
          ...project.intro,
          objectives: [...tempObjectives],
        },
      })
    }
    setEditingObjectives(false)
    clearAutoSavedData("objectives")
  }

  const saveKPIs = () => {
    if (project) {
      setProject({
        ...project,
        intro: {
          ...project.intro,
          kpis: [...tempKPIs],
        },
      })
    }
    setEditingKPIs(false)
    clearAutoSavedData("kpis")
  }

  const saveStrategy = () => {
    if (project) {
      setProject({
        ...project,
        intro: {
          ...project.intro,
          strategy: [...tempStrategy],
        },
      })
    }
    setEditingStrategy(false)
    clearAutoSavedData("strategy")
  }

  const saveConfirmedIdeas = () => {
    if (project) {
      setProject({
        ...project,
        planning: {
          ...project.planning,
          confirmedIdeas: [...tempConfirmedIdeas],
        },
      })
    }
    setEditingConfirmedIdeas(false)
    clearAutoSavedData("confirmedIdeas")
  }

  const saveWBS = () => {
    if (project) {
      setProject({
        ...project,
        planning: {
          ...project.planning,
          wbs: [...tempWBS],
        },
      })
    }
    setEditingWBS(false)
    clearAutoSavedData("wbs")
  }

  const cancelEdit = (type: string) => {
    switch (type) {
      case "objectives":
        setTempObjectives([...project!.intro.objectives])
        setEditingObjectives(false)
        clearAutoSavedData("objectives")
        break
      case "kpis":
        setTempKPIs([...project!.intro.kpis])
        setEditingKPIs(false)
        clearAutoSavedData("kpis")
        break
      case "strategy":
        setTempStrategy([...project!.intro.strategy])
        setEditingStrategy(false)
        clearAutoSavedData("strategy")
        break
      case "confirmedIdeas":
        setTempConfirmedIdeas([...project!.planning.confirmedIdeas])
        setEditingConfirmedIdeas(false)
        clearAutoSavedData("confirmedIdeas")
        break
      case "wbs":
        setTempWBS([...project!.planning.wbs])
        setEditingWBS(false)
        clearAutoSavedData("wbs")
        break
    }
  }

  const addWBSTask = () => {
    const newTask = {
      id: `new_${Date.now()}`,
      taskName: "새 작업",
      level: 1,
      mainActivities: [""],
      requiredResources: [""],
      assignee: { name: "", avatar: "" },
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date().toISOString().split("T")[0],
      duration: 1,
      status: "not-started" as const,
      progress: 0,
    }
    setTempWBS([...tempWBS, newTask])
  }

  const updateWBSTask = (index: number, field: string, value: any) => {
    const updatedWBS = [...tempWBS]
    updatedWBS[index] = { ...updatedWBS[index], [field]: value }
    setTempWBS(updatedWBS)
  }

  const deleteWBSTask = (index: number) => {
    const updatedWBS = tempWBS.filter((_, i) => i !== index)
    setTempWBS(updatedWBS)
  }

  const navigateToTaskPage = (taskId: string) => {
    // 실제 구현에서는 task 상세 페이지로 이동
    router.push(`/total-projects/${project.id}/tasks/${taskId}`)
  }

  const navigateToSession = (sessionId?: number) => {
    if (sessionId) {
      router.push(`/total-projects/${project.id}/brainstorming`)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 자동 저장 상태 표시 */}
      {autoSaveStatus && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 ${
              autoSaveStatus === "saving"
                ? "bg-blue-100 text-blue-800"
                : autoSaveStatus === "saved"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {autoSaveStatus === "saving" && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm">자동 저장 중...</span>
              </>
            )}
            {autoSaveStatus === "saved" && (
              <>
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm">자동 저장됨</span>
              </>
            )}
            {autoSaveStatus === "error" && (
              <>
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">저장 실패</span>
              </>
            )}
          </div>
        </div>
      )}

      {/* 임시 저장 데이터 복원 다이얼로그 */}
      <Dialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Save className="h-5 w-5 text-blue-600" />
              <span>임시 저장된 데이터 발견</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-gray-600">이전에 편집하던 내용이 임시 저장되어 있습니다. 복원하시겠습니까?</p>
            <div className="flex space-x-3">
              <Button onClick={restoreAutoSavedData} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                복원하기
              </Button>
              <Button variant="outline" onClick={discardAutoSavedData} className="flex-1">
                <X className="h-4 w-4 mr-2" />
                삭제하기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <Badge className={getPriorityColor(project.priority)}>
              {project.priority === "high" ? "높음" : project.priority === "medium" ? "보통" : "낮음"}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{project.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Settings className="h-4 w-4 mr-1" />
              <span>
                {project.status === "in-progress"
                  ? "진행중"
                  : project.status === "planning"
                    ? "기획중"
                    : project.status === "review"
                      ? "검토중"
                      : project.status === "completed"
                        ? "완료"
                        : "취소됨"}
              </span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{project.teamSize}명 참여</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>마감: {new Date(project.dueDate).toLocaleDateString("ko-KR")}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-1">{project.progress}%</div>
          <Progress value={project.progress} className="w-32" />
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="meeting">Meeting</TabsTrigger>
          <TabsTrigger value="plan">Plan</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
          <TabsTrigger value="achievement">Achievement</TabsTrigger>
          <TabsTrigger value="setting">Setting</TabsTrigger>
        </TabsList>

        {/* Overview 탭 */}
        <TabsContent value="overview" className="space-y-6">
          {/* 프로젝트 개요 대시보드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">전체 진행률</p>
                    <p className="text-2xl font-bold text-blue-900">{project.progress}%</p>
                  </div>
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-green-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-green-600 text-sm font-medium">완료된 작업</p>
                    <p className="text-2xl font-bold text-green-900">
                      {project.working.filter((t) => t.status === "completed").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">예산 사용률</p>
                    <p className="text-2xl font-bold text-yellow-900">60%</p>
                  </div>
                  <DollarSign className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-medium">팀 참여도</p>
                    <p className="text-2xl font-bold text-purple-900">85%</p>
                  </div>
                  <UserCheck className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 프로젝트 목표 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  프로젝트 목표
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingObjectives(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {editingObjectives ? (
                <div className="space-y-4">
                  {tempObjectives.map((objective, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-2 flex-shrink-0" />
                      <Input
                        value={objective}
                        onChange={(e) => {
                          const newObjectives = [...tempObjectives]
                          newObjectives[index] = e.target.value
                          setTempObjectives(newObjectives)
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const newObjectives = tempObjectives.filter((_, i) => i !== index)
                          setTempObjectives(newObjectives)
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTempObjectives([...tempObjectives, "새로운 목표"])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    목표 추가
                  </Button>
                  {lastSaveTimeRef.current && hasUnsavedChanges && (
                    <div className="text-xs text-gray-500 mb-2">
                      마지막 자동 저장: {lastSaveTimeRef.current.toLocaleTimeString("ko-KR")}
                    </div>
                  )}
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" onClick={saveObjectives}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => cancelEdit("objectives")}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {project.intro.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          {/* KPI 지표 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
                  핵심 성과 지표 (KPI)
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingKPIs(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {editingKPIs ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tempKPIs.map((kpi, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-2">
                        <Input
                          value={kpi.name}
                          onChange={(e) => {
                            const newKPIs = [...tempKPIs]
                            newKPIs[index].name = e.target.value
                            setTempKPIs(newKPIs)
                          }}
                          placeholder="KPI 이름"
                          className="font-medium"
                        />
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-12">목표:</span>
                            <Input
                              value={kpi.target}
                              onChange={(e) => {
                                const newKPIs = [...tempKPIs]
                                newKPIs[index].target = e.target.value
                                setTempKPIs(newKPIs)
                              }}
                              className="flex-1 text-sm"
                            />
                            <Input
                              value={kpi.unit}
                              onChange={(e) => {
                                const newKPIs = [...tempKPIs]
                                newKPIs[index].unit = e.target.value
                                setTempKPIs(newKPIs)
                              }}
                              className="w-16 text-sm"
                              placeholder="단위"
                            />
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600 w-12">현재:</span>
                            <Input
                              value={kpi.current}
                              onChange={(e) => {
                                const newKPIs = [...tempKPIs]
                                newKPIs[index].current = e.target.value
                                setTempKPIs(newKPIs)
                              }}
                              className="flex-1 text-sm"
                            />
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newKPIs = tempKPIs.filter((_, i) => i !== index)
                            setTempKPIs(newKPIs)
                          }}
                          className="w-full"
                        >
                          <X className="h-4 w-4 mr-2" />
                          삭제
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTempKPIs([...tempKPIs, { name: "새 KPI", target: "", current: "", unit: "" }])}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    KPI 추가
                  </Button>
                  {lastSaveTimeRef.current && hasUnsavedChanges && (
                    <div className="text-xs text-gray-500 mb-2">
                      마지막 자동 저장: {lastSaveTimeRef.current.toLocaleTimeString("ko-KR")}
                    </div>
                  )}
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" onClick={saveKPIs}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => cancelEdit("kpis")}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {project.intro.kpis.map((kpi, index) => (
                    <div key={index} className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">{kpi.name}</h4>
                      <div className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">목표:</span>
                          <span className="font-medium text-blue-600">
                            {kpi.target}
                            {kpi.unit}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">현재:</span>
                          <span className="font-medium text-green-600">
                            {kpi.current}
                            {kpi.unit}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* 필수 자원 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Briefcase className="h-5 w-5 mr-2 text-orange-600" />
                  필수 자원
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingResources(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 예산 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">예산</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>총 예산:</span>
                      <span className="font-medium">{project.resources.budget.total}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>사용 예산:</span>
                      <span className="font-medium text-blue-600">{project.resources.budget.allocated}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>잔여 예산:</span>
                      <span className="font-medium text-green-600">{project.resources.budget.remaining}</span>
                    </div>
                  </div>
                </div>

                {/* 팀 구성 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">팀 구성</h4>
                  <div className="space-y-2">
                    {project.resources.team.map((member, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{member.name}</span>
                          <span className="text-gray-600">{member.allocation}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 도구 및 소프트웨어 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">도구 & 소프트웨어</h4>
                  <div className="space-y-2">
                    {project.resources.tools.map((tool, index) => (
                      <div key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{tool.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {tool.status === "active" ? "활성" : "비활성"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 수행 전략 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-orange-600" />
                  프로젝트 수행 전략
                </CardTitle>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setEditingStrategy(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      수정
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              {editingStrategy ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tempStrategy.map((strategy, index) => (
                      <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                        <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                          {index + 1}
                        </div>
                        <Input
                          value={strategy}
                          onChange={(e) => {
                            const newStrategy = [...tempStrategy]
                            newStrategy[index] = e.target.value
                            setTempStrategy(newStrategy)
                          }}
                          className="flex-1"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            const newStrategy = tempStrategy.filter((_, i) => i !== index)
                            setTempStrategy(newStrategy)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setTempStrategy([...tempStrategy, "새로운 전략"])}>
                    <Plus className="h-4 w-4 mr-2" />
                    전략 추가
                  </Button>
                  {lastSaveTimeRef.current && hasUnsavedChanges && (
                    <div className="text-xs text-gray-500 mb-2">
                      마지막 자동 저장: {lastSaveTimeRef.current.toLocaleTimeString("ko-KR")}
                    </div>
                  )}
                  <div className="flex space-x-2 pt-4">
                    <Button size="sm" onClick={saveStrategy}>
                      <Save className="h-4 w-4 mr-2" />
                      저장
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => cancelEdit("strategy")}>
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.intro.strategy.map((strategy, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                      <div className="w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                        {index + 1}
                      </div>
                      <span className="text-gray-700">{strategy}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Task별 진척도 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-purple-600" />
                Task별 진척도
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.working.map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      <p className="text-sm text-gray-600">담당: {task.assignee.name}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Progress value={task.progress} className="w-24" />
                      <span className="text-sm font-medium w-12">{task.progress}%</span>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status === "completed"
                          ? "완료"
                          : task.status === "in-progress"
                            ? "진행중"
                            : task.status === "blocked"
                              ? "차단됨"
                              : "시작 전"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Meeting 탭 */}
        <TabsContent value="meeting" className="space-y-6">
          {/* 최근 회의 현황 - 상단으로 이동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-blue-600" />
                최근 회의 현황
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {project.meetings.recent.map((meeting) => (
                  <div
                    key={meeting.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => navigateToSession(meeting.sessionId)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{meeting.title}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{meeting.type}</span>
                        <span>•</span>
                        <span>{new Date(meeting.date).toLocaleDateString("ko-KR")}</span>
                        <span>•</span>
                        <span>{meeting.participants}명 참여</span>
                      </div>
                    </div>
                    <Badge className={getStatusColor(meeting.status)}>
                      {meeting.status === "completed" ? "완료" : meeting.status === "in-progress" ? "진행중" : "예정"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 회의 유형별 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 0. 사전 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-blue-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 사전 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-blue-600 hover:bg-blue-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Pre Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  공식 킥오프 전 아이디어와 방향성을 자유롭게 탐색하는 단계
                </p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-blue-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.preMeeting.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.preMeeting.completed}</span>
                    <span>진행: {project.meetings.stats.preMeeting.inProgress}</span>
                    <span>예정: {project.meetings.stats.preMeeting.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">프로젝트 방향성 탐색</h4>
                    <p className="text-xs text-gray-500">2024.01.08 • 5명 참여</p>
                  </div>
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-blue-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">아이디어 브레인스토밍</h4>
                    <p className="text-xs text-gray-500">2024.01.09 • 3명 참여</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 1. 킥오프 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-green-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 킥오프 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-green-600 hover:bg-green-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Kick-off Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  프로젝트 시작을 알리고 목표, 범위, 일정, 역할 등을 공유
                </p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-green-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.kickoff.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.kickoff.completed}</span>
                    <span>진행: {project.meetings.stats.kickoff.inProgress}</span>
                    <span>예정: {project.meetings.stats.kickoff.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-green-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">프로젝트 킥오프</h4>
                    <p className="text-xs text-gray-500">2024.01.10 • 전체 팀</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 2. 계획 수립 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-yellow-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 계획 수립 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-yellow-600 hover:bg-yellow-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Planning Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">작업 분담, 마일스톤 설정, 일정 계획 수립</p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-yellow-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.planning.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.planning.completed}</span>
                    <span>진행: {project.meetings.stats.planning.inProgress}</span>
                    <span>예정: {project.meetings.stats.planning.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-yellow-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">WBS 작성 회의</h4>
                    <p className="text-xs text-gray-500">2024.01.11 • 기획팀</p>
                  </div>
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-yellow-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">일정 계획 수립</h4>
                    <p className="text-xs text-gray-500">2024.01.12 • PM팀</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 3. 정기 진행 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-purple-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 정기 진행 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-purple-600 hover:bg-purple-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Regular Progress Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">주간/월간 진행 상황 공유 및 이슈 점검</p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-purple-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.regular.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.regular.completed}</span>
                    <span>진행: {project.meetings.stats.regular.inProgress}</span>
                    <span>예정: {project.meetings.stats.regular.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-purple-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">주간 스크럼</h4>
                    <p className="text-xs text-gray-500">매주 월요일 • 개발팀</p>
                  </div>
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-purple-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">월간 진행 보고</h4>
                    <p className="text-xs text-gray-500">매월 첫째 주 • 전체</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 4. 문제 해결 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-red-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 문제 해결 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-red-600 hover:bg-red-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Issue Resolution Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  발생한 문제나 리스크에 대한 논의 및 해결 방안 도출
                </p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-red-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.issue.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.issue.completed}</span>
                    <span>진행: {project.meetings.stats.issue.inProgress}</span>
                    <span>예정: {project.meetings.stats.issue.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-red-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">성능 이슈 해결</h4>
                    <p className="text-xs text-gray-500">2024.01.13 • 기술팀</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 5. 검토/피드백 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-indigo-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 검토/피드백 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-indigo-600 hover:bg-indigo-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Review & Feedback Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">중간 결과물, 프로토타입에 대한 피드백 수집</p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-indigo-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.review.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.review.completed}</span>
                    <span>진행: {project.meetings.stats.review.inProgress}</span>
                    <span>예정: {project.meetings.stats.review.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-indigo-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">디자인 리뷰</h4>
                    <p className="text-xs text-gray-500">2024.01.14 • 디자인팀</p>
                  </div>
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-indigo-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">사용자 테스트 결과</h4>
                    <p className="text-xs text-gray-500">2024.01.15 • UX팀</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 6. 결정 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-orange-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 결정 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-orange-600 hover:bg-orange-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Decision-Making Meeting</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">주요 방향, 전략, 예산, 리소스 등 중요한 결정</p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-orange-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.decision.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.decision.completed}</span>
                    <span>진행: {project.meetings.stats.decision.inProgress}</span>
                    <span>예정: {project.meetings.stats.decision.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div
                    className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-orange-50 transition-colors"
                    onClick={() => router.push(`/total-projects/${project.id}/brainstorming`)}
                  >
                    <h4 className="text-xs font-medium text-gray-900">기술 스택 결정</h4>
                    <p className="text-xs text-gray-500">2024.01.11 • 리더십</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 7. 종료 및 회고 회의 */}
            <Card className="border-2 border-dashed border-gray-200 hover:border-teal-300 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-700">🔹 종료 및 회고 회의</CardTitle>
                  <Button size="sm" variant="ghost" className="h-6 w-6 p-0 text-teal-600 hover:bg-teal-50">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Wrap-up & Retrospective</p>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-xs text-gray-600 mb-3 line-clamp-2">
                  프로젝트 종료 후 성과 리뷰, 문제점 분석, 개선점 정리
                </p>

                {/* 회의 통계 */}
                <div className="mb-3 p-2 bg-teal-50 rounded text-xs">
                  <div className="flex justify-between">
                    <span>총 {project.meetings.stats.retrospective.total}회</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>완료: {project.meetings.stats.retrospective.completed}</span>
                    <span>진행: {project.meetings.stats.retrospective.inProgress}</span>
                    <span>예정: {project.meetings.stats.retrospective.scheduled}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-center py-4">
                    <p className="text-xs text-gray-400">아직 예정된 회의가 없습니다</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Plan 탭 */}
        <TabsContent value="plan" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Lightbulb className="h-5 w-5 mr-2 text-yellow-600" />
                프로젝트 계획
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* 확정된 브레인스토밍 아이디어 */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900">확정된 기획안</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingConfirmedIdeas(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {editingConfirmedIdeas ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {tempConfirmedIdeas.map((idea, index) => (
                          <div
                            key={index}
                            className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                          >
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <Input
                              value={idea}
                              onChange={(e) => {
                                const newIdeas = [...tempConfirmedIdeas]
                                newIdeas[index] = e.target.value
                                setTempConfirmedIdeas(newIdeas)
                              }}
                              className="flex-1 text-sm border-none bg-transparent p-0 font-medium text-green-800"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const newIdeas = tempConfirmedIdeas.filter((_, i) => i !== index)
                                setTempConfirmedIdeas(newIdeas)
                              }}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setTempConfirmedIdeas([...tempConfirmedIdeas, "새로운 기획안"])}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        기획안 추가
                      </Button>
                      {lastSaveTimeRef.current && hasUnsavedChanges && (
                        <div className="text-xs text-gray-500 mb-2">
                          마지막 자동 저장: {lastSaveTimeRef.current.toLocaleTimeString("ko-KR")}
                        </div>
                      )}
                      <div className="flex space-x-2 pt-4">
                        <Button size="sm" onClick={saveConfirmedIdeas}>
                          <Save className="h-4 w-4 mr-2" />
                          저장
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => cancelEdit("confirmedIdeas")}>
                          취소
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {project.planning.confirmedIdeas.map((idea, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-3 bg-green-50 border border-green-200 rounded-lg"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          <span className="text-sm text-green-800 font-medium">{idea}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* WBS 구조 */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-gray-900">Work Breakdown Structure (WBS)</h4>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setEditingWBS(true)}>
                          <Edit className="h-4 w-4 mr-2" />
                          수정
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {editingWBS ? (
                    <div className="space-y-4">
                      {lastSaveTimeRef.current && hasUnsavedChanges && (
                        <div className="text-xs text-gray-500 mb-2">
                          마지막 자동 저장: {lastSaveTimeRef.current.toLocaleTimeString("ko-KR")}
                        </div>
                      )}

                      <div className="border rounded-lg overflow-auto max-h-96">
                        <div className="min-w-[1200px]">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-50 border-b">
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-80">
                                  Task명
                                </th>
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-40">
                                  담당자
                                </th>
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-32">
                                  시작일
                                </th>
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-32">
                                  마감일
                                </th>
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-24">
                                  진행률
                                </th>
                                <th className="border-r border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900 w-32">
                                  상태
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 w-20">작업</th>
                              </tr>
                            </thead>
                            <tbody>
                              {tempWBS.map((task, index) => (
                                <tr key={task.id} className="border-b hover:bg-gray-50">
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Input
                                      value={task.taskName}
                                      onChange={(e) => updateWBSTask(index, "taskName", e.target.value)}
                                      className="w-full text-sm"
                                    />
                                  </td>
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Input
                                      value={task.assignee.name}
                                      onChange={(e) =>
                                        updateWBSTask(index, "assignee", { ...task.assignee, name: e.target.value })
                                      }
                                      className="w-full text-sm"
                                    />
                                  </td>
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Input
                                      type="date"
                                      value={task.startDate}
                                      onChange={(e) => updateWBSTask(index, "startDate", e.target.value)}
                                      className="w-full text-sm"
                                    />
                                  </td>
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Input
                                      type="date"
                                      value={task.endDate}
                                      onChange={(e) => updateWBSTask(index, "endDate", e.target.value)}
                                      className="w-full text-sm"
                                    />
                                  </td>
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={task.progress}
                                      onChange={(e) => updateWBSTask(index, "progress", Number(e.target.value))}
                                      className="w-full text-sm"
                                    />
                                  </td>
                                  <td className="border-r border-gray-300 px-4 py-3">
                                    <Select
                                      value={task.status}
                                      onValueChange={(value) => updateWBSTask(index, "status", value)}
                                    >
                                      <SelectTrigger className="w-full text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="not-started">시작 전</SelectItem>
                                        <SelectItem value="in-progress">진행중</SelectItem>
                                        <SelectItem value="completed">완료</SelectItem>
                                        <SelectItem value="delayed">지연</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </td>
                                  <td className="px-4 py-3">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => deleteWBSTask(index)}
                                      className="h-8 w-8 p-0 text-red-600 hover:bg-red-50"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-4">
                        <Button onClick={addWBSTask} size="sm">
                          <Plus className="h-4 w-4 mr-2" />행 추가
                        </Button>
                        <div className="flex space-x-2">
                          <Button size="sm" onClick={saveWBS}>
                            <Save className="h-4 w-4 mr-2" />
                            저장
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => cancelEdit("wbs")}>
                            취소
                          </Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border rounded-lg overflow-auto max-h-96">
                      <div className="min-w-[1000px]">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                Task명
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                담당자
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                시작일
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                마감일
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                진행률
                              </th>
                              <th className="border border-gray-300 px-4 py-3 text-left text-sm font-medium text-gray-900">
                                상태
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.planning.wbs.map((task) => (
                              <tr
                                key={task.id}
                                className={`${task.level === 1 ? "bg-blue-50" : task.level === 2 ? "bg-gray-50" : "bg-white"} hover:bg-gray-100`}
                              >
                                <td className="border border-gray-300 px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    {task.level === 1 && <div className="w-2 h-2 bg-blue-600 rounded-full"></div>}
                                    {task.level === 2 && (
                                      <div className="w-2 h-2 bg-yellow-600 rounded-full ml-4"></div>
                                    )}
                                    <button
                                      onClick={() => navigateToTaskPage(task.id)}
                                      className={`text-sm hover:underline text-left ${task.level === 1 ? "font-semibold text-blue-900" : "font-medium text-gray-800"}`}
                                    >
                                      {task.taskName}
                                    </button>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                                        {task.assignee.name.charAt(0)}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-700">{task.assignee.name}</span>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <span className="text-sm text-gray-700">
                                    {new Date(task.startDate).toLocaleDateString("ko-KR")}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <span className="text-sm text-gray-700">
                                    {new Date(task.endDate).toLocaleDateString("ko-KR")}
                                  </span>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <div className="flex items-center space-x-2">
                                    <Progress value={task.progress} className="w-16 h-2" />
                                    <span className="text-xs text-gray-600">{task.progress}%</span>
                                  </div>
                                </td>
                                <td className="border border-gray-300 px-4 py-3">
                                  <Badge className={getStatusColor(task.status)}>
                                    {task.status === "completed"
                                      ? "완료"
                                      : task.status === "in-progress"
                                        ? "진행중"
                                        : task.status === "delayed"
                                          ? "지연"
                                          : "시작 전"}
                                  </Badge>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tasks 탭 */}
        <TabsContent value="tasks" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Hammer className="h-5 w-5 mr-2 text-blue-600" />
                진행 중인 작업
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {project.working && project.working.length > 0 ? (
                  project.working.map((task) => (
                    <div key={task.id} className="border rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between p-4 bg-gray-50 border-b">
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">{getPriorityIcon(task.priority)}</div>
                          <div>
                            <h4 className="font-medium text-gray-900">{task.title}</h4>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge className={getStatusColor(task.status)}>
                                {task.status === "completed"
                                  ? "완료"
                                  : task.status === "in-progress"
                                    ? "진행중"
                                    : task.status === "blocked"
                                      ? "차단됨"
                                      : task.status === "review"
                                        ? "검토중"
                                        : "시작 전"}
                              </Badge>
                              <Badge variant="outline" className={getPriorityColor(task.priority)}>
                                {task.priority === "urgent"
                                  ? "긴급"
                                  : task.priority === "high"
                                    ? "높음"
                                    : task.priority === "medium"
                                      ? "보통"
                                      : "낮음"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="text-right">
                            <div className="text-sm font-medium text-blue-600 mb-1">{task.progress}%</div>
                            <div className="text-xs text-gray-500">
                              {new Date(task.startDate).toLocaleDateString("ko-KR")} ~{" "}
                              {new Date(task.dueDate).toLocaleDateString("ko-KR")}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                작업 수정
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <X className="h-4 w-4 mr-2" />
                                작업 삭제
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="mb-4">
                          <p className="text-sm text-gray-700">{task.description}</p>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Avatar className="h-6 w-6">
                              <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                                {task.assignee.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm text-gray-600">{task.assignee.name}</span>
                          </div>
                          <Progress value={task.progress} className="w-32" />
                        </div>
                        {task.subtasks && task.subtasks.length > 0 && (
                          <div className="mt-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">서브태스크:</h5>
                            <div className="space-y-1">
                              {task.subtasks.map((subtask) => (
                                <div key={subtask.id} className="flex items-center space-x-2">
                                  <CheckCircle
                                    className={`h-4 w-4 ${subtask.completed ? "text-green-600" : "text-gray-300"}`}
                                  />
                                  <span
                                    className={`text-sm ${
                                      subtask.completed ? "text-gray-700 line-through" : "text-gray-700"
                                    }`}
                                  >
                                    {subtask.title}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <Hammer className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">아직 진행 중인 작업이 없습니다.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Review 탭 */}
        <TabsContent value="review" className="space-y-6">
          <div className="space-y-4">
            {project.reviews.length > 0 ? (
              project.reviews.map((review) => (
                <Card key={review.id} className="cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6" onClick={() => openReviewModal(review)}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">{getReviewTypeIcon(review.type)}</div>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-gray-900">{review.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {getReviewTypeName(review.type)}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">관련 Task: {review.taskTitle}</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{review.description}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end space-y-2">
                        <Badge className={getStatusColor(review.status)}>
                          {review.status === "pending"
                            ? "검토 대기"
                            : review.status === "approved"
                              ? "승인됨"
                              : review.status === "rejected"
                                ? "거부됨"
                                : "수정 필요"}
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(review.priority)}>
                          {review.priority === "urgent"
                            ? "긴급"
                            : review.priority === "high"
                              ? "높음"
                              : review.priority === "medium"
                                ? "보통"
                                : "낮음"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                              {review.submittedBy.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span>{review.submittedBy.name}</span>
                        </div>
                        <span>•</span>
                        <span>{new Date(review.submittedAt).toLocaleDateString("ko-KR")}</span>
                        {review.comments.length > 0 && (
                          <>
                            <span>•</span>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>{review.comments.length}개 댓글</span>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>마감: {new Date(review.dueDate).toLocaleDateString("ko-KR")}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">검토가 필요한 항목이 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Achievement 탭 */}
        <TabsContent value="achievement" className="space-y-6">
          <div className="space-y-4">
            {project.achievements.length > 0 ? (
              project.achievements.map((achievement) => (
                <Card key={achievement.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Trophy className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-2">{achievement.title}</h4>
                        <p className="text-gray-700 mb-3">{achievement.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mb-4">
                          <span>완료일: {achievement.completedDate}</span>
                          <span className="text-green-600 font-medium">{achievement.impact}</span>
                        </div>

                        {/* 산출물 */}
                        {achievement.deliverables && achievement.deliverables.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-2">산출물:</h5>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {achievement.deliverables.map((deliverable, index) => (
                                <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <FileText className="h-5 w-5 text-blue-600" />
                                  <div className="flex-1">
                                    <h6 className="text-sm font-medium text-gray-900">{deliverable.name}</h6>
                                    <p className="text-xs text-gray-600">{deliverable.description}</p>
                                  </div>
                                  <Badge variant="outline" className="text-xs">
                                    {deliverable.type}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 성과 지표 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {achievement.metrics.map((metric, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded">
                              <h5 className="text-sm font-medium text-gray-700">{metric.name}</h5>
                              <div className="flex items-center justify-between mt-1">
                                <span className="text-lg font-bold text-blue-600">{metric.value}</span>
                                <span className="text-sm text-green-600">{metric.improvement}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">아직 달성한 성과가 없습니다.</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {/* Setting 탭 */}
        <TabsContent value="setting" className="space-y-6">
          <div className="space-y-6">
            {/* AI 페르소나 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bot className="h-5 w-5 mr-2 text-blue-600" />
                  AI 페르소나 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.settings.aiPersonas.map((persona) => (
                    <div key={persona.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium text-gray-900">{persona.name}</h4>
                          <Badge variant="outline">{persona.role}</Badge>
                          <Switch checked={persona.isActive} />
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{persona.customPrompts}</p>
                        <div className="flex flex-wrap gap-1">
                          {persona.capabilities.map((capability, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {capability}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Settings className="h-4 w-4 mr-2" />
                        설정
                      </Button>
                    </div>
                  ))}
                  <Button className="w-full" variant="outline">
                    <Bot className="h-4 w-4 mr-2" />새 AI 페르소나 추가
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* 자동화 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Workflow className="h-5 w-5 mr-2 text-green-600" />
                  자동화 도구 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-assign">자동 작업 할당</Label>
                      <p className="text-sm text-gray-500">AI가 팀원의 역량에 따라 자동으로 작업을 할당합니다</p>
                    </div>
                    <Switch id="auto-assign" checked={project.settings.automation.autoAssignTasks} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="smart-notifications">스마트 알림</Label>
                      <p className="text-sm text-gray-500">중요한 이벤트와 마감일을 지능적으로 알림합니다</p>
                    </div>
                    <Switch id="smart-notifications" checked={project.settings.automation.smartNotifications} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="progress-tracking">진행률 자동 추적</Label>
                      <p className="text-sm text-gray-500">작업 진행률을 자동으로 업데이트하고 추적합니다</p>
                    </div>
                    <Switch id="progress-tracking" checked={project.settings.automation.progressTracking} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="report-generation">자동 리포트 생성</Label>
                      <p className="text-sm text-gray-500">주기적으로 프로젝트 진행 리포트를 자동 생성합니다</p>
                    </div>
                    <Switch id="report-generation" checked={project.settings.automation.reportGeneration} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 외부 연동 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Key className="h-5 w-5 mr-2 text-purple-600" />
                  외부 서비스 연동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {project.settings.integrations.map((integration, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Zap className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{integration.name}</h4>
                          <p className="text-sm text-gray-600">{integration.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant={integration.status === "connected" ? "default" : "secondary"}>
                          {integration.status === "connected" ? "연결됨" : "연결 안됨"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          {integration.status === "connected" ? "설정" : "연결"}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* 프로젝트 테마 설정 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Palette className="h-5 w-5 mr-2 text-pink-600" />
                  프로젝트 테마 설정
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="project-color">프로젝트 대표 색상</Label>
                    <div className="flex space-x-2 mt-2">
                      {["blue", "green", "purple", "orange", "red", "pink"].map((color) => (
                        <div
                          key={color}
                          className={`w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300 bg-${color}-500`}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="project-icon">프로젝트 아이콘</Label>
                    <Select defaultValue="briefcase">
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="briefcase">💼 Briefcase</SelectItem>
                        <SelectItem value="rocket">🚀 Rocket</SelectItem>
                        <SelectItem value="lightbulb">💡 Lightbulb</SelectItem>
                        <SelectItem value="target">🎯 Target</SelectItem>
                        <SelectItem value="star">⭐ Star</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          {selectedReview && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center space-x-2">
                  {getReviewTypeIcon(selectedReview.type)}
                  <span>{selectedReview.title}</span>
                  <Badge variant="outline" className="text-xs">
                    {getReviewTypeName(selectedReview.type)}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                {/* Review 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-700">관련 Task:</span>
                      <span className="ml-2 text-gray-900">{selectedReview.taskTitle}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">제출자:</span>
                      <span className="ml-2 text-gray-900">{selectedReview.submittedBy.name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">제출일:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedReview.submittedAt).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">마감일:</span>
                      <span className="ml-2 text-gray-900">
                        {new Date(selectedReview.dueDate).toLocaleDateString("ko-KR")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 설명 */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">설명</h4>
                  <p className="text-gray-700 leading-relaxed">{selectedReview.description}</p>
                </div>

                {/* 첨부파일 */}
                {selectedReview.attachments && selectedReview.attachments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">첨부파일</h4>
                    <div className="space-y-2">
                      {selectedReview.attachments.map((attachment: any, index: number) => (
                        <div key={index} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                          <FileText className="h-4 w-4 text-gray-600" />
                          <span className="text-sm text-gray-700">{attachment.name}</span>
                          <Button variant="outline" size="sm">
                            다운로드
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 기존 댓글 */}
                {selectedReview.comments.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">댓글</h4>
                    <div className="space-y-3">
                      {selectedReview.comments.map((comment: any) => (
                        <div key={comment.id} className="border-l-4 border-l-blue-200 pl-4">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-medium text-gray-900">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {new Date(comment.timestamp).toLocaleDateString("ko-KR")}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm">{comment.content}</p>
                          {comment.decision && (
                            <div className="mt-2">
                              <Badge
                                className={
                                  comment.decision === "approve"
                                    ? "bg-green-100 text-green-800"
                                    : comment.decision === "reject"
                                      ? "bg-red-100 text-red-800"
                                      : "bg-yellow-100 text-yellow-800"
                                }
                              >
                                {comment.decision === "approve"
                                  ? "승인"
                                  : comment.decision === "reject"
                                    ? "거부"
                                    : "수정 요청"}
                              </Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 의사결정 및 피드백 */}
                {selectedReview.status === "pending" && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-4">의사결정 및 피드백</h4>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="review-comment">피드백 (선택사항)</Label>
                        <Textarea
                          id="review-comment"
                          placeholder="검토 결과에 대한 피드백을 입력해주세요..."
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          className="mt-1"
                          rows={4}
                        />
                      </div>
                      <div className="flex space-x-3">
                        <Button
                          onClick={() => handleReviewDecision(selectedReview.id, "approve")}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <ThumbsUp className="h-4 w-4 mr-2" />
                          승인
                        </Button>
                        <Button
                          onClick={() => handleReviewDecision(selectedReview.id, "request-changes")}
                          variant="outline"
                          className="border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                        >
                          <Pause className="h-4 w-4 mr-2" />
                          수정 요청
                        </Button>
                        <Button
                          onClick={() => handleReviewDecision(selectedReview.id, "reject")}
                          variant="outline"
                          className="border-red-300 text-red-700 hover:bg-red-50"
                        >
                          <ThumbsDown className="h-4 w-4 mr-2" />
                          거부
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* 이미 결정된 경우 */}
                {selectedReview.status !== "pending" && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Badge className={getStatusColor(selectedReview.status)}>
                        {selectedReview.status === "approved"
                          ? "승인됨"
                          : selectedReview.status === "rejected"
                            ? "거부됨"
                            : "수정 필요"}
                      </Badge>
                      <span className="text-sm text-gray-600">이 검토 항목은 이미 처리되었습니다.</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
