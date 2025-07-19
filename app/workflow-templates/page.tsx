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
import { GitBranch, Plus, Search, Edit, Trash2, Users, Clock, Target } from "lucide-react"

// 더미 데이터
const initialWorkflows = [
  {
    id: 1,
    name: "소프트웨어 개발",
    description: "애자일 방법론 기반의 소프트웨어 개발 워크플로우",
    category: "개발",
    steps: 8,
    estimatedTime: "2-4주",
    teamSize: "5-8명",
    usageCount: 45,
    tags: ["애자일", "스크럼", "개발"],
    status: "active",
  },
  {
    id: 2,
    name: "���케팅 캠페인",
    description: "디지털 마케팅 캠페인 기획부터 실행까지의 전체 프로세스",
    category: "마케팅",
    steps: 6,
    estimatedTime: "3-6주",
    teamSize: "3-5명",
    usageCount: 32,
    tags: ["디지털마케팅", "캠페인", "브랜딩"],
    status: "active",
  },
  {
    id: 3,
    name: "제품 기획",
    description: "신제품 기획부터 출시까지의 체계적인 프로세스",
    category: "기획",
    steps: 10,
    estimatedTime: "4-8주",
    teamSize: "6-10명",
    usageCount: 28,
    tags: ["제품기획", "시장조사", "프로토타입"],
    status: "active",
  },
  {
    id: 4,
    name: "정책 수립",
    description: "조직 내 정책 수립 및 승인 프로세스",
    category: "정책",
    steps: 7,
    estimatedTime: "2-3주",
    teamSize: "4-6명",
    usageCount: 15,
    tags: ["정책", "승인", "거버넌스"],
    status: "draft",
  },
]

const categories = ["전체", "개발", "마케팅", "기획", "정책", "운영"]

export default function WorkflowTemplatesPage() {
  const [workflows, setWorkflows] = useState(initialWorkflows)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesSearch =
      workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      workflow.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || workflow.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalWorkflows = workflows.length
  const activeWorkflows = workflows.filter((w) => w.status === "active").length
  const totalUsage = workflows.reduce((sum, w) => sum + w.usageCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <GitBranch className="h-8 w-8 mr-3 text-indigo-600" />
            Workflow 템플릿 관리
          </h1>
          <p className="text-gray-600 mt-2">특정 산업/분야별 업무 전개 흐름 템플릿을 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 워크플로우 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 워크플로우 템플릿 추가</DialogTitle>
              <DialogDescription>새로운 워크플로우 템플릿을 생성합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">워크플로우 이름</Label>
                <Input id="name" placeholder="예: 고객 서비스 프로세스" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="워크플로우에 대한 상세 설명을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="개발">개발</SelectItem>
                      <SelectItem value="마케팅">마케팅</SelectItem>
                      <SelectItem value="기획">기획</SelectItem>
                      <SelectItem value="정책">정책</SelectItem>
                      <SelectItem value="운영">운영</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="steps">단계 수</Label>
                  <Input id="steps" type="number" placeholder="8" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="time">예상 소요시간</Label>
                  <Input id="time" placeholder="예: 2-4주" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team">팀 규모</Label>
                  <Input id="team" placeholder="예: 5-8명" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                <Input id="tags" placeholder="예: 애자일, 스크럼, 개발" />
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
            <CardTitle className="text-sm font-medium">총 워크플로우</CardTitle>
            <GitBranch className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkflows}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 워크플로우</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeWorkflows}</div>
            <p className="text-xs text-muted-foreground">현재 사용 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 사용 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">카테고리 수</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
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
            placeholder="워크플로우 검색..."
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

      {/* 워크플로우 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkflows.map((workflow) => (
          <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{workflow.name}</CardTitle>
                  <CardDescription className="mt-2">{workflow.description}</CardDescription>
                </div>
                <Badge variant={workflow.status === "active" ? "default" : "secondary"}>
                  {workflow.status === "active" ? "활성" : "초안"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-gray-500" />
                  {workflow.steps}단계
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {workflow.estimatedTime}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  {workflow.teamSize}
                </div>
                <div className="flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 text-gray-500" />
                  {workflow.usageCount}회 사용
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {workflow.tags.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredWorkflows.length === 0 && (
        <div className="text-center py-12">
          <GitBranch className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">워크플로우가 없습니다</h3>
          <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 워크플로우를 추가해보세요.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />첫 번째 워크플로우 추가
          </Button>
        </div>
      )}
    </div>
  )
}
