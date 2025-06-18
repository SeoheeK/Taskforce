"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Bot,
  MessageSquare,
  Zap,
  FileText,
  Briefcase,
  GitBranch,
  ClipboardList,
  FolderIcon as FolderTemplate,
  FileOutput,
  Users,
  ArrowRight,
  Settings,
  Plus,
  X,
} from "lucide-react"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

const resourceCategories = [
  // 🤖 AI 에이전트 설정
  {
    id: 1,
    category: "AI 에이전트 설정",
    categoryIcon: Bot,
    categoryColor: "from-blue-500 to-cyan-500",
    items: [
      {
        id: 11,
        title: "Persona",
        description: "이름, 역할, 말투, 전문분야, 제약조건 등 AI Agent 성격 설정",
        href: "/resource/personas",
        icon: Bot,
        color: "from-blue-500 to-cyan-500",
        stats: { total: 12, active: 8 },
        features: ["마케팅 전문가", "개발팀 리더", "UI/UX 디자이너", "데이터 분석가"],
      },
      {
        id: 12,
        title: "Prompt 템플릿",
        description: "역할/상황별 프롬프트 조각 모듈화 (기획 요청, 반론 유도 등)",
        href: "/resource/prompt-templates",
        icon: MessageSquare,
        color: "from-purple-500 to-pink-500",
        stats: { total: 24, active: 18 },
        features: ["브레인스토밍 시작", "아이디어 평가", "결론 도출", "반박 의견 제시"],
      },
      {
        id: 13,
        title: "MCP 전략",
        description: "토론 및 의사결정 흐름 제어 규칙 (round-robin, voting 등)",
        href: "/resource/mcp-strategy",
        icon: Zap,
        color: "from-orange-500 to-red-500",
        stats: { total: 8, active: 6 },
        features: ["Round Robin", "Majority Vote", "Consensus Building", "Expert Priority"],
      },
      {
        id: 14,
        title: "Output Format",
        description: "AI가 출력할 문서 포맷 정의 (예: 회의록, 요약문, 테이블)",
        href: "/resource/output-formats",
        icon: FileText,
        color: "from-green-500 to-teal-500",
        stats: { total: 15, active: 12 },
        features: ["회의록 템플릿", "프로젝트 계획서", "분석 보고서", "요약 문서"],
      },
    ],
  },
  // 👩‍💼 PM 도구 (운영/관리자용)
  {
    id: 2,
    category: "Project Management Tool",
    categoryIcon: Briefcase,
    categoryColor: "from-indigo-500 to-purple-500",
    items: [
      {
        id: 21,
        title: "Workflow 템플릿",
        description: "특정 산업/분야별 업무 전개 흐름 템플릿 (예: 정책기획, 시공 프로세스 등)",
        href: "/resource/workflow-templates",
        icon: GitBranch,
        color: "from-indigo-500 to-blue-500",
        stats: { total: 18, active: 14 },
        features: ["소프트웨어 개발", "마케팅 캠페인", "제품 기획", "정책 수립"],
      },
      {
        id: 22,
        title: "평가표 템플릿",
        description: "AI Task 결과물 평가 항목 세트 (정확성, 창의성, 실현가능성 등)",
        href: "/resource/evaluation-templates",
        icon: ClipboardList,
        color: "from-yellow-500 to-orange-500",
        stats: { total: 12, active: 9 },
        features: ["창의성 평가", "실현가능성 검토", "비용 효율성", "리스크 분석"],
      },
      {
        id: 23,
        title: "프로젝트 템플릿",
        description: "과거 프로젝트의 세팅 값(규칙/참여페르소나/MCP 등)을 유사프로젝트에 활용할 수 있도록 템플릿화",
        href: "/resource/project-templates",
        icon: FolderTemplate,
        color: "from-pink-500 to-rose-500",
        stats: { total: 25, active: 20 },
        features: ["스타트업 MVP", "기업 혁신 프로젝트", "교육 프로그램", "연구개발 과제"],
      },
      {
        id: 24,
        title: "산출물 템플릿",
        description: "보고서/계획서 등의 정형 문서 구조 (Markdown / Table 등)",
        href: "/resource/deliverable-templates",
        icon: FileOutput,
        color: "from-emerald-500 to-green-500",
        stats: { total: 32, active: 28 },
        features: ["사업계획서", "기술문서", "마케팅 자료", "교육 콘텐츠"],
      },
      {
        id: 25,
        title: "회의 유형 / 포맷",
        description: "주제 발제형, 브레인스토밍형, 정리형 등 회의 운영 방식 정의",
        href: "/resource/meeting-formats",
        icon: Users,
        color: "from-cyan-500 to-blue-500",
        stats: { total: 10, active: 8 },
        features: ["아이디어 발굴 회의", "의사결정 회의", "진행상황 점검", "문제해결 세션"],
      },
    ],
  },
]

// 색상 옵션들 (순서대로 선택됨)
const colorOptions = [
  "from-blue-500 to-cyan-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-red-500",
  "from-green-500 to-teal-500",
  "from-indigo-500 to-purple-500",
  "from-pink-500 to-rose-500",
  "from-yellow-500 to-orange-500",
  "from-red-500 to-pink-500",
  "from-cyan-500 to-blue-500",
  "from-emerald-500 to-green-500",
]

// 아이콘 옵션들 (순서대로 선택됨)
const iconOptions = [
  { icon: Bot, name: "Bot" },
  { icon: MessageSquare, name: "MessageSquare" },
  { icon: Zap, name: "Zap" },
  { icon: FileText, name: "FileText" },
  { icon: Briefcase, name: "Briefcase" },
  { icon: GitBranch, name: "GitBranch" },
  { icon: ClipboardList, name: "ClipboardList" },
  { icon: FolderTemplate, name: "FolderTemplate" },
  { icon: FileOutput, name: "FileOutput" },
  { icon: Users, name: "Users" },
  { icon: Settings, name: "Settings" },
]

