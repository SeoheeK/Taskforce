"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Bot, Plus, Edit, Trash2, Search, User } from "lucide-react"

const initialPersonas = [
  {
    id: 1,
    name: "마케팅 전문가",
    role: "Marketing Specialist",
    description: "디지털 마케팅과 브랜드 전략에 특화된 AI 에이전트",
    personality: "창의적이고 분석적이며, 트렌드에 민감한 성격",
    expertise: ["디지털 마케팅", "브랜드 전략", "소셜미디어", "콘텐츠 기획"],
    constraints: ["예산 제약 고려", "법적 규제 준수", "브랜드 가이드라인 준수"],
    tone: "친근하고 전문적인 어조",
    usage: 45,
  },
  {
    id: 2,
    name: "개발팀 리더",
    role: "Tech Lead",
    description: "기술적 의사결정과 팀 관리에 특화된 AI 에이전트",
    personality: "논리적이고 체계적이며, 문제 해결 지향적인 성격",
    expertise: ["소프트웨어 아키텍처", "팀 관리", "기술 전략", "코드 리뷰"],
    constraints: ["기술 부채 고려", "성능 최적화 필수", "보안 요구사항 준수"],
    tone: "명확하고 직접적인 어조",
    usage: 38,
  },
  {
    id: 3,
    name: "UI/UX 디자이너",
    role: "UX Designer",
    description: "사용자 경험과 인터페이스 디자인에 특화된 AI 에이전트",
    personality: "사용자 중심적이고 창의적이며, 세심한 성격",
    expertise: ["사용자 리서치", "프로토타이핑", "인터랙션 디자인", "접근성"],
    constraints: ["사용성 우선", "접근성 준수", "브랜드 일관성 유지"],
    tone: "공감적이고 설명적인 어조",
    usage: 32,
  },
  {
    id: 4,
    name: "데이터 분석가",
    role: "Data Analyst",
    description: "데이터 분석과 인사이트 도출에 특화된 AI 에이전트",
    personality: "분석적이고 객관적이며, 데이터 기반 사고를 하는 성격",
    expertise: ["통계 분석", "데이터 시각화", "예측 모델링", "비즈니스 인텔리전스"],
    constraints: ["데이터 품질 확인", "개인정보 보호", "통계적 유의성 검증"],
    tone: "객관적이고 정확한 어조",
    usage: 28,
  },
]

export default function PersonasPage() {
  const [personas, setPersonas] = useState(initialPersonas)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPersona, setEditingPersona] = useState(null)
  const [newPersona, setNewPersona] = useState({
    name: "",
    role: "",
    description: "",
    personality: "",
    expertise: "",
    constraints: "",
    tone: "",
  })

  const filteredPersonas = personas.filter(
    (persona) =>
      persona.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      persona.expertise.some((exp) => exp.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleSave = () => {
    if (editingPersona) {
      setPersonas(
        personas.map((p) =>
          p.id === editingPersona.id
            ? {
                ...editingPersona,
                ...newPersona,
                expertise: newPersona.expertise.split(",").map((exp) => exp.trim()),
                constraints: newPersona.constraints.split(",").map((con) => con.trim()),
              }
            : p,
        ),
      )
    } else {
      const newId = Math.max(...personas.map((p) => p.id)) + 1
      setPersonas([
        ...personas,
        {
          id: newId,
          ...newPersona,
          expertise: newPersona.expertise.split(",").map((exp) => exp.trim()),
          constraints: newPersona.constraints.split(",").map((con) => con.trim()),
          usage: 0,
        },
      ])
    }

    setNewPersona({ name: "", role: "", description: "", personality: "", expertise: "", constraints: "", tone: "" })
    setEditingPersona(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (persona) => {
    setEditingPersona(persona)
    setNewPersona({
      name: persona.name,
      role: persona.role,
      description: persona.description,
      personality: persona.personality,
      expertise: persona.expertise.join(", "),
      constraints: persona.constraints.join(", "),
      tone: persona.tone,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setPersonas(personas.filter((p) => p.id !== id))
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Bot className="h-8 w-8 mr-3 text-blue-600" />
            Persona 관리
          </h1>
          <p className="text-gray-600 mt-2">AI 에이전트의 성격, 역할, 전문분야, 제약조건을 설정합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingPersona(null)
                setNewPersona({
                  name: "",
                  role: "",
                  description: "",
                  personality: "",
                  expertise: "",
                  constraints: "",
                  tone: "",
                })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />새 페르소나 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPersona ? "페르소나 수정" : "새 페르소나 추가"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={newPersona.name}
                    onChange={(e) => setNewPersona({ ...newPersona, name: e.target.value })}
                    placeholder="페르소나 이름을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="role">역할</Label>
                  <Input
                    id="role"
                    value={newPersona.role}
                    onChange={(e) => setNewPersona({ ...newPersona, role: e.target.value })}
                    placeholder="역할을 입력하세요"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Textarea
                  id="description"
                  value={newPersona.description}
                  onChange={(e) => setNewPersona({ ...newPersona, description: e.target.value })}
                  placeholder="페르소나 설명을 입력하세요"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="personality">성격</Label>
                <Textarea
                  id="personality"
                  value={newPersona.personality}
                  onChange={(e) => setNewPersona({ ...newPersona, personality: e.target.value })}
                  placeholder="성격 특성을 입력하세요"
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="expertise">전문분야 (쉼표로 구분)</Label>
                <Input
                  id="expertise"
                  value={newPersona.expertise}
                  onChange={(e) => setNewPersona({ ...newPersona, expertise: e.target.value })}
                  placeholder="전문분야1, 전문분야2, 전문분야3"
                />
              </div>
              <div>
                <Label htmlFor="constraints">제약조건 (쉼표로 구분)</Label>
                <Input
                  id="constraints"
                  value={newPersona.constraints}
                  onChange={(e) => setNewPersona({ ...newPersona, constraints: e.target.value })}
                  placeholder="제약조건1, 제약조건2, 제약조건3"
                />
              </div>
              <div>
                <Label htmlFor="tone">말투</Label>
                <Input
                  id="tone"
                  value={newPersona.tone}
                  onChange={(e) => setNewPersona({ ...newPersona, tone: e.target.value })}
                  placeholder="말투를 입력하세요"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingPersona ? "수정" : "추가"}
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
          placeholder="페르소나 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{personas.length}</div>
            <div className="text-sm text-gray-600">총 페르소나</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{personas.reduce((sum, p) => sum + p.usage, 0)}</div>
            <div className="text-sm text-gray-600">총 사용횟수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {[...new Set(personas.flatMap((p) => p.expertise))].length}
            </div>
            <div className="text-sm text-gray-600">전문분야 수</div>
          </CardContent>
        </Card>
      </div>

      {/* 페르소나 목록 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPersonas.map((persona) => (
          <Card key={persona.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="h-12 w-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{persona.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-blue-600">{persona.role}</CardDescription>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(persona)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(persona.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-gray-700">{persona.description}</p>

                <div className="space-y-2">
                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">성격</span>
                    <p className="text-sm text-gray-600">{persona.personality}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-500 uppercase">말투</span>
                    <p className="text-sm text-gray-600">{persona.tone}</p>
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">전문분야</span>
                  <div className="flex flex-wrap gap-1">
                    {persona.expertise.map((exp, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {exp}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase mb-2 block">제약조건</span>
                  <div className="flex flex-wrap gap-1">
                    {persona.constraints.map((constraint, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {constraint}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-xs text-gray-500">사용 {persona.usage}회</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
