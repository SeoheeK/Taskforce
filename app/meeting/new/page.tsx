"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ModernSidebar } from "@/components/modern-sidebar"
import { ModernHeader } from "@/components/modern-header"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  MessageSquare,
  Send,
  Bot,
  User,
  Lightbulb,
  Target,
  CheckCircle,
  Clock,
  ArrowLeft,
  Plus,
} from "lucide-react"
import Link from "next/link"

// 임시 참가자 데이터
const availableParticipants = [
  { id: 1, name: "김개발", role: "Frontend Developer", avatar: "👨‍💻" },
  { id: 2, name: "이디자인", role: "UI/UX Designer", avatar: "🎨" },
  { id: 3, name: "박기획", role: "Product Manager", avatar: "📋" },
  { id: 4, name: "최사용자", role: "UX Researcher", avatar: "🔍" },
  { id: 5, name: "정백엔드", role: "Backend Developer", avatar: "⚙️" },
  { id: 6, name: "한데이터", role: "Data Scientist", avatar: "📊" },
  { id: 7, name: "오데브옵", role: "DevOps Engineer", avatar: "☁️" },
  { id: 8, name: "강분석", role: "Business Analyst", avatar: "📈" },
  { id: 9, name: "성마케팅", role: "Marketing Manager", avatar: "📣" },
  { id: 10, name: "윤세일즈", role: "Sales Director", avatar: "💰" },
  { id: 11, name: "임에이치알", role: "HR Manager", avatar: "🤝" },
  { id: 12, name: "고재무", role: "Finance Analyst", avatar: "🧮" },
  { id: 13, name: "신법률", role: "Legal Advisor", avatar: "⚖️" },
  { id: 14, name: "차고객", role: "Customer Success Manager", avatar: "🌟" },
  { id: 15, name: "주기술", role: "Technical Writer", avatar: "✍️" },
]

// 임시 메시지 데이터
const initialMessages = [
  {
    id: 1,
    sender: "AI Assistant",
    content: "안녕하세요! 새로운 미팅을 시작합니다. 오늘의 주제는 무엇인가요?",
    timestamp: new Date(),
    isAI: true,
  },
]

