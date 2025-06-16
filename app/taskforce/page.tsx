"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Users, Zap } from "lucide-react"

interface Persona {
  id: number
  name: string
  role: string
  avatar_url: string
}

interface Message {
  id: number
  persona_id: number
  content: string
  created_at: string
  persona?: Persona
}

interface TaskforceSession {
  id: number
  title: string
  problem_description: string
}

export default function TaskforcePage() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [currentSession, setCurrentSession] = useState<TaskforceSession | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [problemDescription, setProblemDescription] = useState("")
  const [sessionTitle, setSessionTitle] = useState("")
  const [isSessionActive, setIsSessionActive] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetchPersonas()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const fetchPersonas = async () => {
    try {
      const response = await fetch("/api/personas")
      const data = await response.json()
      setPersonas(data)
    } catch (error) {
      console.error("페르소나 로딩 실패:", error)
    }
  }

  const startTaskforce = async () => {
    if (!sessionTitle || !problemDescription) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/taskforce/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: sessionTitle,
          problem_description: problemDescription,
        }),
      })

      const session = await response.json()
      setCurrentSession(session)
      setIsSessionActive(true)

      // AI 페르소나들과의 대화 시작
      await initiateDiscussion(session.id)
    } catch (error) {
      console.error("세션 시작 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const initiateDiscussion = async (sessionId: number) => {
    try {
      const response = await fetch("/api/taskforce/discuss", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          problem: problemDescription,
          personas: personas.slice(0, 4), // 처음 4개 페르소나 사용
        }),
      })

      if (response.ok) {
        // 실시간으로 메시지 업데이트
        pollMessages(sessionId)
      }
    } catch (error) {
      console.error("토론 시작 실패:", error)
    }
  }

  const pollMessages = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/taskforce/messages/${sessionId}`)
      const newMessages = await response.json()
      setMessages(newMessages)

      // 5초마다 메시지 폴링
      if (isSessionActive) {
        setTimeout(() => pollMessages(sessionId), 5000)
      }
    } catch (error) {
      console.error("메시지 로딩 실패:", error)
    }
  }

  const assignMCPTask = async (personaId: number, taskDescription: string) => {
    try {
      await fetch("/api/mcp/assign-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: currentSession?.id,
          personaId,
          taskDescription,
          taskType: "analysis",
        }),
      })
    } catch (error) {
      console.error("MCP 작업 할당 실패:", error)
    }
  }

  if (!isSessionActive) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-6 w-6 mr-2" />새 태스크포스 세션 시작
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">세션 제목</label>
                <Input
                  value={sessionTitle}
                  onChange={(e) => setSessionTitle(e.target.value)}
                  placeholder="예: 모바일 앱 기획 및 전략 수립"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">해결하고 싶은 문제</label>
                <Textarea
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  placeholder="AI 팀과 함께 해결하고 싶은 문제나 과제를 자세히 설명해주세요..."
                  rows={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">참여할 페르소나들</label>
                <div className="flex flex-wrap gap-2">
                  {personas.slice(0, 4).map((persona) => (
                    <Badge key={persona.id} variant="secondary">
                      {persona.name} ({persona.role})
                    </Badge>
                  ))}
                </div>
              </div>
              <Button
                onClick={startTaskforce}
                disabled={!sessionTitle || !problemDescription || isLoading}
                className="w-full"
              >
                {isLoading ? "시작 중..." : "태스크포스 시작"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{currentSession?.title}</h1>
          <p className="text-gray-600">{currentSession?.problem_description}</p>
        </div>
        <Button onClick={() => setIsSessionActive(false)} variant="outline">
          새 세션
        </Button>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />팀 토론
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div key={message.id} className="flex items-start space-x-3">
                  <Avatar>
                    <AvatarImage src={message.persona?.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback>{message.persona?.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium">{message.persona?.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {message.persona?.role}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-700">{message.content}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center text-sm">
                <Zap className="h-4 w-4 mr-2" />
                MCP 작업 할당
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {personas.slice(0, 4).map((persona) => (
                <Button
                  key={persona.id}
                  size="sm"
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => assignMCPTask(persona.id, `${persona.name}에게 분석 작업 할당`)}
                >
                  {persona.name}에게 작업 할당
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">참여 중인 페르소나</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {personas.slice(0, 4).map((persona) => (
                <div key={persona.id} className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={persona.avatar_url || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">{persona.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{persona.name}</p>
                    <p className="text-xs text-gray-500">{persona.role}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
