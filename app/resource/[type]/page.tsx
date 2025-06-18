"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  Download,
  Upload,
  Copy,
  Clock,
  Users,
  Activity,
  TrendingUp,
  X,
} from "lucide-react"

// 리소스 타입 정의 (실제로는 API에서 가져와야 함)
const getResourceTypeConfig = (type: string) => {
  const configs = {
    personas: {
      title: "Persona",
      description: "AI 에이전트의 성격과 역할을 정의합니다",
      icon: Users,
      color: "from-blue-500 to-cyan-500",
      fields: [
        { key: "name", label: "이름", type: "text", required: true },
        { key: "role", label: "역할", type: "text", required: true },
        { key: "expertise", label: "전문분야", type: "tags" },
        { key: "personality", label: "성격", type: "textarea" },
        { key: "constraints", label: "제약조건", type: "tags" },
        { key: "tone", label: "말투", type: "select", options: ["친근한", "전문적인", "격식있는", "캐주얼한"] },
      ],
    },
    "prompt-templates": {
      title: "Prompt 템플릿",
      description: "재사용 가능한 프롬프트 템플릿을 관리합니다",
      icon: Users,
      color: "from-purple-500 to-pink-500",
      fields: [
        { key: "name", label: "템플릿 이름", type: "text", required: true },
        { key: "category", label: "카테고리", type: "select", options: ["브레인스토밍", "분석", "결론도출", "반박"] },
        { key: "prompt", label: "프롬프트 내용", type: "textarea", required: true },
        { key: "variables", label: "변수", type: "tags" },
        { key: "usage", label: "사용 용도", type: "textarea" },
      ],
    },
    // 기본 템플릿 (새로 추가된 리소스 타입용)
    default: {
      title: "리소스 관리",
      description: "리소스를 체계적으로 관리합니다",
      icon: Users,
      color: "from-gray-500 to-gray-600",
      fields: [
        { key: "name", label: "이름", type: "text", required: true },
        { key: "description", label: "설명", type: "textarea" },
        { key: "tags", label: "태그", type: "tags" },
        { key: "status", label: "상태", type: "select", options: ["활성", "비활성", "검토중"] },
      ],
    },
  }

  return configs[type] || configs.default
}

// 샘플 데이터 생성 함수
const generateSampleData = (config: any, count = 8) => {
  const sampleData = []
  for (let i = 1; i <= count; i++) {
    const item: any = {
      id: i,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      status: ["활성", "비활성", "검토중"][Math.floor(Math.random() * 3)],
      usage: Math.floor(Math.random() * 100),
    }

    config.fields.forEach((field: any) => {
      switch (field.type) {
        case "text":
          item[field.key] = `${field.label} ${i}`
          break
        case "textarea":
          item[field.key] = `${field.label}에 대한 상세한 설명입니다. 항목 ${i}의 내용을 포함합니다.`
          break
        case "tags":
          item[field.key] = [`태그${i}`, `카테고리${(i % 3) + 1}`, `유형${(i % 2) + 1}`]
          break
        case "select":
          item[field.key] = field.options[i % field.options.length]
          break
      }
    })

    sampleData.push(item)
  }
  return sampleData
}

