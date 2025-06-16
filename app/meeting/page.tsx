"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { ModernSidebar } from "@/components/modern-sidebar"
import { ModernHeader } from "@/components/modern-header"
import { Plus, Search, Calendar, Clock, Users, MessageSquare } from "lucide-react"
import Link from "next/link"

// 임시 미팅 데이터 (실제로는 API에서 가져와야 함)
const mockMeetings = [
  {
    id: 1,
    title: "프로젝트 킥오프 미팅",
    description: "새로운 웹 개발 프로젝트의 시작을 위한 팀 미팅",
    date: "2024-01-15",
    time: "14:00",
    participants: ["김개발", "이디자인", "박기획"],
    status: "completed",
    duration: "1시간 30분",
  },
  {
    id: 2,
    title: "UI/UX 리뷰 미팅",
    description: "사용자 인터페이스 디자인 검토 및 피드백",
    date: "2024-01-18",
    time: "10:00",
    participants: ["이디자인", "최사용자", "김개발"],
    status: "completed",
    duration: "2시간",
  },
  {
    id: 3,
    title: "스프린트 계획 미팅",
    description: "다음 스프린트를 위한 작업 계획 수립",
    date: "2024-01-22",
    time: "09:00",
    participants: ["전체팀"],
    status: "scheduled",
    duration: "1시간",
  },
  {
    id: 4,
    title: "클라이언트 피드백 미팅",
    description: "클라이언트로부터 받은 피드백 검토 및 대응 방안 논의",
    date: "2024-01-20",
    time: "15:30",
    participants: ["박기획", "김개발", "이디자인"],
    status: "completed",
    duration: "45분",
  },
]

export default function MeetingPage() {
  const [meetings, setMeetings] = useState(mockMeetings)
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredMeetings, setFilteredMeetings] = useState(mockMeetings)

  useEffect(() => {
    const filtered = meetings.filter(
      (meeting) =>
        meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        meeting.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredMeetings(filtered)
  }, [searchTerm, meetings])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "완료"
      case "scheduled":
        return "예정"
      case "cancelled":
        return "취소"
      default:
        return "알 수 없음"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ModernSidebar />
      <div className="ml-16">
        <ModernHeader />
        <main className="p-6">
          {/* 헤더 섹션 */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Meeting</h1>
              <p className="text-gray-600 mt-1">팀 미팅 기록을 관리하고 새로운 미팅을 계획하세요</p>
            </div>
            <Link href="/meeting/new">
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                New Meeting
              </Button>
            </Link>
          </div>

          {/* 검색 바 */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="미팅 제목이나 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">전체 미팅</p>
                    <p className="text-2xl font-bold text-gray-900">{meetings.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Calendar className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">완료된 미팅</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {meetings.filter((m) => m.status === "completed").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-orange-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">예정된 미팅</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {meetings.filter((m) => m.status === "scheduled").length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">이번 주 미팅</p>
                    <p className="text-2xl font-bold text-gray-900">2</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 미팅 목록 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredMeetings.map((meeting) => (
              <Card key={meeting.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{meeting.title}</CardTitle>
                      <CardDescription className="mt-1">{meeting.description}</CardDescription>
                    </div>
                    <Badge className={getStatusColor(meeting.status)}>{getStatusText(meeting.status)}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {meeting.date} {meeting.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      {meeting.duration}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      {Array.isArray(meeting.participants) ? meeting.participants.join(", ") : meeting.participants}
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end space-x-2">
                    <Button variant="outline" size="sm">
                      상세보기
                    </Button>
                    {meeting.status === "scheduled" && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        참여하기
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredMeetings.length === 0 && (
            <div className="text-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">미팅이 없습니다</h3>
              <p className="text-gray-600 mb-4">새로운 미팅을 생성하여 팀과 협업을 시작하세요</p>
              <Link href="/meeting/new">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />첫 번째 미팅 만들기
                </Button>
              </Link>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
