"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { MessageSquare, Plus, Edit, Trash2, Search } from "lucide-react"

const initialTemplates = [
  {
    id: 1,
    title: "브레인스토밍 시작",
    description: "창의적 아이디어 발굴을 위한 초기 프롬프트",
    content: "이제 창의적인 브레인스토밍을 시작해보겠습니다. 주제에 대해 자유롭게 아이디어를 제시해주세요.",
    category: "회의진행",
    tags: ["브레인스토밍", "창의성", "아이디어"],
    usage: 45,
  },
  {
    id: 2,
    title: "아이디어 평가",
    description: "제시된 아이디어들을 체계적으로 평가하는 프롬프트",
    content: "제시된 아이디어들을 실현가능성, 창의성, 효과성 측면에서 평가해주세요.",
    category: "분석",
    tags: ["평가", "분석", "의사결정"],
    usage: 32,
  },
  {
    id: 3,
    title: "결론 도출",
    description: "토론 내용을 정리하고 결론을 도출하는 프롬프트",
    content: "지금까지의 논의를 종합하여 핵심 결론과 다음 단계를 정리해주세요.",
    category: "정리",
    tags: ["결론", "요약", "다음단계"],
    usage: 28,
  },
]

export default function PromptTemplatesPage() {
  const [templates, setTemplates] = useState(initialTemplates)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState(null)
  const [newTemplate, setNewTemplate] = useState({
    title: "",
    description: "",
    content: "",
    category: "",
    tags: "",
  })

  const filteredTemplates = templates.filter(
    (template) =>
      template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSave = () => {
    if (editingTemplate) {
      setTemplates(
        templates.map((t) =>
          t.id === editingTemplate.id
            ? { ...editingTemplate, ...newTemplate, tags: newTemplate.tags.split(",").map((tag) => tag.trim()) }
            : t,
        ),
      )
    } else {
      const newId = Math.max(...templates.map((t) => t.id)) + 1
      setTemplates([
        ...templates,
        {
          id: newId,
          ...newTemplate,
          tags: newTemplate.tags.split(",").map((tag) => tag.trim()),
          usage: 0,
        },
      ])
    }

    setNewTemplate({ title: "", description: "", content: "", category: "", tags: "" })
    setEditingTemplate(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setNewTemplate({
      title: template.title,
      description: template.description,
      content: template.content,
      category: template.category,
      tags: template.tags.join(", "),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="h-8 w-8 mr-3 text-purple-600" />
            Prompt 템플릿 관리
          </h1>
          <p className="text-gray-600 mt-2">역할/상황별 프롬프트 조각을 모듈화하여 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingTemplate(null)
                setNewTemplate({ title: "", description: "", content: "", category: "", tags: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />새 템플릿 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingTemplate ? "템플릿 수정" : "새 템플릿 추가"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">제목</Label>
                <Input
                  id="title"
                  value={newTemplate.title}
                  onChange={(e) => setNewTemplate({ ...newTemplate, title: e.target.value })}
                  placeholder="템플릿 제목을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="템플릿 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="content">프롬프트 내용</Label>
                <Textarea
                  id="content"
                  value={newTemplate.content}
                  onChange={(e) => setNewTemplate({ ...newTemplate, content: e.target.value })}
                  placeholder="프롬프트 내용을 입력하세요"
                  rows={4}
                />
              </div>
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Input
                  id="category"
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  placeholder="카테고리를 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="tags">태그 (쉼표로 구분)</Label>
                <Input
                  id="tags"
                  value={newTemplate.tags}
                  onChange={(e) => setNewTemplate({ ...newTemplate, tags: e.target.value })}
                  placeholder="태그1, 태그2, 태그3"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingTemplate ? "수정" : "추가"}
                </Button>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="템플릿 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">{templates.length}</div>
            <div className="text-sm text-gray-600">총 템플릿</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{templates.reduce((sum, t) => sum + t.usage, 0)}</div>
            <div className="text-sm text-gray-600">총 사용횟수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(templates.map((t) => t.category))].length}
            </div>
            <div className="text-sm text-gray-600">카테고리 수</div>
          </CardContent>
        </Card>
      </div>

      {/* 템플릿 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{template.title}</CardTitle>
                  <CardDescription className="mt-1">{template.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(template)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(template.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{template.content}</div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{template.category}</Badge>
                  <span className="text-xs text-gray-500">사용 {template.usage}회</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
