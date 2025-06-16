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
        href: "/personas",
        icon: Bot,
        color: "from-blue-500 to-cyan-500",
        stats: { total: 12, active: 8 },
        features: ["성격 설정", "전문분야 정의", "말투 조정", "제약조건 설정"],
      },
      {
        id: 12,
        title: "Prompt 템플릿",
        description: "역할/상황별 프롬프트 조각 모듈화 (기획 요청, 반론 유도 등)",
        href: "/prompt-templates",
        icon: MessageSquare,
        color: "from-purple-500 to-pink-500",
        stats: { total: 24, active: 18 },
        features: ["프롬프트 모듈화", "상황별 템플릿", "반론 유도", "기획 요청"],
      },
      {
        id: 13,
        title: "MCP 전략",
        description: "토론 및 의사결정 흐름 제어 규칙 (round-robin, voting 등)",
        href: "/mcp-strategy",
        icon: Zap,
        color: "from-orange-500 to-red-500",
        stats: { total: 8, active: 6 },
        features: ["토론 흐름 제어", "의사결정 규칙", "Round-robin", "Voting 시스템"],
      },
      {
        id: 14,
        title: "Output Format",
        description: "AI가 출력할 문서 포맷 정의 (예: 회의록, 요약문, 테이블)",
        href: "/output-formats",
        icon: FileText,
        color: "from-green-500 to-teal-500",
        stats: { total: 15, active: 12 },
        features: ["문서 포맷 정의", "회의록 템플릿", "요약문 구조", "테이블 형식"],
      },
    ],
  },
  // 👩‍💼 PM 도구 (운영/관리자용)
  {
    id: 2,
    category: "PM 도구 (운영/관리자용)",
    categoryIcon: Briefcase,
    categoryColor: "from-indigo-500 to-purple-500",
    items: [
      {
        id: 21,
        title: "Workflow 템플릿",
        description: "특정 산업/분야별 업무 전개 흐름 템플릿 (예: 정책기획, 시공 프로세스 등)",
        href: "/workflow-templates",
        icon: GitBranch,
        color: "from-indigo-500 to-blue-500",
        stats: { total: 18, active: 14 },
        features: ["산업별 템플릿", "업무 흐름 정의", "정책기획 프로세스", "시공 관리"],
      },
      {
        id: 22,
        title: "평가표 템플릿",
        description: "AI Task 결과물 평가 항목 세트 (정확성, 창의성, 실현가능성 등)",
        href: "/evaluation-templates",
        icon: ClipboardList,
        color: "from-yellow-500 to-orange-500",
        stats: { total: 12, active: 9 },
        features: ["평가 항목 설정", "정확성 측정", "창의성 평가", "실현가능성 검토"],
      },
      {
        id: 23,
        title: "프로젝트 템플릿",
        description: "과거 성공 프로젝트의 세팅 값(PM/페르소나/MCP) 저장·재사용",
        href: "/project-templates",
        icon: FolderTemplate,
        color: "from-pink-500 to-rose-500",
        stats: { total: 25, active: 20 },
        features: ["성공 프로젝트 저장", "세팅 값 재사용", "PM 설정", "페르소나 조합"],
      },
      {
        id: 24,
        title: "산출물 템플릿",
        description: "보고서/계획서 등의 정형 문서 구조 (Markdown / Table 등)",
        href: "/deliverable-templates",
        icon: FileOutput,
        color: "from-emerald-500 to-green-500",
        stats: { total: 32, active: 28 },
        features: ["문서 구조 정의", "보고서 템플릿", "계획서 양식", "Markdown 구조"],
      },
      {
        id: 25,
        title: "회의 유형 / 포맷",
        description: "주제 발제형, 브레인스토밍형, 정리형 등 회의 운영 방식 정의",
        href: "/meeting-formats",
        icon: Users,
        color: "from-cyan-500 to-blue-500",
        stats: { total: 10, active: 8 },
        features: ["회의 유형 정의", "브레인스토밍", "주제 발제", "정리형 회의"],
      },
    ],
  },
]