export default function ResourcePage() {
  const [categories, setCategories] = useState(resourceCategories)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)
  const [newResourceType, setNewResourceType] = useState({
    title: "",
    description: "",
    features: [""],
  })

  const addFeature = () => {
    setNewResourceType({
      ...newResourceType,
      features: [...newResourceType.features, ""],
    })
  }

  const removeFeature = (index: number) => {
    if (newResourceType.features.length > 1) {
      const newFeatures = newResourceType.features.filter((_, i) => i !== index)
      setNewResourceType({ ...newResourceType, features: newFeatures })
    }
  }

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...newResourceType.features]
    newFeatures[index] = value
    setNewResourceType({ ...newResourceType, features: newFeatures })
  }

  const createNewResourceType = () => {
    if (newResourceType.title && newResourceType.description) {
      const targetCategory = categories[selectedCategory]
      const newId = Math.max(...targetCategory.items.map((item) => item.id)) + 1

      // 아이콘과 색상을 순서대로 자동 선택
      const iconIndex = targetCategory.items.length % iconOptions.length
      const colorIndex = targetCategory.items.length % colorOptions.length

      // URL 친화적인 slug 생성
      const slug = newResourceType.title
        .toLowerCase()
        .replace(/[^a-z0-9가-힣]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")

      const newResource = {
        id: newId,
        title: newResourceType.title,
        description: newResourceType.description,
        href: `/resource/${slug}`, // 동적 라우트로 변경
        icon: iconOptions[iconIndex].icon,
        color: colorOptions[colorIndex],
        stats: { total: 0, active: 0 },
        features: newResourceType.features.filter((f) => f.trim() !== ""),
      }

      const updatedCategories = [...categories]
      updatedCategories[selectedCategory].items.push(newResource)
      setCategories(updatedCategories)

      // 폼 초기화
      setNewResourceType({
        title: "",
        description: "",
        features: [""],
      })

      setIsDialogOpen(false)
    }
  }

  const cancelCreate = () => {
    setNewResourceType({
      title: "",
      description: "",
      features: [""],
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Center</h1>
          <p className="text-gray-600 mt-2">AI 에이전트와 PM 도구를 체계적으로 관리하는 리소스 센터입니다</p>
        </div>
      </div>

      {/* 리소스 카테고리별 섹션 */}
      {categories.map((category) => (
        <div key={category.id} className="space-y-4">
          {/* 카테고리 헤더 */}
          <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
            <div
              className={`h-8 w-8 bg-gradient-to-r ${category.categoryColor} rounded-lg flex items-center justify-center`}
            >
              <category.categoryIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
            <div className="text-sm text-gray-500">({category.items.length}개)</div>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="ml-2 h-7 w-7 p-0 rounded-full"
                  onClick={() => {
                    setSelectedCategory(categories.findIndex((c) => c.id === category.id))
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
            </Dialog>
          </div>

          {/* 카테고리 아이템들 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 group flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div
                      className={`h-10 w-10 bg-gradient-to-r ${item.color} rounded-lg flex items-center justify-center`}
                    >
                      <item.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">총 {item.stats.total}개</p>
                      <p className="text-xs font-medium text-green-600">활성 {item.stats.active}개</p>
                    </div>
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription className="text-gray-600 text-xs leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col justify-between pt-0 h-full">
                  <div className="space-y-3 mb-4">
                    <div className="flex flex-wrap gap-1.5">
                      {item.features.slice(0, 4).map((feature, index) => {
                        const tagColors = [
                          "bg-green-100 text-green-700 border border-green-200",
                          "bg-purple-100 text-purple-700 border border-purple-200",
                          "bg-orange-100 text-orange-700 border border-orange-200",
                          "bg-blue-100 text-blue-700 border border-blue-200",
                        ]
                        return (
                          <span
                            key={index}
                            className={`${tagColors[index % 4]} px-2 py-0.5 rounded-full text-xs font-medium`}
                          >
                            {feature}
                          </span>
                        )
                      })}
                    </div>
                    {item.features.length > 4 && (
                      <p className="text-xs text-gray-500">+{item.features.length - 4}개 더</p>
                    )}
                  </div>

                  <Link href={item.href} className="mt-auto">
                    <Button
                      size="sm"
                      className="w-full group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all"
                    >
                      관리하기
                      <ArrowRight className="h-3 w-3 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {/* Dialog for adding new resource type */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>새 리소스 타입 추가</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="resourceTitle">Resource Type 이름</Label>
              <Input
                id="resourceTitle"
                value={newResourceType.title}
                onChange={(e) => setNewResourceType({ ...newResourceType, title: e.target.value })}
                placeholder="예: Knowledge Base"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="resourceDescription">설명</Label>
              <Textarea
                id="resourceDescription"
                value={newResourceType.description}
                onChange={(e) => setNewResourceType({ ...newResourceType, description: e.target.value })}
                placeholder="이 리소스 타입에 대한 설명을 입력하세요"
                rows={3}
                className="mt-1"
              />
            </div>

            <div>
              <Label>자원 예시</Label>
              {newResourceType.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`자원 예시 ${index + 1}`}
                  />
                  {newResourceType.features.length > 1 && (
                    <Button variant="outline" size="sm" onClick={() => removeFeature(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addFeature} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                예시 추가
              </Button>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={createNewResourceType} className="flex-1">
                생성
              </Button>
              <Button variant="outline" onClick={cancelCreate} className="flex-1">
                취소
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
