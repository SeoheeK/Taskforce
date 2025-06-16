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
import { Switch } from "@/components/ui/switch"
import { Plus, Edit, Trash2, FileText, Code, ImageIcon, Database } from "lucide-react"

interface OutputFormat {
  id: number
  name: string
  description: string
  file_extension: string
  mime_type: string
  category: string
  template_structure: string
  validation_rules: string[]
  example_output: string
  supports_versioning: boolean
  is_binary: boolean
}

const categories = [
  { value: "document", label: "문서", icon: FileText },
  { value: "code", label: "코드", icon: Code },
  { value: "media", label: "미디어", icon: ImageIcon },
  { value: "data", label: "데이터", icon: Database },
]

export default function OutputFormatsPage() {
  const [outputFormats, setOutputFormats] = useState<OutputFormat[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFormat, setEditingFormat] = useState<OutputFormat | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    file_extension: "",
    mime_type: "",
    category: "document",
    template_structure: "",
    validation_rules: "",
    example_output: "",
    supports_versioning: false,
    is_binary: false,
  })

  useEffect(() => {
    fetchOutputFormats()
  }, [])

  const fetchOutputFormats = async () => {
    try {
      const response = await fetch("/api/output-formats")
      const data = await response.json()
      setOutputFormats(data)
    } catch (error) {
      console.error("산출물 형식 로딩 실패:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingFormat ? `/api/output-formats/${editingFormat.id}` : "/api/output-formats"
      const method = editingFormat ? "PUT" : "POST"

      const payload = {
        ...formData,
        validation_rules: formData.validation_rules
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
      setEditingFormat(null)
      resetForm()
      fetchOutputFormats()
    } catch (error) {
      console.error("산출물 형식 저장 실패:", error)
    }
  }

  const handleEdit = (outputFormat: OutputFormat) => {
    setEditingFormat(outputFormat)
    setFormData({
      name: outputFormat.name,
      description: outputFormat.description,
      file_extension: outputFormat.file_extension,
      mime_type: outputFormat.mime_type,
      category: outputFormat.category,
      template_structure: outputFormat.template_structure,
      validation_rules: outputFormat.validation_rules.join(", "),
      example_output: outputFormat.example_output,
      supports_versioning: outputFormat.supports_versioning,
      is_binary: outputFormat.is_binary,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 산출물 형식을 삭제하시겠습니까?")) {
      try {
        await fetch(`/api/output-formats/${id}`, { method: "DELETE" })
        fetchOutputFormats()
      } catch (error) {
        console.error("산출물 형식 삭제 실패:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      file_extension: "",
      mime_type: "",
      category: "document",
      template_structure: "",
      validation_rules: "",
      example_output: "",
      supports_versioning: false,
      is_binary: false,
    })
  }

  const getCategoryInfo = (category: string) => {
    const cat = categories.find((c) => c.value === category)
    return cat || { label: category, icon: FileText }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">산출물 형식 관리</h1>
          <p className="text-gray-600 mt-2">Agent들이 생성하는 산출물의 형태와 구조를 정의하고 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingFormat(null)
                resetForm()
              }}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <Plus className="h-4 w-4 mr-2" />새 산출물 형식
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFormat ? "산출물 형식 수정" : "새 산출물 형식 생성"}</DialogTitle>
              <DialogDescription>Agent가 생성할 산출물 형식의 상세 정보를 입력해주세요</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">형식 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: Markdown Document"
                    required
                  />
                </div>
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
              </div>

              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="이 산출물 형식에 대한 상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="file_extension">파일 확장자</Label>
                  <Input
                    id="file_extension"
                    value={formData.file_extension}
                    onChange={(e) => setFormData({ ...formData, file_extension: e.target.value })}
                    placeholder="예: .md"
                  />
                </div>
                <div>
                  <Label htmlFor="mime_type">MIME 타입</Label>
                  <Input
                    id="mime_type"
                    value={formData.mime_type}
                    onChange={(e) => setFormData({ ...formData, mime_type: e.target.value })}
                    placeholder="예: text/markdown"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="template_structure">템플릿 구조</Label>
                <Textarea
                  id="template_structure"
                  value={formData.template_structure}
                  onChange={(e) => setFormData({ ...formData, template_structure: e.target.value })}
                  placeholder="이 형식의 기본 템플릿 구조를 정의하세요"
                  rows={5}
                />
              </div>

              <div>
                <Label htmlFor="validation_rules">검증 규칙 (쉼표로 구분)</Label>
                <Input
                  id="validation_rules"
                  value={formData.validation_rules}
                  onChange={(e) => setFormData({ ...formData, validation_rules: e.target.value })}
                  placeholder="예: 제목 필수, 최소 100자, 마크다운 문법 준수"
                />
              </div>

              <div>
                <Label htmlFor="example_output">예시 출력</Label>
                <Textarea
                  id="example_output"
                  value={formData.example_output}
                  onChange={(e) => setFormData({ ...formData, example_output: e.target.value })}
                  placeholder="이 형식의 예시 출력을 작성해주세요"
                  rows={6}
                />
              </div>

              <div className="flex space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="supports_versioning"
                    checked={formData.supports_versioning}
                    onCheckedChange={(checked) => setFormData({ ...formData, supports_versioning: checked })}
                  />
                  <Label htmlFor="supports_versioning">버전 관리 지원</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_binary"
                    checked={formData.is_binary}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_binary: checked })}
                  />
                  <Label htmlFor="is_binary">바이너리 형식</Label>
                </div>
              </div>

              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingFormat ? "수정" : "생성"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* 산출물 형식 목록 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outputFormats.map((outputFormat) => {
          const categoryInfo = getCategoryInfo(outputFormat.category)
          const CategoryIcon = categoryInfo.icon

          return (
            <Card key={outputFormat.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-indigo-100 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{outputFormat.name}</CardTitle>
                      <CardDescription>{categoryInfo.label}</CardDescription>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    {outputFormat.supports_versioning && (
                      <Badge variant="secondary" className="text-xs">
                        버전관리
                      </Badge>
                    )}
                    {outputFormat.is_binary && (
                      <Badge variant="outline" className="text-xs">
                        바이너리
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{outputFormat.description}</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {outputFormat.file_extension}
                    </Badge>
                    <span className="text-xs text-gray-500">{outputFormat.mime_type}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">검증 규칙:</p>
                  <div className="flex flex-wrap gap-1">
                    {outputFormat.validation_rules.slice(0, 2).map((rule, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {rule}
                      </Badge>
                    ))}
                    {outputFormat.validation_rules.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{outputFormat.validation_rules.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(outputFormat)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(outputFormat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
