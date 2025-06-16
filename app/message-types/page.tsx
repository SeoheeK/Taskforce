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
import { Plus, Edit, Trash2, MessageSquare, Clock, AlertCircle } from "lucide-react"

interface MessageType {
  id: number
  name: string
  description: string
  category: string
  requires_response: boolean
  priority_level: string
  use_cases: string[]
  example_content: string
  response_timeout: number
  is_system_message: boolean
}

const categories = [
  { value: "communication", label: "일반 소통" },
  { value: "task", label: "작업 관련" },
  { value: "decision", label: "의사결정" },
  { value: "feedback", label: "피드백" },
  { value: "system", label: "시스템" },
]

const priorityLevels = [
  { value: "low", label: "낮음", color: "bg-green-100 text-green-800" },
  { value: "medium", label: "보통", color: "bg-yellow-100 text-yellow-800" },
  { value: "high", label: "높음", color: "bg-orange-100 text-orange-800" },
  { value: "urgent", label: "긴급", color: "bg-red-100 text-red-800" },
]

export default function MessageTypesPage() {
  const [messageTypes, setMessageTypes] = useState<MessageType[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingType, setEditingType] = useState<MessageType | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "communication",
    requires_response: false,
    priority_level: "medium",
    use_cases: "",
    example_content: "",
    response_timeout: 24,
    is_system_message: false,
  })

  useEffect(() => {
    fetchMessageTypes()
  }, [])

  const fetchMessageTypes = async () => {
    try {
      const response = await fetch("/api/message-types")
      const data = await response.json()
      setMessageTypes(data)
    } catch (error) {
      console.error("메시지 유형 로딩 실패:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingType ? `/api/message-types/${editingType.id}` : "/api/message-types"
      const method = editingType ? "PUT" : "POST"

      const payload = {
        ...formData,
        use_cases: formData.use_cases
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
      fetchMessageTypes()
    } catch (error) {
      console.error("메시지 유형 저장 실패:", error)
    }
  }

  const handleEdit = (messageType: MessageType) => {
    setEditingType(messageType)
    setFormData({
      name: messageType.name,
      description: messageType.description,
      category: messageType.category,
      requires_response: messageType.requires_response,
      priority_level: messageType.priority_level,
      use_cases: messageType.use_cases.join(", "),
      example_content: messageType.example_content,
      response_timeout: messageType.response_timeout,
      is_system_message: messageType.is_system_message,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 메시지 유형을 삭제하시겠습니까?")) {
      try {
        await fetch(`/api/message-types/${id}`, { method: "DELETE" })
        fetchMessageTypes()
      } catch (error) {
        console.error("메시지 유형 삭제 실패:", error)
      }
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: "communication",
      requires_response: false,
      priority_level: "medium",
      use_cases: "",
      example_content: "",
      response_timeout: 24,
      is_system_message: false,
    })
  }

  const getPriorityColor = (level: string) => {
    const priority = priorityLevels.find((p) => p.value === level)
    return priority?.color || "bg-gray-100 text-gray-800"
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
          <h1 className="text-3xl font-bold text-gray-900">메시지 유형 관리</h1>
          <p className="text-gray-600 mt-2">Agent 간 통신에서 사용되는 메시지 유형을 정의하고 관리하세요</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingType(null)
                resetForm()
              }}
              className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />새 메시지 유형
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingType ? "메시지 유형 수정" : "새 메시지 유형 생성"}</DialogTitle>
              <DialogDescription>Agent 간 통신에 사용될 메시지 유형의 상세 정보를 입력해주세요</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">메시지 유형 이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: Proposal"
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
                  placeholder="이 메시지 유형에 대한 상세한 설명을 입력하세요"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="priority">우선순위</Label>
                  <Select
                    value={formData.priority_level}
                    onValueChange={(value) => setFormData({ ...formData, priority_level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeout">응답 제한시간 (시간)</Label>
                  <Input
                    id="timeout"
                    type="number"
                    value={formData.response_timeout}
                    onChange={(e) => setFormData({ ...formData, response_timeout: Number(e.target.value) })}
                    min="1"
                    max="168"
                  />
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="requires_response"
                      checked={formData.requires_response}
                      onCheckedChange={(checked) => setFormData({ ...formData, requires_response: checked })}
                    />
                    <Label htmlFor="requires_response">응답 필요</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_system_message"
                      checked={formData.is_system_message}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_system_message: checked })}
                    />
                    <Label htmlFor="is_system_message">시스템 메시지</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="use_cases">사용 사례 (쉼표로 구분)</Label>
                <Input
                  id="use_cases"
                  value={formData.use_cases}
                  onChange={(e) => setFormData({ ...formData, use_cases: e.target.value })}
                  placeholder="예: 새로운 아이디어 제안, 기능 개선 제안, 전략 제안"
                />
              </div>

              <div>
                <Label htmlFor="example_content">예시 내용</Label>
                <Textarea
                  id="example_content"
                  value={formData.example_content}
                  onChange={(e) => setFormData({ ...formData, example_content: e.target.value })}
                  placeholder="이 메시지 유형의 예시 내용을 작성해주세요"
                  rows={4}
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

      {/* 메시지 유형 목록 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {messageTypes.map((messageType) => (
          <Card key={messageType.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <MessageSquare className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{messageType.name}</CardTitle>
                    <CardDescription>{getCategoryLabel(messageType.category)}</CardDescription>
                  </div>
                </div>
                {messageType.is_system_message && (
                  <Badge variant="secondary" className="text-xs">
                    시스템
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{messageType.description}</p>

              <div className="flex items-center justify-between">
                <Badge className={getPriorityColor(messageType.priority_level)}>
                  {priorityLevels.find((p) => p.value === messageType.priority_level)?.label}
                </Badge>
                <div className="flex items-center space-x-2">
                  {messageType.requires_response && (
                    <div className="flex items-center text-sm text-orange-600">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      응답 필요
                    </div>
                  )}
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {messageType.response_timeout}h
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">사용 사례:</p>
                <div className="flex flex-wrap gap-1">
                  {messageType.use_cases.slice(0, 3).map((useCase, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {useCase}
                    </Badge>
                  ))}
                  {messageType.use_cases.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{messageType.use_cases.length - 3}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(messageType)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(messageType.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
