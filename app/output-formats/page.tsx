"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { FileText, Plus, Edit, Trash2, Search, Download } from "lucide-react"

const initialFormats = [
  {
    id: 1,
    title: "회의록 템플릿",
    description: "표준 회의록 포맷",
    template: `# 회의록
## 회의 정보
- 일시: [날짜 시간]
- 참석자: [참석자 목록]
- 주제: [회의 주제]

## 논의 사항
[주요 논의 내용]

## 결정 사항
[결정된 내용]

## 액션 아이템
- [ ] [할 일 1] (담당자: [이름], 기한: [날짜])
- [ ] [할 일 2] (담당자: [이름], 기한: [날짜])`,
    category: "회의",
    format: "Markdown",
    usage: 34,
  },
  {
    id: 2,
    title: "프로젝트 계획서",
    description: "프로젝트 계획 문서 포맷",
    template: `# 프로젝트 계획서
## 프로젝트 개요
- 프로젝트명: [프로젝트명]
- 기간: [시작일] ~ [종료일]
- 예산: [예산]

## 목표
[프로젝트 목표]

## 주요 마일스톤
| 단계 | 내용 | 기한 | 담당자 |
|------|------|------|--------|
| 1단계 | [내용] | [날짜] | [담당자] |
| 2단계 | [내용] | [날짜] | [담당자] |

## 리스크 관리
[예상 리스크 및 대응방안]`,
    category: "기획",
    format: "Markdown",
    usage: 28,
  },
  {
    id: 3,
    title: "분석 보고서",
    description: "데이터 분석 결과 보고서 포맷",
    template: `# 분석 보고서
## 요약
[분석 결과 요약]

## 분석 방법
[사용된 분석 방법]

## 주요 발견사항
1. [발견사항 1]
2. [발견사항 2]
3. [발견사항 3]

## 권장사항
[권장사항 및 다음 단계]

## 부록
[추가 데이터 및 차트]`,
    category: "분석",
    format: "Markdown",
    usage: 19,
  },
]

export default function OutputFormatsPage() {
  const [formats, setFormats] = useState(initialFormats)
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingFormat, setEditingFormat] = useState(null)
  const [newFormat, setNewFormat] = useState({
    title: "",
    description: "",
    template: "",
    category: "",
    format: "Markdown",
  })

  const filteredFormats = formats.filter(
    (format) =>
      format.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      format.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleSave = () => {
    if (editingFormat) {
      setFormats(formats.map((f) => (f.id === editingFormat.id ? { ...editingFormat, ...newFormat } : f)))
    } else {
      const newId = Math.max(...formats.map((f) => f.id)) + 1
      setFormats([
        ...formats,
        {
          id: newId,
          ...newFormat,
          usage: 0,
        },
      ])
    }

    setNewFormat({ title: "", description: "", template: "", category: "", format: "Markdown" })
    setEditingFormat(null)
    setIsDialogOpen(false)
  }

  const handleEdit = (format) => {
    setEditingFormat(format)
    setNewFormat({
      title: format.title,
      description: format.description,
      template: format.template,
      category: format.category,
      format: format.format,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id) => {
    setFormats(formats.filter((f) => f.id !== id))
  }

  const handleDownload = (format) => {
    const blob = new Blob([format.template], { type: "text/markdown" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${format.title}.md`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-green-600" />
            Output Format 관리
          </h1>
          <p className="text-gray-600 mt-2">AI가 출력할 문서 포맷을 정의하고 관리합니다</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingFormat(null)
                setNewFormat({ title: "", description: "", template: "", category: "", format: "Markdown" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />새 포맷 추가
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingFormat ? "포맷 수정" : "새 포맷 추가"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">포맷명</Label>
                  <Input
                    id="title"
                    value={newFormat.title}
                    onChange={(e) => setNewFormat({ ...newFormat, title: e.target.value })}
                    placeholder="포맷명을 입력하세요"
                  />
                </div>
                <div>
                  <Label htmlFor="category">카테고리</Label>
                  <Input
                    id="category"
                    value={newFormat.category}
                    onChange={(e) => setNewFormat({ ...newFormat, category: e.target.value })}
                    placeholder="카테고리"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="description">설명</Label>
                <Input
                  id="description"
                  value={newFormat.description}
                  onChange={(e) => setNewFormat({ ...newFormat, description: e.target.value })}
                  placeholder="포맷 설명을 입력하세요"
                />
              </div>
              <div>
                <Label htmlFor="template">템플릿 내용</Label>
                <Textarea
                  id="template"
                  value={newFormat.template}
                  onChange={(e) => setNewFormat({ ...newFormat, template: e.target.value })}
                  placeholder="템플릿 내용을 입력하세요"
                  rows={12}
                  className="font-mono text-sm"
                />
              </div>
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="flex-1">
                  {editingFormat ? "수정" : "추가"}
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
          placeholder="포맷 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{formats.length}</div>
            <div className="text-sm text-gray-600">총 포맷</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{formats.reduce((sum, f) => sum + f.usage, 0)}</div>
            <div className="text-sm text-gray-600">총 사용횟수</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {[...new Set(formats.map((f) => f.category))].length}
            </div>
            <div className="text-sm text-gray-600">카테고리 수</div>
          </CardContent>
        </Card>
      </div>

      {/* 포맷 목록 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredFormats.map((format) => (
          <Card key={format.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{format.title}</CardTitle>
                  <CardDescription className="mt-1">{format.description}</CardDescription>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" onClick={() => handleDownload(format)}>
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEdit(format)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(format.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded font-mono max-h-40 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{format.template}</pre>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <Badge variant="secondary">{format.category}</Badge>
                    <Badge variant="outline">{format.format}</Badge>
                  </div>
                  <span className="text-xs text-gray-500">사용 {format.usage}회</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
