"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import {
  Brain,
  Send,
  ThumbsUp,
  MessageSquare,
  Lightbulb,
  Target,
  Users,
  ArrowLeft,
  Sparkles,
  Zap,
  Star,
  TrendingUp,
  Plus,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface BrainstormingMessage {
  id: number
  sender: string
  role: string
  content: string
  timestamp: string
  type: "idea" | "question" | "feedback" | "suggestion"
  votes: number
  hasVoted: boolean
  tags: string[]
}

interface AIPersona {
  id: number
  name: string
  role: string
  expertise: string[]
  personality: string
  avatar: string
  isActive: boolean
}

export default function BrainstormingPage({ params }: { params: { id: string } }) {
  const [messages, setMessages] = useState<BrainstormingMessage[]>([])
  const [personas, setPersonas] = useState<AIPersona[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [projectTitle, setProjectTitle] = useState("")
  const [projectObjectives, setProjectObjectives] = useState<string[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  useEffect(() => {
    // 프로젝트 정보 로드
    const mockProject = {
      title: "마케팅 자동화 시스템",
      objectives: ["마케팅 캠페인 자동화", "고객 세그멘테이션 정확도 향상", "ROI 30% 증대"],
    }

    setProjectTitle(mockProject.title)
    setProjectObjectives(mockProject.objectives)

    // AI 페르소나 데이터
    const mockPersonas: AIPersona[] = [
      {
        id: 1,
        name: "마케팅 전략가 김민수",
        role: "Marketing Strategist",
        expertise: ["디지털 마케팅", "고객 분석", "캠페인 기획"],
        personality: "분석적이고 데이터 중심적인 사고",
        avatar: "/placeholder.svg",
        isActive: true,
      },
      {
        id: 2,
        name: "UX 디자이너 이지은",
        role: "UX Designer",
        expertise: ["사용자 경험", "인터페이스 디자인", "사용성 테스트"],
        personality: "사용자 중심적이고 창의적인 접근",
        avatar: "/placeholder.svg",
        isActive: true,
      },
      {
        id: 3,
        name: "데이터 분석가 박준호",
        role: "Data Analyst",
        expertise: ["데이터 마이닝", "예측 분석", "시각화"],
        personality: "논리적이고 객관적인 분석",
        avatar: "/placeholder.svg",
        isActive: true,
      },
      {
        id: 4,
        name: "개발팀장 최서연",
        role: "Tech Lead",
        expertise: ["시스템 아키텍처", "API 설계", "성능 최적화"],
        personality: "실용적이고 기술 중심적인 사고",
        avatar: "/placeholder.svg",
        isActive: true,
      },
    ]

    setPersonas(mockPersonas)

    // 초기 브레인스토밍 메시지들
    const initialMessages: BrainstormingMessage[] = [
      {
        id: 1,
        sender: "마케팅 전략가 김민수",
        role: "Marketing Strategist",
        content:
          "안녕하세요! 마케팅 자동화 시스템 개발을 위한 브레인스토밍을 시작해보겠습니다. 먼저 현재 마케팅 프로세스의 가장 큰 문제점이 무엇인지 파악해야 할 것 같습니다. 제 생각에는 개인화된 콘텐츠 제공과 적절한 타이밍의 메시지 전송이 핵심일 것 같은데, 어떻게 생각하시나요?",
        timestamp: "2024-01-15T09:00:00Z",
        type: "idea",
        votes: 3,
        hasVoted: false,
        tags: ["개인화", "타이밍", "콘텐츠"],
      },
      {
        id: 2,
        sender: "UX 디자이너 이지은",
        role: "UX Designer",
        content:
          "좋은 지적이네요! 사용자 관점에서 보면, 마케팅 메시지가 스팸처럼 느껴지지 않으면서도 관련성 높은 정보를 제공하는 것이 중요합니다. 사용자 여정(User Journey)을 기반으로 한 개인화된 터치포인트 설계는 어떨까요? 예를 들어, 구매 단계별로 다른 메시지 전략을 적용하는 것입니다.",
        timestamp: "2024-01-15T09:05:00Z",
        type: "suggestion",
        votes: 5,
        hasVoted: false,
        tags: ["사용자여정", "터치포인트", "개인화"],
      },
      {
        id: 3,
        sender: "데이터 분석가 박준호",
        role: "Data Analyst",
        content:
          "데이터 관점에서 접근해보면, 고객 행동 패턴 분석이 핵심이 될 것 같습니다. RFM 분석(Recency, Frequency, Monetary)을 기반으로 고객을 세그멘테이션하고, 각 세그먼트별로 최적의 마케팅 전략을 수립할 수 있을 것입니다. 또한 예측 모델을 통해 이탈 가능성이 높은 고객을 미리 식별하는 것도 중요하겠네요.",
        timestamp: "2024-01-15T09:10:00Z",
        type: "idea",
        votes: 4,
        hasVoted: false,
        tags: ["RFM분석", "세그멘테이션", "예측모델"],
      },
      {
        id: 4,
        sender: "개발팀장 최서연",
        role: "Tech Lead",
        content:
          "기술적 구현 측면에서 고려해야 할 점들을 말씀드리겠습니다. 실시간 데이터 처리를 위한 스트리밍 아키텍처와 대용량 고객 데이터를 효율적으로 처리할 수 있는 분산 시스템이 필요할 것 같습니다. 또한 A/B 테스트 기능을 내장하여 캠페인 효과를 실시간으로 측정하고 최적화할 수 있는 시스템은 어떨까요?",
        timestamp: "2024-01-15T09:15:00Z",
        type: "suggestion",
        votes: 6,
        hasVoted: false,
        tags: ["실시간처리", "분산시스템", "A/B테스트"],
      },
      {
        id: 5,
        sender: "마케팅 전략가 김민수",
        role: "Marketing Strategist",
        content:
          "모든 분들의 의견이 정말 좋네요! 이를 종합해보면, 우리가 만들어야 할 시스템의 핵심 기능들이 보입니다: 1) 고객 행동 기반 세그멘테이션, 2) 개인화된 콘텐츠 추천, 3) 최적 타이밍 예측, 4) 실시간 성과 모니터링. 여기에 추가로 멀티채널 통합 관리 기능도 필요할 것 같은데, 이메일뿐만 아니라 SMS, 푸시 알림, 소셜미디어까지 통합 관리할 수 있다면 어떨까요?",
        timestamp: "2024-01-15T09:20:00Z",
        type: "idea",
        votes: 8,
        hasVoted: false,
        tags: ["멀티채널", "통합관리", "종합전략"],
      },
    ]

    setMessages(initialMessages)
  }, [params.id])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    // 사용자 메시지 추가
    const userMessage: BrainstormingMessage = {
      id: messages.length + 1,
      sender: "프로젝트 매니저",
      role: "Project Manager",
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: "question",
      votes: 0,
      hasVoted: false,
      tags: [],
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const activePersona = personas[Math.floor(Math.random() * personas.length)]
      const aiResponses = [
        "흥미로운 관점이네요! 이 아이디어를 더 발전시켜보면...",
        "좋은 질문입니다. 제 경험상 이런 접근이 효과적일 것 같습니다:",
        "이전 프로젝트에서 비슷한 상황이 있었는데, 다음과 같은 방법이 도움이 되었습니다:",
        "데이터를 기반으로 분석해보면, 이런 전략이 유효할 것 같습니다:",
        "사용자 관점에서 보면, 이 부분을 고려해야 할 것 같습니다:",
      ]

      const aiMessage: BrainstormingMessage = {
        id: messages.length + 2,
        sender: activePersona.name,
        role: activePersona.role,
        content: aiResponses[Math.floor(Math.random() * aiResponses.length)] + " " + newMessage,
        timestamp: new Date().toISOString(),
        type: "feedback",
        votes: Math.floor(Math.random() * 5),
        hasVoted: false,
        tags: ["AI응답", "피드백"],
      }

      setMessages((prev) => [...prev, aiMessage])
      setIsLoading(false)
    }, 2000)
  }

  const handleVote = (messageId: number) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId
          ? {
              ...msg,
              votes: msg.hasVoted ? msg.votes - 1 : msg.votes + 1,
              hasVoted: !msg.hasVoted,
            }
          : msg,
      ),
    )
  }

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case "idea":
        return <Lightbulb className="h-4 w-4 text-yellow-500" />
      case "question":
        return <MessageSquare className="h-4 w-4 text-blue-500" />
      case "feedback":
        return <Star className="h-4 w-4 text-purple-500" />
      case "suggestion":
        return <Zap className="h-4 w-4 text-green-500" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-500" />
    }
  }

  const getMessageTypeColor = (type: string) => {
    switch (type) {
      case "idea":
        return "bg-yellow-100 border-yellow-200"
      case "question":
        return "bg-blue-100 border-blue-200"
      case "feedback":
        return "bg-purple-100 border-purple-200"
      case "suggestion":
        return "bg-green-100 border-green-200"
      default:
        return "bg-gray-100 border-gray-200"
    }
  }

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      {/* 네비게이션 버튼들 */}
      <div className="mb-4 flex space-x-2">
        <Button variant="outline" size="sm" onClick={() => router.back()}>
          <ArrowLeft className="h-3 w-3 mr-1" />
          이전
        </Button>
        <Button variant="outline" size="sm" onClick={() => router.push(`/total-projects/${params.id}`)}>
          <ArrowLeft className="h-3 w-3 mr-1" />
          프로젝트로 돌아가기
        </Button>
      </div>

      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Brain className="h-6 w-6 mr-2 text-purple-600" />
            Brainstorming Session
          </h1>
          <p className="text-gray-600">{projectTitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Users className="h-3 w-3 mr-1" />
            {personas.filter((p) => p.isActive).length}명 참여중
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* 사이드바 - 프로젝트 정보 및 참여자 */}
        <div className="lg:col-span-1 space-y-4">
          {/* 프로젝트 목표 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <Target className="h-4 w-4 mr-2 text-blue-600" />
                프로젝트 목표
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {projectObjectives.map((objective, index) => (
                <div key={index} className="text-xs text-gray-600 flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5 flex-shrink-0"></div>
                  <span>{objective}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 참여자 목록 */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2 text-green-600" />
                  AI 참여자
                </CardTitle>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {personas.map((persona) => (
                <div key={persona.id} className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                      {persona.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{persona.name}</p>
                    <p className="text-xs text-gray-600 truncate">{persona.role}</p>
                  </div>
                  {persona.isActive && <div className="w-2 h-2 bg-green-500 rounded-full"></div>}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* 브레인스토밍 통계 */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center">
                <TrendingUp className="h-4 w-4 mr-2 text-orange-600" />
                세션 통계
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">총 아이디어:</span>
                <span className="font-medium">{messages.filter((m) => m.type === "idea").length}개</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">총 투표:</span>
                <span className="font-medium">{messages.reduce((sum, m) => sum + m.votes, 0)}개</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">활성 참여자:</span>
                <span className="font-medium">{personas.filter((p) => p.isActive).length}명</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 메인 채팅 영역 */}
        <div className="lg:col-span-3">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  실시간 아이디어 토론
                </div>
                <Badge variant="outline" className="bg-purple-50 text-purple-700">
                  Live Session
                </Badge>
              </CardTitle>
            </CardHeader>

            {/* 메시지 영역 */}
            <CardContent className="flex-1 overflow-y-auto space-y-4 p-4">
              {messages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg border ${getMessageTypeColor(message.type)}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                          {message.sender.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{message.sender}</p>
                        <p className="text-xs text-gray-600">{message.role}</p>
                      </div>
                      {getMessageTypeIcon(message.type)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString("ko-KR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mb-3 leading-relaxed">{message.content}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {message.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVote(message.id)}
                      className={`flex items-center space-x-1 ${message.hasVoted ? "text-blue-600" : "text-gray-500"}`}
                    >
                      <ThumbsUp className="h-3 w-3" />
                      <span className="text-xs">{message.votes}</span>
                    </Button>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center space-x-2 p-4 bg-gray-50 rounded-lg">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                  <span className="text-sm text-gray-600">AI가 응답을 생성하고 있습니다...</span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </CardContent>

            {/* 메시지 입력 영역 */}
            <div className="flex-shrink-0 p-4 border-t">
              <div className="flex space-x-2">
                <Textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="아이디어나 질문을 입력하세요..."
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSendMessage()
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Enter로 전송, Shift+Enter로 줄바꿈 • AI 페르소나들이 자동으로 응답합니다
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
