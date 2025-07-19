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
import { Users, Plus, Search, Edit, Trash2, Clock, MessageSquare, Target } from "lucide-react"

// 더미 데이터
const initialMeetingFormats = [
  {
    id: 1,
    name: "아이디어 발굴 회의",
    description: "창의적 아이디어 도출을 위한 브레인스토밍 중심 회의",
    category: "브레인스토밍",
    duration: "60-90분",
    participants: "5-8명",
    structure: ["아이스브레이킹", "문제 정의", "아이디어 발산", "아이디어 수렴", "액션 플랜"],
    usageCount: 78,
    avgRating: 4.6,
    status: "active",
  },
  {
    id: 2,
    name: "의사결정 회의",
    description: "중요한 결정사항에 대한 체계적 의사결정 프로세스",
    category: "의사결정",
    duration: "45-60분",
    participants: "3-6명",
    structure: ["현황 공유", "옵션 검토", "장단점 분석", "투표/합의", "결정 확정"],
    usageCount: 65,
    avgRating: 4.8,
    status: "active",
  },
  {
    id: 3,
    name: "진행상황 점검",
    description: "프로젝트 진행 상황을 정기적으로 점검하는 스탠드업 회의",
    category: "점검",
    duration: "15-30분",
    participants: "4-10명",
    structure: ["어제 한 일", "오늘 할 일", "장애 요소", "도움 요청", "다음 단계"],
    usageCount: 92,
    avgRating: 4.4,
    status: "active",
  },
  {
    id: 4,
    name: "문제해결 세션",
    description: "특정 문제나 이슈를 집중적으로 해결하는 워크샵 형태",
    category: "문제해결",
    duration: "90-120분",
    participants: "6-12명",
    structure: ["문제 정의", "원인 분석", "해결책 도출", "실행 계획", "후속 조치"],
    usageCount: 43,
    avgRating: 4.7,
    status: "draft",
  },
]

const categories = ["전체", "브레인스토밍", "의사결정", "점검", "문제해결", "교육"]

export default function MeetingFormatsPage() {
  const [meetingFormats, setMeetingFormats] = useState(initialMeetingFormats)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("전체")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const filteredMeetingFormats = meetingFormats.filter((format) => {
    const matchesSearch =
      format.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format.structure.some((step) => step.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === "전체" || format.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalFormats = meetingFormats.length
  const activeFormats = meetingFormats.filter((f) => f.status === "active").length
  const totalUsage = meetingFormats.reduce((sum, f) => sum + f.usageCount, 0)
  const avgRating = meetingFormats.reduce((sum, f) => sum + f.avgRating, 0) / meetingFormats.length

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Users className="h-8 w-8 mr-3 text-cyan-600" />
            회의 유형/포맷 관리
          </h1>
          <p className="text-gray-600 mt-2">다양한 회의 운영 방식과 포맷을 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />새 회의 포맷 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>새 회의 포맷 추가</DialogTitle>
              <DialogDescription>새로운 회의 포맷을 생성합니다.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">회의 포맷 이름</Label>
                <Input id="name" placeholder="예: 전략 기획 회의" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">설명</Label>
                <Textarea id="description" placeholder="회의 포맷에 대한 상세 설명을 입력하세요" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">카테고리</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="카테고리 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="브레인스토밍">브레인스토밍</SelectItem>
                      <SelectItem value="의사결정">의사결정</SelectItem>
                      <SelectItem value="점검">점검</SelectItem>
                      <SelectItem value="문제해결">문제해결</SelectItem>
                      <SelectItem value="교육">교육</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">소요 시간</Label>
                  <Input id="duration" placeholder="예: 60-90분" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">참여 인원</Label>
                  <Input id="participants" placeholder="예: 5-8명" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="structure">회의 구조 (쉼표로 구분)</Label>
                <Textarea id="structure" placeholder="예: 오프닝, 현황 공유, 토론, 결론 도출, 액션 아이템" />
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
            <CardTitle className="text-sm font-medium">총 회의 포맷</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalFormats}</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 포맷</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeFormats}</div>
            <p className="text-xs text-muted-foreground">현재 사용 중</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사용 횟수</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">누적 회의 횟수</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 만족도</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">5점 만점</p>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="회의 포맷 검색..."
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

      {/* 회의 포맷 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeetingFormats.map((format) => (
          <Card key={format.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{format.name}</CardTitle>
                  <CardDescription className="mt-2">{format.description}</CardDescription>
                </div>
                <Badge variant={format.status === "active" ? "default" : "secondary"}>
                  {format.status === "active" ? "활성" : "초안"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-gray-500" />
                  {format.duration}
                </div>
                <div className="flex items-center">
                  <Users className="h-4 w-4 mr-2 text-gray-500" />
                  {format.participants}
                </div>
                <div className="flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2 text-gray-500" />
                  {format.usageCount}회 사용
                </div>
                <div className="flex items-center">
                  <Target className="h-4 w-4 mr-2 text-gray-500" />★ {format.avgRating}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">회의 구조:</p>
                <div className="flex flex-wrap gap-1">
                  {format.structure.slice(0, 3).map((step, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {step}
                    </Badge>
                  ))}
                  {format.structure.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{format.structure.length - 3}개 더
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
                  <Trash2 className="h-4 w-4 mr-2" />
                  삭제
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeetingFormats.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">회의 포맷이 없습니다</h3>
          <p className="text-gray-500 mb-4">검색 조건을 변경하거나 새 포맷을 추가해보세요.</p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />첫 번째 포맷 추가
          </Button>
        </div>
      )}
    </div>
  )
}
