"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Zap, Plus, Edit, Trash2, Search, Settings } from "lucide-react"

const initialStrategies = [
  {
    id: 1,
    title: "Round Robin",
    description: "참여자들이 순서대로 의견을 제시하는 방식",
    rules:
      "각 참여자는 정해진 순서에 따라 2분간 의견을 제시합니다. 모든 참여자가 한 번씩 발언한 후 자유 토론을 진행합니다.",
    category: "토론진행",
    participants: "3-8명",
    duration: "15-30분",
    usage: 23,
  },
  {
    id: 2,
    title: "Majority Vote",
    description: "다수결로 의사결정을 하는 방식",
    rules: "모든 옵션을 제시한 후 투표를 진행합니다. 과반수 이상의 득표를 얻은 옵션이 선택됩니다.",
    category: "의사결정",
    participants: "5명 이상",
    duration: "10-20분",
    usage: 18,
  },
  {
    id: 3,
    title: "Consensus Building",
    description: "합의를 통해 결론을 도출하는 방식",
    rules: "모든 참여자가 동의할 수 있는 결론을 찾을 때까지 토론을 계속합니다. 반대 의견이 있으면 수정안을 제시합니다.",
    category: "합의도출",
    participants: "3-6명",
    duration: "20-45분",
    usage: 15,
  },
]

export default function MCPStrategyPage() {
  const [strategies, setStrategies] = useState(initialStrategies)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStrategy, setEditingStrategy] = useState(null)
  const [newStrategy, setNewStrategy] = useState({
    title: "",
    description: "",
    rules: "",
    category: "",
    participants: "",
    duration: "",
  })

  const filteredStrategies = strategies.filter(
    (strategy) =>
      strategy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      strategy.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = () => {
    if (editingStrategy) {
      setStrategies(strategies.map((s) => (s.id === editingStrategy.id ? { ...editingStrategy, ...newStrategy } : s)))
    } else {
      const newId = Math.max(...strategies.map((s) => s.id)) + 1
      setStrategies([
        ...strategies,
        {
          id: newId,
          ...newStrategy,
          usage: 0,
        },
      ])
    }

    setNewStrategy({ title: "", description: "", rules: "", category: "", participants: "", duration: "" })
    setEditingStrategy(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (strategy) => {
    setEditingStrategy(strategy)
    setNewStrategy({
      title: strategy.title,
      description: strategy.description,
      rules: strategy.rules,
      category: strategy.category,
      participants: strategy.participants,
      duration: strategy.duration,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setStrategies(strategies.filter((s) => s.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Zap className="h-8 w-8 mr-3 text-orange-600" />
            MCP 전략 관리
          </h1>
          <p className="text-gray-600 mt-2">토론 및 의사결정 흐름 제어 규칙을 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingStrategy(null)
                setNewStrategy({ title: "", description: "", rules: "", category: "", participants: "", duration: "" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />새 전략 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingStrategy ? "전략 수정" : "새 전략 추가"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">전략명</Label>
                <Input
                  id="title"
                  value={newStrategy.title}
                  onChange={(e) => setNewStrategy({ ...newStrategy, title: e.target.value })}
                  placeholder="전략명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newStrategy.description}
                  onChange={(e) => setNewStrategy({ ...newStrategy, description: e.target.value })}
                  placeholder="전략 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="rules">규칙</Label>
                <Textarea
                  id="rules"
                  value={newStrategy.rules}
                  onChange={(e) => setNewStrategy({ ...newStrategy, rules: e.target.value })}
                  placeholder="전략 규칙을 상세히 입력하세요"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={newStrategy.category}
                    onChange={(e) => setNewStrategy({ ...newStrategy, category: e.target.value })}
                    placeholder="카테고리"
                  />
                </div>
                <div>
                  <Label htmlFor="participants">참여자 수</Label>
                  <Input
                    id="participants"
                    value={newStrategy.participants}
                    onChange={(e) => setNewStrategy({ ...newStrategy, participants: e.target.value })}
                    placeholder="예: 3-8명"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="duration">소요시간</Label>
                <Input
                  id="duration"
                  value={newStrategy.duration}
                  onChange={(e) => setNewStrategy({ ...newStrategy, duration: e.target.value })}
                  placeholder="예: 15-30분"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingStrategy ? "수정" : "추가"}
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
          placeholder="전략 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{strategies.length}</div>
            <div className="text-sm text-gray-600">총 전략</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{strategies.reduce((sum, s) => sum + s.usage, 0)}</div>
            <div className="text-sm text-gray-600">총 사용횟수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {[...new Set(strategies.map((s) => s.category))].length}
            </div>
            <div className="text-sm text-gray-600">카테고리 수</div>
          </CardContent>
        </Card>
      </div>

      {/* 전략 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredStrategies.map((strategy) => (
          <Card key={strategy.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg flex items-center">
                    <Settings className="h-5 w-5 mr-2 text-orange-600" />
                    {strategy.title}
                  </CardTitle>
                  <CardDescription className="mt-1">{strategy.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(strategy)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(strategy.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                  <strong>규칙:</strong> {strategy.rules}
                </div>
                <div className="flex justify-between items-center">
                  <Badge variant="secondary">{strategy.category}</Badge>
                  <span className="text-xs text-gray-500">사용 {strategy.usage}회</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <strong>참여자:</strong> {strategy.participants}
                  </div>
                  <div>
                    <strong>소요시간:</strong> {strategy.duration}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
