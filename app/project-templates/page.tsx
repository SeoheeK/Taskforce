"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FolderOpen, Plus, Search, Edit, Users, Calendar, Target, Copy } from "lucide-react"

// 더미 데이터
const initialProjects = [
  {
    id: 1,
    name: "스타트업 MVP",
    description: "최소 기능 제품 개발을 위한 프로젝트 템플릿",
    category: "스타트업",
    personas: ["제품 매니저", "개발자", "디자이너"],
    mcpStrategy: "Agile Sprint",
    duration: "8-12주",
    teamSize: "3-5명",
    usageCount: 34,
    lastUsed: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "기업 혁신 프로젝트",
    description: "기존 기업의 디지털 혁신을 위한 종합 프로젝트 템플릿",
    category: "기업혁신",
    personas: ["혁신 리더", "IT 전문가", "비즈니스 분석가", "변화관리 전문가"],
    mcpStrategy: "Consensus Building",
    duration: "16-24주",
    teamSize: "8-12명",
    usageCount: 28,
    lastUsed: "2024-01-10",
    status: "active",
  },
  {
    id: 3,
    name: "교육 프로그램",
    description: "온라인 교육 콘텐츠 개발 및 운영 프로젝트",
    category: "교육",
    personas: ["교육 설계자", "콘텐츠 전문가", "기술 개발자"],
    mcpStrategy: "Expert Priority",
    duration: "12-16주",
    teamSize: "4-6명",
    usageCount: 22,
    lastUsed: "2024-01-08",
    status: "active",
  },
  {
    id: 4,
    name: "연구개발 과제",
    description: "신기술 연구개발을 위한 체계적 프로젝트 템플릿",
    category: "R&D",
    personas: ["연구 책임자", "기술 전문가", "데이터 분석가"],
    mcpStrategy: "Round Robin",
    duration: "20-32주",
    teamSize: "5-8명",
    usageCount: 15,
    lastUsed: "2024-01-05",
    status: "draft",
  },
]

const categories = ["전체", "스타트업", "기업혁신", "교육", "R&D", "마케팅"]

export default function ProjectTemplatesPage() {
  const [projects, setProjects] = useState(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.personas.some((persona) => persona.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || project.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "active").length
  const totalUsage = projects.reduce((sum, p) => sum + p.usageCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FolderOpen className="h-8 w-8 mr-3 text-pink-600" />
            프로젝트 템플릿 관리
          </h1>
          <p className="text-gray-600 mt-2">과거 프로젝트 설정을 템플릿화하여 재사용할 수 있습니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 프로젝트 템플릿 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 프로젝트 템플릿 추가</DialogTitle>
              <DialogDescription>새로운 프로젝트 템플릿을 생성합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">템플릿 이름</Label>
                <Input id="name" placeholder="예: 모바일 앱 개발" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="프로젝트 템플릿에 대한 상세 설명을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="스타트업">스타트업</SelectItem>
                      <SelectItem value="기업혁신">기업혁신</SelectItem>
                      <SelectItem value="교육">교육</SelectItem>
                      <SelectItem value="R&D">R&D</SelectItem>
                      <SelectItem value="마케팅">마케팅</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">예상 기간</Label>
                  <Input id="duration" placeholder="예: 8-12주" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="teamSize">팀 규모</Label>
                  <Input id="teamSize" placeholder="예: 3-5명" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mcpStrategy">MCP 전략</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="전략 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Round Robin">Round Robin</SelectItem>
                      <SelectItem value="Majority Vote">Majority Vote</SelectItem>
                      <SelectItem value="Consensus Building">Consensus Building</SelectItem>
                      <SelectItem value="Expert Priority">Expert Priority</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="personas">참여 페르소나 (쉼표로 구분)</Label>
                <Textarea id="personas" placeholder="예: 제품 매니저, 개발자, 디자이너" />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>생성</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 통계 대시보드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 템플릿</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalProjects}</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 템플릿</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeProjects}</div>
            <p className="text-xs text-muted-foreground">현재 사용 가능</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 복사 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">카테고리 수</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length - 1}</div>
            <p className="text-xs text-muted-foreground">분류된 카테고리</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="프로젝트 템플릿 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 프로젝트 템플릿 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{project.name}</CardTitle>
                  <CardDescription className="mt-2">{project.description}</CardDescription>
                </div>
                <Badge variant={project.status === "active" ? "default" : "secondary"}>
                  {project.status === "active" ? "활성" : "초안"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                  {project.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  {project.teamSize}
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-gray-500" />
                  {project.mcpStrategy}
                </div>
                <div className="flex items-center">
                  <Copy className="h-4 w-4 mr-2 text-gray-500" />
                  {project.usageCount}회 사용
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">참여 페르소나:</p>
                <div className="flex flex-wrap gap-1">
                  {project.personas.map((persona, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {persona}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  복사
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">프로젝트 템플릿이 없습니다</h3>
          <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 템플릿을 추가해보세요.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />첫 번째 템플릿 추가
          </Button>
        </div>
      )}
    </div>
  )
}
