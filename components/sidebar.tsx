"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, Users, Zap, Settings, Plus, FolderOpen, FileText } from "lucide-react"

const navigation = [
  { name: "대시보드", href: "/", icon: Home },
  { name: "페르소나", href: "/personas", icon: Users },
  { name: "프로젝트 유형", href: "/project-types", icon: FolderOpen },
  { name: "결과물", href: "/deliverables", icon: FileText },
  { name: "MCP 작업", href: "/mcp-tasks", icon: Zap },
  { name: "설정", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 shadow-sm">
      {/* 로고 영역 */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">T</span>
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Taskforce
          </span>
        </div>
      </div>

      {/* 새 태스크포스 버튼 */}
      <div className="p-4">
        <Link href="/taskforce/new">
          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
            <Plus className="h-4 w-4 mr-2" />새 태스크포스
          </Button>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors",
                isActive
                  ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
              )}
            >
              <item.icon className={cn("h-5 w-5 mr-3", isActive ? "text-blue-600" : "text-gray-400")} />
              {item.name}
            </Link>
          )
        })}
      </nav>

      {/* 하단 정보 */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">U</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">사용자</p>
            <p className="text-xs text-gray-500">관리자</p>
          </div>
        </div>
      </div>
    </div>
  )
}