// 색상 옵션들
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

// 아이콘 옵션들
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
    selectedIcon: 0,
    selectedColor: 0,
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

      const newResource = {
        id: newId,
        title: newResourceType.title,
        description: newResourceType.description,
        href: `/${newResourceType.title.toLowerCase().replace(/\s+/g, "-")}`,
        icon: iconOptions[newResourceType.selectedIcon].icon,
        color: colorOptions[newResourceType.selectedColor],
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
        selectedIcon: 0,
        selectedColor: 0,
      })

      setIsDialogOpen(false)
    }
  }

  const cancelCreate = () => {
    setNewResourceType({
      title: "",
      description: "",
      features: [""],
      selectedIcon: 0,
      selectedColor: 0,
    })
    setIsDialogOpen(false)
  }

  return (
    <div className="p-6 space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Resource Management</h1>
          <p className="text-gray-600 mt-2">AI 에이전트와 PM 도구를 체계적으로 관리하는 리소스 센터입니다</p>
        </div>
        <div className="flex space-x-3">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Settings className="h-4 w-4 mr-2" />
                리소스 설정
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 리소스 타입 추가</DialogTitle>
              </DialogHeader>

              <div className="space-y-6 py-4">
                <div>
                  <Label>카테고리 선택</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {categories.map((category, index) => (
                      <Button
                        key={category.id}
                        variant={selectedCategory === index ? "default" : "outline"}
                        onClick={() => setSelectedCategory(index)}
                        className="justify-start h-auto p-3"
                      >
                        <category.categoryIcon className="h-4 w-4 mr-2" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{category.category}</div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label htmlFor="resourceTitle">Resource Type 이름</Label>
                  <Input
                    id="resourceTitle"
                    value={newResourceType.title}
                    onChange={(e) => setNewResourceType({ ...newResourceType, title: e.target.value })}
                    placeholder="예: Knowledge Base"
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
                  />
                </div>

                <div>
                  <Label>아이콘 선택</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {iconOptions.map((iconOption, index) => (
                      <Button
                        key={index}
                        variant={newResourceType.selectedIcon === index ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewResourceType({ ...newResourceType, selectedIcon: index })}
                        className="h-12 w-12 p-0"
                      >
                        <iconOption.icon className="h-5 w-5" />
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>색상 선택</Label>
                  <div className="grid grid-cols-5 gap-2 mt-2">
                    {colorOptions.map((color, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => setNewResourceType({ ...newResourceType, selectedColor: index })}
                        className={`h-12 w-12 p-0 bg-gradient-to-r ${color} ${
                          newResourceType.selectedColor === index ? "ring-2 ring-blue-500" : ""
                        }`}
                      >
                        {newResourceType.selectedColor === index && <div className="h-4 w-4 bg-white rounded-full" />}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>주요 기능</Label>
                  {newResourceType.features.map((feature, index) => (
                    <div key={index} className="flex gap-2 mt-2">
                      <Input
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        placeholder={`주요 기능 ${index + 1}`}
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
                    기능 추가
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
          </div>

          {/* 카테고리 아이템들 */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {category.items.map((item) => (
              <Card key={item.id} className="hover:shadow-lg transition-all duration-300 group">
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
                <CardContent className="space-y-3 pt-0">
                  <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-700">주요 기능:</p>
                    <ul className="space-y-0.5">
                      {item.features.slice(0, 3).map((feature, index) => (
                        <li key={index} className="text-xs text-gray-600 flex items-center">
                          <div className="h-1 w-1 bg-gray-400 rounded-full mr-2" />
                          {feature}
                        </li>
                      ))}
                      {item.features.length > 3 && (
                        <li className="text-xs text-gray-500">+{item.features.length - 3}개 더</li>
                      )}
                    </ul>
                  </div>

                  <Link href={item.href}>
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
    </div>
  )
}
