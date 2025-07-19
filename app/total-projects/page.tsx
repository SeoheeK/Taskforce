"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  CheckCircle,
  Activity,
  AlertCircle,
  MoreHorizontal,
  Eye,
  Play,
  Briefcase,
  Trash2,
  Edit,
} from "lucide-react"
import { useRouter } from "next/navigation"

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
}

export default function TotalProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null)
  const router = useRouter()
  const [focusedCardIndex, setFocusedCardIndex] = useState<number>(-1)

  useEffect(() => {
    // 임시 Project 데이터
    setProjects([
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
      },
      {
        id: 2,
        title: "Mobile App Development",
        description: "Develop a cross-platform mobile application for e-commerce",
        category: "Mobile Development",
        priority: "high",
        status: "in-progress",
        progress: 35,
        manager: {
          id: 2,
          name: "개발자 사라",
          role: "Technical Lead",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-02-28",
        createdAt: "2024-01-05T10:00:00Z",
        updatedAt: "2024-01-13T16:45:00Z",
        estimatedHours: 320,
        actualHours: 112,
        tags: ["mobile", "react-native", "e-commerce"],
        teamSize: 5,
        budget: "₩15,000,000",
        client: "XYZ Corp",
      },
      {
        id: 3,
        title: "Data Analytics Platform",
        description: "Build a comprehensive data analytics and reporting platform",
        category: "Data Science",
        priority: "medium",
        status: "planning",
        progress: 10,
        manager: {
          id: 3,
          name: "분석가 리나",
          role: "Data Analyst",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-03-15",
        createdAt: "2024-01-12T11:00:00Z",
        updatedAt: "2024-01-13T09:15:00Z",
        estimatedHours: 240,
        tags: ["analytics", "dashboard", "reporting"],
        teamSize: 4,
        budget: "₩12,000,000",
        client: "Data Corp",
      },
      {
        id: 4,
        title: "Marketing Campaign",
        description: "Launch a comprehensive digital marketing campaign for Q1",
        category: "Marketing",
        priority: "medium",
        status: "review",
        progress: 85,
        manager: {
          id: 4,
          name: "마케터 제니",
          role: "Marketing Specialist",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-01-20",
        createdAt: "2024-01-01T13:00:00Z",
        updatedAt: "2024-01-13T11:20:00Z",
        estimatedHours: 80,
        actualHours: 68,
        tags: ["marketing", "digital", "campaign"],
        teamSize: 3,
        budget: "₩8,000,000",
        client: "Marketing Inc",
      },
      {
        id: 5,
        title: "API Integration",
        description: "Integrate multiple third-party APIs for the main platform",
        category: "Backend Development",
        priority: "high",
        status: "completed",
        progress: 100,
        manager: {
          id: 2,
          name: "개발자 사라",
          role: "Technical Lead",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-01-10",
        createdAt: "2023-12-20T15:00:00Z",
        updatedAt: "2024-01-10T17:30:00Z",
        estimatedHours: 60,
        actualHours: 58,
        tags: ["api", "integration", "backend"],
        teamSize: 2,
        budget: "₩4,000,000",
        client: "Tech Solutions",
      },
      {
        id: 6,
        title: "Quality Assurance Testing",
        description: "Comprehensive testing suite for the new product features",
        category: "Quality Assurance",
        priority: "low",
        status: "planning",
        progress: 5,
        manager: {
          id: 5,
          name: "QA 엘리",
          role: "Quality Assurance",
          avatar: "/placeholder.svg",
        },
        dueDate: "2024-02-05",
        createdAt: "2024-01-13T16:00:00Z",
        updatedAt: "2024-01-13T16:00:00Z",
        estimatedHours: 100,
        tags: ["testing", "qa", "automation"],
        teamSize: 3,
        budget: "₩6,000,000",
        client: "Quality Corp",
      },
    ])
  }, [])

  useEffect(() => {
    let filtered = projects

    // 검색 필터
    if (searchTerm) {
      filtered = filtered.filter(
        (project) =>
          project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    // 상태 필터
    if (filterStatus !== "all") {
      filtered = filtered.filter((project) => project.status === filterStatus)
    }

    // 우선순위 필터
    if (filterPriority !== "all") {
      filtered = filtered.filter((project) => project.priority === filterPriority)
    }

    // 카테고리 필터
    if (filterCategory !== "all") {
      filtered = filtered.filter((project) => project.category === filterCategory)
    }

    // 탭 필터
    if (activeTab !== "all") {
      filtered = filtered.filter((project) => project.status === activeTab)
    }

    setFilteredProjects(filtered)
  }, [projects, searchTerm, filterStatus, filterPriority, filterCategory, activeTab])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 통계 카드 네비게이션을 위한 키보드 이벤트
      const cardStatuses = ["all", "planning", "in-progress", "review", "completed"]

      if (e.key === "ArrowRight") {
        e.preventDefault()
        setFocusedCardIndex((prev) => {
          const nextIndex = prev < cardStatuses.length - 1 ? prev + 1 : 0
          return nextIndex
        })
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        setFocusedCardIndex((prev) => {
          const nextIndex = prev > 0 ? prev - 1 : cardStatuses.length - 1
          return nextIndex
        })
      } else if (e.key === "Enter" && focusedCardIndex >= 0) {
        e.preventDefault()
        setActiveTab(cardStatuses[focusedCardIndex])
      } else if (e.key === "Escape") {
        setFocusedCardIndex(-1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [focusedCardIndex])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Activity className="h-4 w-4 text-blue-600" />
      case "review":
        return <Eye className="h-4 w-4 text-purple-600" />
      case "planning":
        return <Clock className="h-4 w-4 text-gray-600" />
      case "cancelled":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

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
      case "cancelled":
        return "bg-red-100 text-red-800"
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "completed":
        return "완료"
      case "in-progress":
        return "진행중"
      case "review":
        return "검토중"
      case "planning":
        return "기획중"
      case "cancelled":
        return "취소됨"
      default:
        return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "높음"
      case "medium":
        return "보통"
      case "low":
        return "낮음"
      default:
        return priority
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 50) return "bg-blue-500"
    if (progress >= 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  const projectStats = {
    total: projects.length,
    planning: projects.filter((p) => p.status === "planning").length,
    inProgress: projects.filter((p) => p.status === "in-progress").length,
    review: projects.filter((p) => p.status === "review").length,
    completed: projects.filter((p) => p.status === "completed").length,
  }

  const handleProjectClick = (project: Project) => {
    router.push(`/total-projects/${project.id}`)
  }

  const handleDeleteClick = (e: React.MouseEvent, projectId: number) => {
    e.stopPropagation() // 이벤트 버블링 방지
    setProjectToDelete(projectId)
    setIsDeleteAlertOpen(true)
  }

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter((project) => project.id !== projectToDelete))
      setIsDeleteAlertOpen(false)
      setProjectToDelete(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Total Projects</h1>
          <p className="text-gray-600 mt-2">모든 프로젝트를 관리하고 추적하세요</p>
        </div>

        <Button
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          onClick={() => router.push("/taskforce/new")}
        >
          <Plus className="h-4 w-4 mr-2" />새 프로젝트 생성
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4" role="tablist" aria-label="프로젝트 상태별 필터">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "all" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          } ${focusedCardIndex === 0 ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
          onClick={() => setActiveTab("all")}
          onFocus={() => setFocusedCardIndex(0)}
          tabIndex={0}
          role="tab"
          aria-selected={activeTab === "all"}
          aria-label="전체 프로젝트 보기"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체 프로젝트</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.total}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "planning" ? "ring-2 ring-gray-500 bg-gray-50" : ""
          } ${focusedCardIndex === 1 ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
          onClick={() => setActiveTab("planning")}
          onFocus={() => setFocusedCardIndex(1)}
          tabIndex={0}
          role="tab"
          aria-selected={activeTab === "planning"}
          aria-label="기획중인 프로젝트 보기"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">기획중</p>
                <p className="text-2xl font-bold text-gray-900">{projectStats.planning}</p>
              </div>
              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "in-progress" ? "ring-2 ring-blue-500 bg-blue-50" : ""
          } ${focusedCardIndex === 2 ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
          onClick={() => setActiveTab("in-progress")}
          onFocus={() => setFocusedCardIndex(2)}
          tabIndex={0}
          role="tab"
          aria-selected={activeTab === "in-progress"}
          aria-label="진행중인 프로젝트 보기"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">진행중</p>
                <p className="text-2xl font-bold text-blue-900">{projectStats.inProgress}</p>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Play className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "review" ? "ring-2 ring-purple-500 bg-purple-50" : ""
          } ${focusedCardIndex === 3 ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
          onClick={() => setActiveTab("review")}
          onFocus={() => setFocusedCardIndex(3)}
          tabIndex={0}
          role="tab"
          aria-selected={activeTab === "review"}
          aria-label="검토중인 프로젝트 보기"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">검토중</p>
                <p className="text-2xl font-bold text-purple-900">{projectStats.review}</p>
              </div>
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md ${
            activeTab === "completed" ? "ring-2 ring-green-500 bg-green-50" : ""
          } ${focusedCardIndex === 4 ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
          onClick={() => setActiveTab("completed")}
          onFocus={() => setFocusedCardIndex(4)}
          tabIndex={0}
          role="tab"
          aria-selected={activeTab === "completed"}
          aria-label="완료된 프로젝트 보기"
        >
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">완료</p>
                <p className="text-2xl font-bold text-green-900">{projectStats.completed}</p>
              </div>
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
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
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 상태</SelectItem>
            <SelectItem value="planning">기획중</SelectItem>
            <SelectItem value="in-progress">진행중</SelectItem>
            <SelectItem value="review">검토중</SelectItem>
            <SelectItem value="completed">완료</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterPriority} onValueChange={setFilterPriority}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 우선순위</SelectItem>
            <SelectItem value="high">높음</SelectItem>
            <SelectItem value="medium">보통</SelectItem>
            <SelectItem value="low">낮음</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="카테고리" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">모든 카테고리</SelectItem>
            <SelectItem value="UI/UX Design">UI/UX Design</SelectItem>
            <SelectItem value="Mobile Development">Mobile Development</SelectItem>
            <SelectItem value="Backend Development">Backend Development</SelectItem>
            <SelectItem value="Data Science">Data Science</SelectItem>
            <SelectItem value="Marketing">Marketing</SelectItem>
            <SelectItem value="Quality Assurance">Quality Assurance</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* 현재 선택된 필터 표시 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            {activeTab === "all" && "전체 프로젝트"}
            {activeTab === "planning" && "기획중인 프로젝트"}
            {activeTab === "in-progress" && "진행중인 프로젝트"}
            {activeTab === "review" && "검토중인 프로젝트"}
            {activeTab === "completed" && "완료된 프로젝트"}
          </h2>
          <p className="text-sm text-gray-600 mt-1">총 {filteredProjects.length}개의 프로젝트</p>
        </div>
      </div>

      {/* 프로젝트 목록 */}
      <div className="mt-6">
        <div className="grid gap-4">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleProjectClick(project)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <Briefcase className="h-6 w-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{project.title}</h3>
                        <Badge className={getStatusColor(project.status)}>
                          {getStatusIcon(project.status)}
                          <span className="ml-1">{getStatusLabel(project.status)}</span>
                        </Badge>
                        <Badge className={getPriorityColor(project.priority)}>
                          {getPriorityLabel(project.priority)}
                        </Badge>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{project.description}</p>

                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {project.manager.name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {formatDate(project.dueDate)}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {project.estimatedHours}시간
                        </div>
                        {project.budget && (
                          <div className="flex items-center">
                            <span>예산: {project.budget}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="flex -space-x-2">
                            <Avatar className="w-6 h-6 border-2 border-white">
                              <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                                {project.manager.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            {project.teamSize > 1 && (
                              <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center">
                                <span className="text-xs text-gray-600">+{project.teamSize - 1}</span>
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">{project.teamSize}명</span>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getProgressColor(project.progress)}`}
                                style={{ width: `${project.progress}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{project.progress}%</span>
                          </div>
                        </div>
                      </div>

                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={(e) => e.stopPropagation()}>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Eye className="h-4 w-4 mr-2" />
                        상세 보기
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit className="h-4 w-4 mr-2" />
                        수정
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleDeleteClick(e, project.id)} className="text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Briefcase className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트가 없습니다</h3>
            <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 프로젝트를 생성해보세요.</p>
            <Button onClick={() => router.push("/taskforce/new")}>
              <Plus className="h-4 w-4 mr-2" />새 프로젝트 생성
            </Button>
          </div>
        )}
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>프로젝트 삭제</AlertDialogTitle>
            <AlertDialogDescription>
              정말로 이 프로젝트를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
