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
import { FileOutput, Plus, Search, Edit, Download, FileText, Eye } from "lucide-react"

// 더미 데이터
const initialDeliverables = [
  {
    id: 1,
    name: "사업계획서",
    description: "스타트업 및 신사업을 위한 표준 사업계획서 템플릿",
    category: "비즈니스",
    format: "Markdown",
    sections: ["개요", "시장분석", "경쟁분석", "마케팅전략", "재무계획"],
    usageCount: 89,
    downloadCount: 156,
    lastModified: "2024-01-15",
    status: "active",
  },
  {
    id: 2,
    name: "기술문서",
    description: "소프트웨어 개발 프로젝트를 위한 기술 문서 템플릿",
    category: "기술",
    format: "Markdown",
    sections: ["아키텍처", "API 명세", "데이터베이스", "배포가이드", "테스트"],
    usageCount: 67,
    downloadCount: 134,
    lastModified: "2024-01-12",
    status: "active",
  },
  {
    id: 3,
    name: "마케팅 자료",
    description: "제품 및 서비스 마케팅을 위한 프레젠테이션 템플릿",
    category: "마케팅",
    format: "PowerPoint",
    sections: ["제품소개", "타겟고객", "경쟁우위", "마케팅믹스", "성과지표"],
    usageCount: 45,
    downloadCount: 98,
    lastModified: "2024-01-10",
    status: "active",
  },
  {
    id: 4,
    name: "교육 콘텐츠",
    description: "온라인 교육 과정을 위한 콘텐츠 구조 템플릿",
    category: "교육",
    format: "HTML",
    sections: ["학습목표", "이론설명", "실습과제", "평가방법", "참고자료"],
    usageCount: 32,
    downloadCount: 67,
    lastModified: "2024-01-08",
    status: "draft",
  },
]

const categories = ["전체", "비즈니스", "기술", "마케팅", "교육", "연구"]
const formats = ["전체", "Markdown", "HTML", "PowerPoint", "Word", "PDF"]

export default function DeliverableTemplatesPage() {
  const [deliverables, setDeliverables] = useState(initialDeliverables)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [selectedFormat, setSelectedFormat] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredDeliverables = deliverables.filter((deliverable) => {
    const matchesSearch =
      deliverable.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deliverable.sections.some((section) => section.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || deliverable.category === selectedCategory
    const matchesFormat = selectedFormat === "전체" || deliverable.format === selectedFormat
    return matchesSearch && matchesCategory && matchesFormat
  })

  const totalDeliverables = deliverables.length
  const activeDeliverables = deliverables.filter((d) => d.status === "active").length
  const totalUsage = deliverables.reduce((sum, d) => sum + d.usageCount, 0)
  const totalDownloads = deliverables.reduce((sum, d) => sum + d.downloadCount, 0)

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileOutput className="h-8 w-8 mr-3 text-emerald-600" />
            산출물 템플릿 관리
          </h1>
          <p className="text-gray-600 mt-2">보고서/계획서 등의 정형 문서 구조를 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 산출물 템플릿 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 산출물 템플릿 추가</DialogTitle>
              <DialogDescription>새로운 산출물 템플릿을 생성합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">템플릿 이름</Label>
                <Input id="name" placeholder="예: 프로젝트 제안서" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="산출물 템플릿에 대한 상세 설명을 입력하세요" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="비즈니스">비즈니스</SelectItem>
                      <SelectItem value="기술">기술</SelectItem>
                      <SelectItem value="마케팅">마케팅</SelectItem>
                      <SelectItem value="교육">교육</SelectItem>
                      <SelectItem value="연구">연구</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="format">문서 형식</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="형식 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Markdown">Markdown</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                      <SelectItem value="PowerPoint">PowerPoint</SelectItem>
                      <SelectItem value="Word">Word</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sections">문서 섹션 (쉼표로 구분)</Label>
                <Textarea id="sections" placeholder="예: 개요, 목표, 방법론, 결과, 결론" />
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
            <FileOutput className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeliverables}</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 템플릿</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeliverables}</div>
            <p className="text-xs text-muted-foreground">현재 사용 가능</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 사용 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 다운로드</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDownloads}</div>
            <p className="text-xs text-muted-foreground">누적 다운로드</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="산출물 템플릿 검색..."
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
        <Select value={selectedFormat} onValueChange={setSelectedFormat}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {formats.map((format) => (
              <SelectItem key={format} value={format}>
                {format}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* 산출물 템플릿 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDeliverables.map((deliverable) => (
          <Card key={deliverable.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{deliverable.name}</CardTitle>
                  <CardDescription className="mt-2">{deliverable.description}</CardDescription>
                </div>
                <Badge variant={deliverable.status === "active" ? "default" : "secondary"}>
                  {deliverable.status === "active" ? "활성" : "초안"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  {deliverable.format}
                </div>
                <div className="flex items-center">
                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                  {deliverable.usageCount}회 사용
                </div>
                <div className="flex items-center">
                  <Download className="h-4 w-4 mr-2 text-gray-500" />
                  {deliverable.downloadCount}회 다운로드
                </div>
                <div className="flex items-center">
                  <FileOutput className="h-4 w-4 mr-2 text-gray-500" />
                  {deliverable.sections.length}개 섹션
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">문서 섹션:</p>
                <div className="flex flex-wrap gap-1">
                  {deliverable.sections.slice(0, 3).map((section, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {section}
                    </Badge>
                  ))}
                  {deliverable.sections.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{deliverable.sections.length - 3}개 더
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-2" />
                  편집
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  다운로드
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredDeliverables.length === 0 && (
        <div className="text-center py-12">
          <FileOutput className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">산출물 템플릿이 없습니다</h3>
          <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 템플릿을 추가해보세요.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />첫 번째 템플릿 추가
          </Button>
        </div>
      )}
    </div>
  )
}