export default function NewMeetingPage() {
  const [meetingTitle, setMeetingTitle] = useState("")
  const [meetingDescription, setMeetingDescription] = useState("")
  const [selectedParticipants, setSelectedParticipants] = useState<number[]>([])
  const [messages, setMessages] = useState(initialMessages)
  const [newMessage, setNewMessage] = useState("")
  const [meetingStarted, setMeetingStarted] = useState(false)

  const handleParticipantToggle = (participantId: number) => {
    setSelectedParticipants((prev) =>
      prev.includes(participantId) ? prev.filter((id) => id !== participantId) : [...prev, participantId],
    )
  }

  const handleSendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      timestamp: new Date(),
      isAI: false,
    }

    setMessages((prev) => [...prev, userMessage])
    setNewMessage("")

    // AI 응답 시뮬레이션
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "AI Assistant",
        content: "좋은 의견이네요! 이 아이디어를 더 구체화해보면 어떨까요? 다른 참가자들의 의견도 들어보겠습니다.",
        timestamp: new Date(),
        isAI: true,
      }
      setMessages((prev) => [...prev, aiResponse])
    }, 1000)
  }

  const handleStartMeeting = () => {
    if (!meetingTitle.trim()) {
      alert("미팅 제목을 입력해주세요.")
      return
    }
    setMeetingStarted(true)
  }

  if (!meetingStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <ModernSidebar />
        <div className="ml-8">
          <ModernHeader />
          <main className="p-6">
            {/* 헤더 */}
            <div className="flex items-center mb-6">
              <Link href="/meeting">
                <Button variant="ghost" size="sm" className="mr-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  뒤로가기
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">새 미팅 생성</h1>
                <p className="text-gray-600 mt-1">미팅 정보를 입력하고 참가자를 선택하세요</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* 미팅 설정 */}
              <Card>
                <CardHeader>
                  <CardTitle>미팅 정보</CardTitle>
                  <CardDescription>미팅의 기본 정보를 입력하세요</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">미팅 제목</Label>
                    <Input
                      id="title"
                      placeholder="미팅 제목을 입력하세요"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">미팅 설명</Label>
                    <Textarea
                      id="description"
                      placeholder="미팅의 목적과 주요 안건을 설명하세요"
                      value={meetingDescription}
                      onChange={(e) => setMeetingDescription(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* 참가자 선택 */}
              <Card>
                <CardHeader>
                  <CardTitle>참가자 선택</CardTitle>
                  <CardDescription>미팅에 참여할 팀원을 선택하세요</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {availableParticipants.map((participant) => (
                      <div
                        key={participant.id}
                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                          selectedParticipants.includes(participant.id)
                            ? "bg-blue-50 border-blue-200"
                            : "bg-white border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleParticipantToggle(participant.id)}
                      >
                        <span className="text-2xl mr-3">{participant.avatar}</span>
                        <div className="flex-1">
                          <p className="font-medium">{participant.name}</p>
                          <p className="text-sm text-gray-600">{participant.role}</p>
                        </div>
                        {selectedParticipants.includes(participant.id) && (
                          <CheckCircle className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                    ))}
                    <div
                      className="flex items-center p-3 rounded-lg border-2 border-dashed border-gray-300 cursor-pointer transition-colors hover:bg-gray-50 hover:border-gray-400"
                      onClick={() => {}}
                    >
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mr-3">
                        <Plus className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-600">새 참가자 추가</p>
                        <p className="text-sm text-gray-500">새로운 페르소나를 추가하세요</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">선택된 참가자: {selectedParticipants.length}명</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 미팅 시작 버튼 */}
            <div className="mt-6 flex justify-center">
              <Button
                onClick={handleStartMeeting}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
                disabled={!meetingTitle.trim()}
              >
                <MessageSquare className="h-5 w-5 mr-2" />
                미팅 시작하기
              </Button>
            </div>
          </main>
        </div>
      </div>
    )
  }

  // 미팅 진행 화면 (/total-projects/1/brainstorming과 유사)
  return (
    <div className="min-h-screen bg-gray-50">
      <ModernSidebar />
      <div className="ml-8">
        <ModernHeader />
        <main className="p-6">
          {/* 미팅 헤더 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{meetingTitle}</h1>
              <p className="text-gray-600 mt-1">{meetingDescription}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge className="bg-green-100 text-green-800">
                <Clock className="h-3 w-3 mr-1" />
                진행 중
              </Badge>
              <Button variant="outline">미팅 종료</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 참가자 패널 */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  참가자 ({selectedParticipants.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {availableParticipants
                    .filter((p) => selectedParticipants.includes(p.id))
                    .map((participant) => (
                      <div key={participant.id} className="flex items-center p-2 bg-gray-50 rounded-lg">
                        <span className="text-xl mr-2">{participant.avatar}</span>
                        <div>
                          <p className="font-medium text-sm">{participant.name}</p>
                          <p className="text-xs text-gray-600">{participant.role}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* 메인 채팅 영역 */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="h-5 w-5 mr-2" />
                  미팅 대화
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* 메시지 목록 */}
                <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex ${message.isAI ? "justify-start" : "justify-end"}`}>
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isAI ? "bg-white border border-gray-200" : "bg-blue-600 text-white"
                        }`}
                      >
                        <div className="flex items-center mb-1">
                          {message.isAI ? (
                            <Bot className="h-4 w-4 mr-2 text-blue-600" />
                          ) : (
                            <User className="h-4 w-4 mr-2" />
                          )}
                          <span className="text-sm font-medium">{message.sender}</span>
                        </div>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${message.isAI ? "text-gray-500" : "text-blue-100"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 메시지 입력 */}
                <div className="flex space-x-2">
                  <Input
                    placeholder="메시지를 입력하세요..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                {/* 빠른 액션 버튼들 */}
                <div className="flex flex-wrap gap-2 mt-4">
                  <Button variant="outline" size="sm">
                    <Lightbulb className="h-4 w-4 mr-1" />
                    아이디어 제안
                  </Button>
                  <Button variant="outline" size="sm">
                    <Target className="h-4 w-4 mr-1" />
                    목표 설정
                  </Button>
                  <Button variant="outline" size="sm">
                    <CheckCircle className="h-4 w-4 mr-1" />
                    액션 아이템
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
