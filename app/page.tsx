"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  CheckCircle,
  Activity,
  Calendar,
  MessageSquare,
  FileText,
  Plus,
  ArrowRight,
  BarChart3,
  Target,
  Zap,
  Star,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalMembers: number
  avgProgress: number
  upcomingDeadlines: number
}

interface RecentProject {
  id: number
  title: string
  status: "planning" | "in-progress" | "review" | "completed"
  progress: number
  dueDate: string
  team: string[]
  priority: "high" | "medium" | "low"
}

interface RecentActivity {
  id: number
  type: "project_created" | "task_completed" | "meeting_scheduled" | "deliverable_submitted"
  title: string
  description: string
  timestamp: string
  user: string
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalMembers: 0,
    avgProgress: 0,
    upcomingDeadlines: 0,
  })

  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([])
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([])
  const router = useRouter()

  const [isSliding, setIsSliding] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false) // 실제로는 auth context에서 가져올 값

  // 로그인 상태 확인 (임시로 localStorage 사용)
  useEffect(() => {
    const checkLoginStatus = () => {
      // 실제로는 JWT 토큰이나 세션 확인
      const token = localStorage.getItem("authToken")
      setIsLoggedIn(!!token)
    }
    checkLoginStatus()
  }, [])

  const handleStartProject = async () => {
    if (!isLoggedIn) {
      // 로그인되지 않은 경우 로그인 페이지로 이동
      router.push("/login")
      return
    }

    // 슬라이딩 애니메이션 시작
    setIsSliding(true)

    // 애니메이션 완료 후 페이지 이동
    setTimeout(() => {
      router.push("/taskforce/new")
    }, 500)
  }

  useEffect(() => {
    // 임시 데이터 로딩
    setStats({
      totalProjects: 12,
      activeProjects: 8,
      completedProjects: 4,
      totalMembers: 24,
      avgProgress: 67,
      upcomingDeadlines: 3,
    })

    setRecentProjects([
      {
        id: 1,
        title: "Web Designing",
        status: "in-progress",
        progress: 75,
        dueDate: "2024-01-15",
        team: ["디자이너 마크", "개발자 사라"],
        priority: "high",
      },
      {
        id: 2,
        title: "Mobile App Development",
        status: "in-progress",
        progress: 45,
        dueDate: "2024-02-28",
        team: ["개발자 사라", "디자이너 마크", "분석가 리나"],
        priority: "high",
      },
      {
        id: 3,
        title: "Marketing Campaign",
        status: "review",
        progress: 90,
        dueDate: "2024-01-20",
        team: ["마케터 제니"],
        priority: "medium",
      },
    ])

    setRecentActivities([
      {
        id: 1,
        type: "project_created",
        title: "새 프로젝트 생성",
        description: "Data Analytics Platform 프로젝트가 생성되었습니다",
        timestamp: "2024-01-13T10:30:00Z",
        user: "분석가 리나",
      },
      {
        id: 2,
        type: "task_completed",
        title: "작업 완료",
        description: "사용자 리서치 작업이 완료되었습니다",
        timestamp: "2024-01-13T09:15:00Z",
        user: "디자이너 마크",
      },
      {
        id: 3,
        type: "meeting_scheduled",
        title: "회의 예약",
        description: "주간 진행 상황 점검 회의가 예약되었습니다",
        timestamp: "2024-01-13T08:45:00Z",
        user: "PM 알렉스",
      },
    ])
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "review":
        return "bg-purple-100 text-purple-800"
      case "planning":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project_created":
        return <Plus className="h-4 w-4 text-blue-600" />
      case "task_completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "meeting_scheduled":
        return <Calendar className="h-4 w-4 text-purple-600" />
      case "deliverable_submitted":
        return <FileText className="h-4 w-4 text-orange-600" />
      default:
        return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
  }

  const formatTimestamp = (timestamp: string) => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "방금 전"
    if (diffInHours < 24) return `${diffInHours}시간 전`
    return `${Math.floor(diffInHours / 24)}일 전`
  }

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 transition-transform duration-500 ${
        isSliding ? "-translate-x-full" : "translate-x-0"
      }`}
    >
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-2">프로젝트 현황과 최근 활동을 한눈에 확인하세요</p>
          </div>
          <div className="flex space-x-3">
            <Button
              size="lg"
              onClick={handleStartProject}
              disabled={isSliding}
              className={`bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 text-xl shadow-lg hover:shadow-xl transition-all transform hover:scale-105 ${
                isSliding ? "animate-pulse" : ""
              }`}
            >
              {isSliding ? "Starting..." : "Start New AI Team Project"}
              <ArrowRight className={`ml-3 h-6 w-6 transition-transform ${isSliding ? "translate-x-2" : ""}`} />
            </Button>
            <Link href="/total-projects">
              <Button variant="outline">
                <Briefcase className="h-4 w-4 mr-2" />
                모든 프로젝트
              </Button>
            </Link>
          </div>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">총 프로젝트</p>
                  <p className="text-3xl font-bold text-blue-900">{stats.totalProjects}</p>
                  <p className="text-blue-600 text-xs mt-1">
                    활성 {stats.activeProjects}개 • 완료 {stats.completedProjects}개
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">평균 진행률</p>
                  <p className="text-3xl font-bold text-green-900">{stats.avgProgress}%</p>
                  <div className="w-20 bg-green-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${stats.avgProgress}%` }}
                    />
                  </div>
                </div>
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">팀 멤버</p>
                  <p className="text-3xl font-bold text-purple-900">{stats.totalMembers}</p>
                  <p className="text-purple-600 text-xs mt-1">활성 참여자</p>
                </div>
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">임박한 마감일</p>
                  <p className="text-3xl font-bold text-orange-900">{stats.upcomingDeadlines}</p>
                  <p className="text-orange-600 text-xs mt-1">7일 이내</p>
                </div>
                <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 최근 프로젝트 */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-blue-600" />
                    최근 프로젝트
                  </CardTitle>
                  <Link href="/total-projects">
                    <Button variant="ghost" size="sm">
                      전체 보기
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => router.push(`/total-projects/${project.id}`)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <Badge className={getStatusColor(project.status)}>
                            {project.status === "in-progress"
                              ? "진행중"
                              : project.status === "review"
                                ? "검토중"
                                : project.status === "completed"
                                  ? "완료"
                                  : "기획중"}
                          </Badge>
                          <Badge className={getPriorityColor(project.priority)}>
                            {project.priority === "high" ? "높음" : project.priority === "medium" ? "보통" : "낮음"}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>마감: {formatDate(project.dueDate)}</span>
                          </div>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{project.team.length}명</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="text-right">
                          <div className="text-sm font-medium text-blue-600">{project.progress}%</div>
                          <Progress value={project.progress} className="w-20 h-2" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 최근 활동 */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-600" />
                  최근 활동
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">{getActivityIcon(activity.type)}</div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 line-clamp-2">{activity.description}</p>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-gray-500">{activity.user}</span>
                          <span className="text-xs text-gray-400">{formatTimestamp(activity.timestamp)}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* 빠른 액션 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Zap className="h-5 w-5 mr-2 text-yellow-600" />
              빠른 액션
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/taskforce/new">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Plus className="h-6 w-6 text-blue-600" />
                  <span className="text-sm font-medium">새 태스크포스</span>
                </Button>
              </Link>
              <Link href="/meeting/new">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <MessageSquare className="h-6 w-6 text-green-600" />
                  <span className="text-sm font-medium">회의 예약</span>
                </Button>
              </Link>
              <Link href="/personas">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <Users className="h-6 w-6 text-purple-600" />
                  <span className="text-sm font-medium">AI 페르소나</span>
                </Button>
              </Link>
              <Link href="/history">
                <Button variant="outline" className="w-full h-20 flex flex-col items-center justify-center space-y-2">
                  <BarChart3 className="h-6 w-6 text-orange-600" />
                  <span className="text-sm font-medium">프로젝트 히스토리</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* 성과 요약 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-indigo-900 mb-2">이번 달 성과</h3>
              <p className="text-3xl font-bold text-indigo-600 mb-1">4개</p>
              <p className="text-sm text-indigo-600">프로젝트 완료</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-teal-50 to-teal-100 border-teal-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-teal-900 mb-2">품질 점수</h3>
              <p className="text-3xl font-bold text-teal-600 mb-1">4.8</p>
              <p className="text-sm text-teal-600">평균 만족도</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-rose-900 mb-2">효율성</h3>
              <p className="text-3xl font-bold text-rose-600 mb-1">92%</p>
              <p className="text-sm text-rose-600">목표 대비 달성률</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
