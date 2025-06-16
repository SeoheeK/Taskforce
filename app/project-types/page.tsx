"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Clock, Users, Target, Star } from "lucide-react"

interface ProjectType {
  id: number
  name: string
  description: string
  icon: string
  category: string
  difficulty_level: string
  estimated_duration: string
  suggested_experts: string[]
  required_skills: string[]
  typical_deliverables: string[]
  is_default: boolean
}

const categories = [
  { value: "development", label: "개발" },
  { value: "marketing", label: "마케팅" },
  { value: "strategy", label: "전략" },
  { value: "product", label: "제품" },
  { value: "analytics", label: "분석" },
  { value: "design", label: "디자인" },
  { value: "operations", label: "운영" },
  { value: "other", label: "기타" },
]

const difficultyLevels = [
  { value: "low", label: "쉬움", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "보통", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "어려움", color: "bg-red-100 text-red-800" },
]

const iconOptions = ["📱", "📢", "📊", "🚀", "📈", "🎨", "⚙️", "💡", "🔧", "📋", "🎯", "💼"]

export default function ProjectTypesPage() {
  const [projectTypes, setProjectTypes] = useState<ProjectType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<ProjectType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon: "📋",
    category: "other",
    difficulty_level: "medium",
    estimated_duration: "",
    suggested_experts: "",
    required_skills: "",
    typical_deliverables: "",
  })

  useEffect(() => {
    fetchProjectTypes()
  }, [])

  const fetchProjectTypes = async () => {
    try {
      const response = await fetch("/api/project-types")
      const data = await response.json()
      setProjectTypes(data)
    } catch (error) {
      console.error("프로젝트 유형 로딩 실패:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingType ? `/api/project-types/${editingType.id}` : "/api/project-types"
      const method = editingType ? "PUT" : "POST"

      const payload = {
        ...formData,
        suggested_experts: formData.suggested_experts
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        required_skills: formData.required_skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        typical_deliverables: formData.typical_deliverables
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
      }

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      setIsDialogOpen(false)
      setEditingType(null)
      resetForm()
      fetchProjectTypes()
    } catch (error) {
      console.error("프로젝트 유형 저장 실패:", error)
    }
  }

  const handleEdit = (projectType: ProjectType) => {
    setEditingType(projectType)
    setFormData({
      name: projectType.name,
      description: projectType.description,
      icon: projectType.icon,
      category: projectType.category,
      difficulty_level: projectType.difficulty_level,
      estimated_duration: projectType.estimated_duration,
      suggested_experts: projectType.suggested_experts.join(", "),
      required_skills: projectType.required_skills.join(", "),
      typical_deliverables: projectType.typical_deliverables.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 프로젝트 유형을 삭제하시겠습니까?")) {
      try {
        await fetch(`/api/project-types/${id}`, { method: "DELETE" })
        fetchProjectTypes()
      } catch (error) {
        console.error("프로젝트 유형 삭제 실패:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon: "📋",
      category: "other",
      difficulty_level: "medium",
      estimated_duration: "",
      suggested_experts: "",
      required_skills: "",
      typical_deliverables: "",
    })
  }

  const getDifficultyColor = (level: string) => {
    const difficulty = difficultyLevels.find((d) => d.value === level)
    return difficulty?.color || "bg-gray-100 text-gray-800"
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat?.label || category
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">프로젝트 유형 관리</h1>
          <p className="text-gray-600 mt-2">다양한 프로젝트 유형을 정의하고 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingType(null)
                resetForm()
              }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />새 프로젝트 유형
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingType ? "프로젝트 유형 수정" : "새 프로젝트 유형 생성"}</DialogTitle>
              <DialogDescription>프로젝트 유형의 상세 정보를 입력해주세요</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">프로젝트 유형 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 모바일 앱 개발"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="icon">아이콘</Label>
                  <Select value={formData.icon} onValueChange={(value) => setFormData({ ...formData, icon: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {iconOptions.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon} {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="이 프로젝트 유형에 대한 상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="difficulty">난이도</Label>
                  <Select
                    value={formData.difficulty_level}
                    onValueChange={(value) => setFormData({ ...formData, difficulty_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficultyLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">예상 기간</Label>
                  <Input
                    id="duration"
                    value={formData.estimated_duration}
                    onChange={(e) => setFormData({ ...formData, estimated_duration: e.target.value })}
                    placeholder="예: 2-3개월"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="experts">추천 전문가 (쉼표로 구분)</Label>
                <Input
                  id="experts"
                  value={formData.suggested_experts}
                  onChange={(e) => setFormData({ ...formData, suggested_experts: e.target.value })}
                  placeholder="예: Technical Lead, UX Designer, Product Manager"
                />
              </div>

              <div>
                <Label htmlFor="skills">필요한 스킬 (쉼표로 구분)</Label>
                <Input
                  id="skills"
                  value={formData.required_skills}
                  onChange={(e) => setFormData({ ...formData, required_skills: e.target.value })}
                  placeholder="예: React Native, UI/UX 디자인, 프로젝트 관리"
                />
              </div>

              <div>
                <Label htmlFor="deliverables">일반적인 결과물 (쉼표로 구분)</Label>
                <Input
                  id="deliverables"
                  value={formData.typical_deliverables}
                  onChange={(e) => setFormData({ ...formData, typical_deliverables: e.target.value })}
                  placeholder="예: 앱 프로토타입, 기술 문서, UI/UX 가이드"
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingType ? "수정" : "생성"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 프로젝트 유형 목록 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projectTypes.map((projectType) => (
          <Card key={projectType.id} className="hover:shadow-lg transition-shadow relative">
            {projectType.is_default && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" />
                  기본
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="text-3xl">{projectType.icon}</div>
                <div className="flex-1">
                  <CardTitle className="text-lg">{projectType.name}</CardTitle>
                  <CardDescription>{getCategoryLabel(projectType.category)}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{projectType.description}</p>

              <div className="flex items-center justify-between">
                <Badge className={getDifficultyColor(projectType.difficulty_level)}>
                  {difficultyLevels.find((d) => d.value === projectType.difficulty_level)?.label}
                </Badge>
                <div className="flex items-center text-sm text-gray-500">
                  <Clock className="h-4 w-4 mr-1" />
                  {projectType.estimated_duration}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Users className="h-4 w-4 mr-2" />
                  <span className="font-medium">추천 전문가:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {projectType.suggested_experts.slice(0, 3).map((expert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {expert}
                    </Badge>
                  ))}
                  {projectType.suggested_experts.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{projectType.suggested_experts.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Target className="h-4 w-4 mr-2" />
                  <span className="font-medium">주요 결과물:</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {projectType.typical_deliverables.slice(0, 2).map((deliverable, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {deliverable}
                    </Badge>
                  ))}
                  {projectType.typical_deliverables.length > 2 && (
                    <Badge variant="secondary" className="text-xs">
                      +{projectType.typical_deliverables.length - 2}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(projectType)}>
                  <Edit className="h-4 w-4" />
                </Button>
                {!projectType.is_default && (
                  <Button size="sm" variant="outline" onClick={() => handleDelete(projectType.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
