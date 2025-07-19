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
import { ClipboardList, Plus, Search, Edit, Trash2, Star, TrendingUp, CheckCircle } from "lucide-react"

// 더미 데이터
const initialEvaluations = [
  {
    id: 1,
    name: "창의성 평가",
    description: "아이디어의 독창성과 혁신성을 평가하는 템플릿",
    category: "창의성",
    criteria: ["독창성", "실용성", "혁신성", "차별성"],
    scoreRange: "1-10점",
    usageCount: 67,
    avgScore: 7.8,
    status: "active",
  },
  {
    id: 2,
    name: "실현가능성 검토",
    description: "프로젝트나 아이디어의 실현 가능성을 종합적으로 평가",
    category: "실현가능성",
    criteria: ["기술적 타당성", "자원 확보", "시간 계획", "리스크 수준"],
    scoreRange: "1-5점",
    usageCount: 45,
    avgScore: 6.2,
    status: "active",
  },
  {
    id: 3,
    name: "비용 효율성",
    description: "투입 비용 대비 예상 효과를 분석하는 평가 템플릿",
    category: "경제성",
    criteria: ["초기 투자비", "운영비용", "예상 수익", "ROI"],
    scoreRange: "1-10점",
    usageCount: 38,
    avgScore: 8.1,
    status: "active",
  },
  {
    id: 4,
    name: "리스크 분석",
    description: "프로젝트 진행 시 발생할 수 있는 위험 요소 평가",
    category: "리스크",
    criteria: ["기술적 위험", "시장 위험", "재정적 위험", "운영 위험"],
    scoreRange: "1-5점",
    usageCount: 29,
    avgScore: 5.4,
    status: "draft",
  },
]

const categories = ["전체", "창의성", "실현가능성", "경제성", "리스크", "품질"]

export default function EvaluationTemplatesPage() {
  const [evaluations, setEvaluations] = useState(initialEvaluations)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredEvaluations = evaluations.filter((evaluation) => {
    const matchesSearch =
      evaluation.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evaluation.criteria.some((criteria) => criteria.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || evaluation.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalEvaluations = evaluations.length
  const activeEvaluations = evaluations.filter((e) => e.status === "active").length
  const totalUsage = evaluations.reduce((sum, e) => sum + e.usageCount, 0)
  const avgScore = evaluations.reduce((sum, e) => sum + e.avgScore, 0) / evaluations.length

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <ClipboardList className="h-8 w-8 mr-3 text-yellow-600" />
            평가표 템플릿 관리
          </h1>
          <p className="text-gray-600 mt-2">AI Task 결과물 평가 항목 세트를 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 평가표 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 평가표 템플릿 추가</DialogTitle>
              <DialogDescription>새로운 평가표 템플릿을 생성합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">평가표 이름</Label>
                <Input id="name" placeholder="예: 사용자 경험 평가" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="평가표에 대한 상세 설명을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="창의성">창의성</SelectItem>
                      <SelectItem value="실현가능성">실현가능성</SelectItem>
                      <SelectItem value="경제성">경제성</SelectItem>
                      <SelectItem value="리스크">리스크</SelectItem>
                      <SelectItem value="품질">품질</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scoreRange">점수 범위</Label>
                  <Input id="scoreRange" placeholder="예: 1-10점" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="criteria">평가 기준 (쉼표로 구분)</Label>
                <Textarea id="criteria" placeholder="예: 독창성, 실용성, 혁신성, 차별성" />
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
            <CardTitle className="text-sm font-medium">총 평가표</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEvaluations}</div>
            <p className="text-xs text-muted-foreground">+1 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 평가표</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEvaluations}</div>
            <p className="text-xs text-muted-foreground">현재 사용 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 평가 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 점수</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">전체 평균</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="평가표 검색..."
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

      {/* 평가표 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvaluations.map((evaluation) => (
          <Card key={evaluation.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{evaluation.name}</CardTitle>
                  <CardDescription className="mt-2">{evaluation.description}</CardDescription>
                </div>
                <Badge variant={evaluation.status === "active" ? "default" : "secondary"}>
                  {evaluation.status === "active" ? "활성" : "초안"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Star className="h-4 w-4 mr-2 text-gray-500" />
                  {evaluation.scoreRange}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2 text-gray-500" />
                  평균 {evaluation.avgScore}점
                </div>
                <div className="flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2 text-gray-500" />
                  {evaluation.criteria.length}개 기준
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2 text-gray-500" />
                  {evaluation.usageCount}회 사용
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">평가 기준:</p>
                <div className="flex flex-wrap gap-1">
                  {evaluation.criteria.map((criteria, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {criteria}
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEvaluations.length === 0 && (
        <div className="text-center py-12">
          <ClipboardList className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">평가표가 없습니다</h3>
          <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 평가표를 추가해보세요.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />첫 번째 평가표 추가
          </Button>
        </div>
      )}
    </div>
  )
}
