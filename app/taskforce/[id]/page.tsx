"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Clock, CheckCircle, AlertTriangle, Activity, Calendar } from "lucide-react"
import { UserPlus, Briefcase } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { TaskProgressMonitor } from "@/components/task-progress-monitor"

interface TaskforceDetail {
  id: number
  title: string
  description: string
  status: string
  progress: number
  priority: string
  deadline: string
  participants: any[]
  messages: any[]
  tasks: any[]
  decisions: any[]
}

export default function TaskforceDetailPage({ params }: { params: { id: string } }) {
  const [taskforce, setTaskforce] = useState<TaskforceDetail | null>(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [availablePersonas, setAvailablePersonas] = useState<any[]>([])
  const [isAddParticipantOpen, setIsAddParticipantOpen] = useState(false)
  const [isAssignTaskOpen, setIsAssignTaskOpen] = useState(false)
  const [selectedPersonasToAdd, setSelectedPersonasToAdd] = useState<number[]>([])
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    priority: "medium",
    deadline: "",
    estimatedHours: "",
  })

  useEffect(() => {
    // 임시 데이터 로드
    setTaskforce({
      id: Number.parseInt(params.id),
      title: "모바일 앱 기획 및 전략 수립",
      description: "새로운 모바일 앱의 기획부터 출시 전략까지 종합적인 계획을 수립합니다.",
      status: "진행중",
      progress: 75,
      priority: "high",
      deadline: "2024-01-15",
      participants: [
        { id: 1, name: "전략가 알렉스", role: "Strategic Planner", status: "active", currentTask: "시장 분석 진행 중" },
        { id: 2, name: "개발자 사라", role: "Technical Lead", status: "active", currentTask: "기술 스택 검토" },
        { id: 3, name: "디자이너 마크", role: "UX Designer", status: "waiting", currentTask: "사용자 리서치 대기" },
        { id: 4, name: "분석가 리나", role: "Data Analyst", status: "active", currentTask: "경쟁사 분석" },
      ],
      messages: [
        {
          id: 1,
          sender: "전략가 알렉스",
          content: "시장 분석 결과, 타겟 고객층이 명확히 정의되었습니다.",
          time: "2분 전",
        },
        {
          id: 2,
          sender: "개발자 사라",
          content: "React Native를 사용한 크로스 플랫폼 개발을 제안합니다.",
          time: "5분 전",
        },
        { id: 3, sender: "분석가 리나", content: "경쟁사 대비 차별화 포인트 3가지를 도출했습니다.", time: "10분 전" },
      ],
      tasks: [
        {
          id: 1,
          title: "시장 조사 및 분석",
          assignee: "전략가 알렉스",
          status: "진행중",
          progress: 80,
          deadline: "2024-01-12",
        },
        {
          id: 2,
          title: "기술 스택 선정",
          assignee: "개발자 사라",
          status: "진행중",
          progress: 60,
          deadline: "2024-01-13",
        },
        {
          id: 3,
          title: "UI/UX 프로토타입",
          assignee: "디자이너 마크",
          status: "대기",
          progress: 0,
          deadline: "2024-01-14",
        },
        { id: 4, title: "경쟁사 분석", assignee: "분석가 리나", status: "완료", progress: 100, deadline: "2024-01-11" },
      ],
      decisions: [
        { id: 1, title: "플랫폼 선택 (iOS vs Android vs 크로스플랫폼)", urgency: "high", deadline: "2024-01-12" },
        { id: 2, title: "수익 모델 결정", urgency: "medium", deadline: "2024-01-14" },
      ],
    })
  }, [params.id])

  const fetchAvailablePersonas = async () => {
    try {
      const response = await fetch("/api/personas")
      const allPersonas = await response.json()
      // 현재 참여하지 않은 페르소나들만 필터링
      const currentParticipantIds = taskforce?.participants.map((p) => p.id) || []
      const available = allPersonas.filter((p) => !currentParticipantIds.includes(p.id))
      setAvailablePersonas(available)
    } catch (error) {
      console.error("페르소나 로딩 실패:", error)
    }
  }

  const handleAddParticipants = async () => {
    if (selectedPersonasToAdd.length === 0) return

    try {
      await fetch(`/api/taskforce/${taskforce?.id}/participants`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ personaIds: selectedPersonasToAdd }),
      })

      // 태스크포스 데이터 새로고침
      window.location.reload()
    } catch (error) {
      console.error("참여자 추가 실패:", error)
    }
  }

  const handleAssignNewTask = async () => {
    if (!newTaskForm.title || !newTaskForm.assigneeId) return

    try {
      await fetch(`/api/taskforce/${taskforce?.id}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newTaskForm,
          sessionId: taskforce?.id,
        }),
      })

      setIsAssignTaskOpen(false)
      setNewTaskForm({
        title: "",
        description: "",
        assigneeId: "",
        priority: "medium",
        deadline: "",
        estimatedHours: "",
      })

      // 태스크포스 데이터 새로고침
      window.location.reload()
    } catch (error) {
      console.error("작업 할당 실패:", error)
    }
  }

  if (!taskforce) {
    return <div className="p-6">로딩 중...</div>
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">{taskforce.title}</h1>
            <Badge className={getPriorityColor(taskforce.priority)}>
              {taskforce.priority === "high" ? "높음" : taskforce.priority === "medium" ? "보통" : "낮음"}
            </Badge>
          </div>
          <p className="text-gray-600 mb-4">{taskforce.description}</p>
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center">
              <Activity className="h-4 w-4 mr-1" />
              <span>{taskforce.status}</span>
            </div>
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1" />
              <span>{taskforce.participants.length}명 참여</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1" />
              <span>마감: {taskforce.deadline}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600 mb-1">{taskforce.progress}%</div>
          <Progress value={taskforce.progress} className="w-32" />
        </div>
      </div>

      <div className="flex space-x-2">
        <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" onClick={fetchAvailablePersonas}>
              <UserPlus className="h-4 w-4 mr-2" />
              참여자 추가
            </Button>
          </DialogTrigger>
        </Dialog>

        <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Briefcase className="h-4 w-4 mr-2" />새 작업 할당
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* 탭 네비게이션 */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">개요</TabsTrigger>
          <TabsTrigger value="participants">참여자</TabsTrigger>
          <TabsTrigger value="tasks">작업</TabsTrigger>
          <TabsTrigger value="decisions">결정사항</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* 실시간 활동 */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="h-5 w-5 mr-2" />
                실시간 활동
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {taskforce.messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {message.sender.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-medium text-sm">{message.sender}</span>
                        <span className="text-xs text-gray-500">{message.time}</span>
                      </div>
                      <p className="text-sm text-gray-700">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* 진행 상황 요약 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-medium">완료된 작업</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {taskforce.tasks.filter((t) => t.status === "완료").length}
                    </p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-yellow-600 text-sm font-medium">진행 중인 작업</p>
                    <p className="text-2xl font-bold text-yellow-900">
                      {taskforce.tasks.filter((t) => t.status === "진행중").length}
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-red-50 to-red-100">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-red-600 text-sm font-medium">대기 중인 결정</p>
                    <p className="text-2xl font-bold text-red-900">{taskforce.decisions.length}</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="participants" className="space-y-4">
          <div className="grid gap-4">
            {taskforce.participants.map((participant) => (
              <Card key={participant.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {participant.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{participant.name}</h3>
                        <p className="text-sm text-gray-600">{participant.role}</p>
                        <p className="text-sm text-blue-600 mt-1">{participant.currentTask}</p>
                      </div>
                    </div>
                    <Badge className={getStatusColor(participant.status)}>
                      {participant.status === "active" ? "활성" : participant.status === "waiting" ? "대기" : "완료"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="space-y-6">
          <TaskProgressMonitor sessionId={taskforce.id} />

          <div className="grid gap-4">
            {taskforce.tasks.map((task) => (
              <Card key={task.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{task.title}</h3>
                      <p className="text-sm text-gray-600">담당: {task.assignee}</p>
                    </div>
                    <div className="text-right">
                      <Badge
                        className={getStatusColor(
                          task.status === "완료" ? "completed" : task.status === "진행중" ? "active" : "waiting",
                        )}
                      >
                        {task.status}
                      </Badge>
                      <p className="text-xs text-gray-500 mt-1">마감: {task.deadline}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <Progress value={task.progress} className="flex-1 mr-4" />
                    <span className="text-sm font-medium">{task.progress}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="decisions" className="space-y-4">
          <div className="grid gap-4">
            {taskforce.decisions.map((decision) => (
              <Card key={decision.id} className="border-l-4 border-l-orange-500">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{decision.title}</h3>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-1 text-orange-500" />
                          <span>긴급도: {decision.urgency === "high" ? "높음" : "보통"}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>결정 마감: {decision.deadline}</span>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                      결정하기
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* 참여자 추가 다이얼로그 */}
      <Dialog open={isAddParticipantOpen} onOpenChange={setIsAddParticipantOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>참여자 추가</DialogTitle>
            <DialogDescription>태스크포스에 새로운 AI 페르소나를 추가하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {availablePersonas.map((persona) => (
                <div
                  key={persona.id}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPersonasToAdd.includes(persona.id)
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => {
                    setSelectedPersonasToAdd((prev) =>
                      prev.includes(persona.id) ? prev.filter((id) => id !== persona.id) : [...prev, persona.id],
                    )
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <Checkbox checked={selectedPersonasToAdd.includes(persona.id)} readOnly />
                    <Avatar>
                      <AvatarFallback className="bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                        {persona.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{persona.name}</h4>
                      <p className="text-sm text-blue-600 mb-1">{persona.role}</p>
                      <p className="text-sm text-gray-600">{persona.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedPersonasToAdd.length > 0 && (
              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>{selectedPersonasToAdd.length}명</strong>의 AI 페르소나가 선택되었습니다.
                </p>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAddParticipantOpen(false)}>
                취소
              </Button>
              <Button onClick={handleAddParticipants} disabled={selectedPersonasToAdd.length === 0}>
                참여자 추가
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 새 작업 할당 다이얼로그 */}
      <Dialog open={isAssignTaskOpen} onOpenChange={setIsAssignTaskOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>새 작업 할당</DialogTitle>
            <DialogDescription>참여자에게 새로운 작업을 할당하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="taskTitle">작업 제목</Label>
              <Input
                id="taskTitle"
                value={newTaskForm.title}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, title: e.target.value })}
                placeholder="예: 사용자 인터뷰 진행"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="taskDescription">작업 설명</Label>
              <Textarea
                id="taskDescription"
                value={newTaskForm.description}
                onChange={(e) => setNewTaskForm({ ...newTaskForm, description: e.target.value })}
                placeholder="구체적인 작업 내용과 요구사항을 설명해주세요..."
                rows={3}
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="assignee">담당자</Label>
                <Select
                  value={newTaskForm.assigneeId}
                  onValueChange={(value) => setNewTaskForm({ ...newTaskForm, assigneeId: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="담당자 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {taskforce?.participants.map((participant) => (
                      <SelectItem key={participant.id} value={participant.id.toString()}>
                        {participant.name} ({participant.role})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="priority">우선순위</Label>
                <Select
                  value={newTaskForm.priority}
                  onValueChange={(value) => setNewTaskForm({ ...newTaskForm, priority: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="high">높음</SelectItem>
                    <SelectItem value="medium">보통</SelectItem>
                    <SelectItem value="low">낮음</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="deadline">마감일</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={newTaskForm.deadline}
                  onChange={(e) => setNewTaskForm({ ...newTaskForm, deadline: e.target.value })}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="estimatedHours">예상 소요 시간</Label>
                <Select
                  value={newTaskForm.estimatedHours}
                  onValueChange={(value) => setNewTaskForm({ ...newTaskForm, estimatedHours: value })}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="시간 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1-2시간">1-2시간</SelectItem>
                    <SelectItem value="반나절">반나절</SelectItem>
                    <SelectItem value="1일">1일</SelectItem>
                    <SelectItem value="2-3일">2-3일</SelectItem>
                    <SelectItem value="1주일">1주일</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsAssignTaskOpen(false)}>
                취소
              </Button>
              <Button
                onClick={handleAssignNewTask}
                disabled={!newTaskForm.title || !newTaskForm.assigneeId}
                className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
              >
                작업 할당
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
