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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Plus, Edit, Trash2 } from "lucide-react"

interface Persona {
  id: number
  name: string
  role: string
  description: string
  system_prompt: string
  avatar_url: string
}

export default function PersonasPage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPersona, setEditingPersona] = useState<Persona | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    description: "",
    system_prompt: "",
    avatar_url: "/placeholder.svg?height=40&width=40",
  })

  useEffect(() => {
    fetchPersonas()
  }, [])

  const fetchPersonas = async () => {
    try {
      const response = await fetch("/api/personas")
      const data = await response.json()
      setPersonas(data)
    } catch (error) {
      console.error("페르소나 로딩 실패:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editingPersona ? `/api/personas/${editingPersona.id}` : "/api/personas"
      const method = editingPersona ? "PUT" : "POST"

      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      setIsDialogOpen(false)
      setEditingPersona(null)
      setFormData({
        name: "",
        role: "",
        description: "",
        system_prompt: "",
        avatar_url: "/placeholder.svg?height=40&width=40",
      })
      fetchPersonas()
    } catch (error) {
      console.error("페르소나 저장 실패:", error)
    }
  }

  const handleEdit = (persona: Persona) => {
    setEditingPersona(persona)
    setFormData({
      name: persona.name,
      role: persona.role,
      description: persona.description,
      system_prompt: persona.system_prompt,
      avatar_url: persona.avatar_url,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (confirm("정말로 이 페르소나를 삭제하시겠습니까?")) {
      try {
        await fetch(`/api/personas/${id}`, { method: "DELETE" })
        fetchPersonas()
      } catch (error) {
        console.error("페르소나 삭제 실패:", error)
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">페르소나 관리</h1>
          <p className="text-gray-600 mt-2">AI 에이전트들의 역할과 특성을 정의하고 관리합니다</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setEditingPersona(null)}>
              <Plus className="h-4 w-4 mr-2" />새 페르소나
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPersona ? "페르소나 수정" : "새 페르소나 생성"}</DialogTitle>
              <DialogDescription>AI 에이전트의 역할과 특성을 정의해주세요</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="예: 전략가 알렉스"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="role">역할</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    placeholder="예: Strategic Planner"
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="이 페르소나의 전문 분야와 특징을 설명해주세요"
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="system_prompt">시스템 프롬프트</Label>
                <Textarea
                  id="system_prompt"
                  value={formData.system_prompt}
                  onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
                  placeholder="AI가 이 페르소나로 행동할 때 따라야 할 지침을 작성해주세요"
                  rows={5}
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  취소
                </Button>
                <Button type="submit">{editingPersona ? "수정" : "생성"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {personas.map((persona) => (
          <Card key={persona.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src={persona.avatar_url || "/placeholder.svg"} alt={persona.name} />
                  <AvatarFallback>{persona.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{persona.name}</CardTitle>
                  <CardDescription>{persona.role}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-4">{persona.description}</p>
              <div className="flex justify-end space-x-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(persona)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleDelete(persona.id)}>
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