export default function DynamicResourcePage() {
  const params = useParams()
  const resourceType = params.type as string
  const config = getResourceTypeConfig(resourceType)

  const [items, setItems] = useState(() => generateSampleData(config))
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<any>(null)
  const [newItem, setNewItem] = useState<any>({})

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || item.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const stats = {
    total: items.length,
    active: items.filter((item) => item.status === "활성").length,
    inactive: items.filter((item) => item.status === "비활성").length,
    avgUsage: Math.round(items.reduce((sum, item) => sum + item.usage, 0) / items.length),
  }

  const handleCreate = () => {
    const id = Math.max(...items.map((item) => item.id)) + 1
    const item = {
      ...newItem,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: "활성",
      usage: 0,
    }
    setItems([...items, item])
    setNewItem({})
    setIsCreateDialogOpen(false)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
  }

  const handleUpdate = () => {
    setItems(
      items.map((item) =>
        item.id === editingItem.id ? { ...editingItem, updatedAt: new Date().toISOString() } : item,
      ),
    )
    setEditingItem(null)
  }

  const handleDelete = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const handleDuplicate = (item: any) => {
    const newId = Math.max(...items.map((i) => i.id)) + 1
    const duplicated = {
      ...item,
      id: newId,
      name: `${item.name} (복사본)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      usage: 0,
    }
    setItems([...items, duplicated])
  }

  const renderField = (field: any, value: any, onChange: (value: any) => void) => {
    switch (field.type) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            required={field.required}
          />
        )
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.label}
            rows={3}
            required={field.required}
          />
        )
      case "tags":
        return (
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {(value || []).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    onClick={() => {
                      const newTags = [...(value || [])]
                      newTags.splice(index, 1)
                      onChange(newTags)
                    }}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <Input
              placeholder={`${field.label} 추가 (Enter로 추가)`}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  const input = e.target as HTMLInputElement
                  if (input.value.trim()) {
                    onChange([...(value || []), input.value.trim()])
                    input.value = ""
                  }
                }
              }}
            />
          </div>
        )
      case "select":
        return (
          <select
            value={value || ""}
            onChange={(e) => onChange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
            required={field.required}
          >
            <option value="">{field.label} 선택</option>
            {field.options.map((option: string) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
      default:
        return null
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{config.title} 관리</h1>
          <p className="text-gray-600 mt-2">{config.description}</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            내보내기
          </Button>
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            가져오기
          </Button>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />새 {config.title} 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 {config.title} 추가</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {config.fields.map((field: any) => (
                  <div key={field.key}>
                    <Label>
                      {field.label} {field.required && <span className="text-red-500">*</span>}
                    </Label>
                    <div className="mt-1">
                      {renderField(field, newItem[field.key], (value) =>
                        setNewItem({ ...newItem, [field.key]: value }),
                      )}
                    </div>
                  </div>
                ))}
                <div className="flex gap-2 pt-4">
                  <Button onClick={handleCreate} className="flex-1">
                    생성
                  </Button>
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="flex-1">
                    취소
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">전체</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">활성</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">비활성</p>
                <p className="text-2xl font-bold text-gray-600">{stats.inactive}</p>
              </div>
              <Clock className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">평균 사용률</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgUsage}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={`${config.title} 검색...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="all">모든 상태</option>
            <option value="활성">활성</option>
            <option value="비활성">비활성</option>
            <option value="검토중">검토중</option>
          </select>
        </div>
      </div>

      {/* 아이템 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg">{item.name}</CardTitle>
                  <CardDescription className="mt-1 text-sm">{item.description?.substring(0, 100)}...</CardDescription>
                </div>
                <Badge variant={item.status === "활성" ? "default" : "secondary"}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {/* 태그 표시 */}
                {item.tags && (
                  <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* 사용률 */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>사용률</span>
                  <span className="font-medium">{item.usage}%</span>
                </div>

                {/* 액션 버튼 */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(item)}>
                    <Edit className="h-3 w-3 mr-1" />
                    편집
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDuplicate(item)}>
                    <Copy className="h-3 w-3 mr-1" />
                    복제
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleDelete(item.id)}>
                    <Trash2 className="h-3 w-3 mr-1" />
                    삭제
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 편집 다이얼로그 */}
      <Dialog open={!!editingItem} onOpenChange={() => setEditingItem(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{config.title} 편집</DialogTitle>
          </DialogHeader>
          {editingItem && (
            <div className="space-y-4 py-4">
              {config.fields.map((field: any) => (
                <div key={field.key}>
                  <Label>
                    {field.label} {field.required && <span className="text-red-500">*</span>}
                  </Label>
                  <div className="mt-1">
                    {renderField(field, editingItem[field.key], (value) =>
                      setEditingItem({ ...editingItem, [field.key]: value }),
                    )}
                  </div>
                </div>
              ))}
              <div className="flex gap-2 pt-4">
                <Button onClick={handleUpdate} className="flex-1">
                  저장
                </Button>
                <Button variant="outline" onClick={() => setEditingItem(null)} className="flex-1">
                  취소
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
