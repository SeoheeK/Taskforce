"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { Menu, Search, Moon, Sun, Bell, Settings, LogOut, Clock, AlertTriangle, CheckCircle, User } from "lucide-react"

// 알림 데이터 (실제로는 API에서 가져올 데이터)
const notifications = [
  {
    id: 1,
    type: "urgent",
    title: "긴급 작업 검토 필요",
    description: "AI 모델 최적화 작업이 검토 대기 중입니다",
    taskId: "task-001",
    projectId: "proj-001",
    time: "5분 전",
    isRead: false,
  },
  {
    id: 2,
    type: "deadline",
    title: "마감일 임박",
    description: "웹사이트 리디자인 프로젝트 마감일이 내일입니다",
    taskId: "task-002",
    projectId: "proj-002",
    time: "1시간 전",
    isRead: false,
  },
  {
    id: 3,
    type: "completed",
    title: "작업 완료",
    description: "데이터베이스 마이그레이션이 성공적으로 완료되었습니다",
    taskId: "task-003",
    projectId: "proj-003",
    time: "3시간 전",
    isRead: true,
  },
  {
    id: 4,
    type: "approval",
    title: "승인 요청",
    description: "새로운 팀원 추가 요청이 대기 중입니다",
    taskId: "task-004",
    projectId: "proj-004",
    time: "6시간 전",
    isRead: false,
  },
]

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "urgent":
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    case "deadline":
      return <Clock className="h-4 w-4 text-orange-500" />
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-500" />
    case "approval":
      return <User className="h-4 w-4 text-blue-500" />
    default:
      return <Bell className="h-4 w-4 text-gray-500" />
  }
}

export function ModernHeader() {
  const [isDark, setIsDark] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleNotificationClick = (taskId: string, projectId: string) => {
    // 실제로는 해당 태스크 페이지로 이동
    console.log(`Navigate to task ${taskId} in project ${projectId}`)
  }

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* 왼쪽 영역 */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="icon" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </div>

      {/* 중앙 검색바 */}
      <div className="flex-1 max-w-md mx-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
          />
        </div>
      </div>

      {/* 오른쪽 영역 */}
      <div className="flex items-center space-x-3">
        {/* 다크모드 토글 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDark(!isDark)}
          className="text-gray-600 hover:text-gray-900"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* 알림 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative text-gray-600 hover:text-gray-900">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center p-0">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80" align="end" forceMount>
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-semibold text-gray-900">알림</h3>
              <Badge variant="secondary" className="text-xs">
                {unreadCount}개 미확인
              </Badge>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="p-4 cursor-pointer hover:bg-gray-50 border-b last:border-b-0"
                  onClick={() => handleNotificationClick(notification.taskId, notification.projectId)}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className={`text-sm font-medium ${notification.isRead ? "text-gray-600" : "text-gray-900"}`}>
                          {notification.title}
                        </p>
                        {!notification.isRead && <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{notification.description}</p>
                      <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                    </div>
                  </div>
                </DropdownMenuItem>
              ))}
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-3 text-center text-sm text-blue-600 hover:text-blue-700">
              모든 알림 보기
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 프로필 드롭다운 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Aybike C." />
                <AvatarFallback className="bg-gradient-to-br from-purple-400 to-pink-500 text-white">AC</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>설정</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="mr-2 h-4 w-4" />
              <span>로그아웃</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
