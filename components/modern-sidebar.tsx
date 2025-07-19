"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Users,
  Zap,
  Settings,
  FolderOpen,
  Briefcase,
  Database,
  ChevronRight,
  MessageSquare,
  BookOpen,
  Activity,
  CheckCircle,
  Clock,
  Archive,
  Bot,
  UserCheck,
  ClipboardList,
  Calendar,
  Plus,
  GitBranch,
  FileOutput,
  Store,
  Globe,
} from "lucide-react"

// 최신 생성된 프로젝트 3개 (실제로는 API에서 가져와야 함)
const recentProjects = [
  { id: 1, name: "Web Designing", status: "in-progress", icon: Activity },
  { id: 2, name: "Mobile App Development", status: "in-progress", icon: Activity },
  { id: 3, name: "Data Analytics Platform", status: "planning", icon: Clock },
]

// 최신 생성된 미팅 3개 (실제로는 API에서 가져와야 함)
const recentMeetings = [
  { id: 1, name: "Weekly Standup", status: "scheduled", icon: Calendar },
  { id: 2, name: "Product Review", status: "completed", icon: CheckCircle },
  { id: 3, name: "Team Planning", status: "in-progress", icon: Activity },
]

const navigation = [
  {
    name: "Projects",
    href: "/total-projects",
    icon: Briefcase,
    subItems: [
      ...recentProjects.map((project) => ({
        name: project.name,
        href: `/total-projects/${project.id}`,
        icon: project.icon,
        status: project.status,
      })),
      {
        name: "Add New Project",
        href: "/total-projects/new",
        icon: Plus,
        isAddNew: true,
      },
    ],
  },
  {
    name: "Meeting",
    href: "/meeting",
    icon: MessageSquare,
    subItems: [
      ...recentMeetings.map((meeting) => ({
        name: meeting.name,
        href: `/meeting/${meeting.id}`,
        icon: meeting.icon,
        status: meeting.status,
      })),
      {
        name: "Add New Meeting",
        href: "/meeting/new",
        icon: Plus,
        isAddNew: true,
      },
    ],
  },
  {
    name: "Resource",
    href: "/resource",
    icon: Database,
    subItems: [
      // AI 에이전트 설정
      { name: "Persona", href: "/personas", icon: Users, category: "AI 에이전트 설정" },
      { name: "Prompt 템플릿", href: "/prompt-templates", icon: MessageSquare, category: "AI 에이전트 설정" },
      { name: "MCP 전략", href: "/mcp-strategy", icon: Zap, category: "AI 에이전트 설정" },
      { name: "Output Format", href: "/output-formats", icon: BookOpen, category: "AI 에이전트 설정" },

      // PM 도구 (운영/관리자용)
      { name: "Workflow 템플릿", href: "/workflow-templates", icon: GitBranch, category: "PM 도구" },
      { name: "평가표 템플릿", href: "/evaluation-templates", icon: ClipboardList, category: "PM 도구" },
      { name: "프로젝트 템플릿", href: "/project-templates", icon: FolderOpen, category: "PM 도구" },
      { name: "산출물 템플릿", href: "/deliverable-templates", icon: FileOutput, category: "PM 도구" },
      { name: "회의 유형/포맷", href: "/meeting-formats", icon: Users, category: "PM 도구" },
    ],
  },
  { name: "History", href: "/history", icon: Archive },
  {
    name: "Community", // New Community menu
    href: "/marketplace",
    icon: Globe, // Using Globe icon for Community
    subItems: [
      { name: "Marketplace", href: "/marketplace", icon: Store }, // Marketplace sub-item
      // Add other community sub-items here if needed in the future
    ],
  },
]

export function ModernSidebar() {
  const pathname = usePathname()
  const [isExpanded, setIsExpanded] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)

  const isResourceActive =
    pathname.startsWith("/personas") ||
    pathname.startsWith("/prompt-templates") ||
    pathname.startsWith("/mcp-strategy") ||
    pathname.startsWith("/output-formats") ||
    pathname.startsWith("/workflow-templates") ||
    pathname.startsWith("/evaluation-templates") ||
    pathname.startsWith("/project-templates") ||
    pathname.startsWith("/deliverable-templates") ||
    pathname.startsWith("/meeting-formats") ||
    pathname === "/resource"

  const isTotalProjectActive = pathname.startsWith("/total-projects")
  const isMeetingActive = pathname.startsWith("/meeting")
  const isCommunityActive = pathname.startsWith("/marketplace") // New active state for Community

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600"
      case "in-progress":
        return "text-blue-600"
      case "review":
        return "text-purple-600"
      case "planning":
        return "text-gray-600"
      default:
        return "text-gray-400"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "AI 에이전트 설정":
        return Bot
      case "PM 도구":
        return UserCheck
      default:
        return Database
    }
  }

  return (
    <div
      className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 shadow-sm transition-all duration-300 z-50 flex flex-col",
        isExpanded ? "w-64" : "w-16",
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => {
        setIsExpanded(false)
        setHoveredItem(null)
      }}
    >
      {/* 로고 영역 - 홈페이지로 이동 */}
      <Link
        href="/"
        className="flex items-center h-16 px-4 border-b border-gray-200 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-sm">TF</span>
          </div>
          {isExpanded && (
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent whitespace-nowrap">
              Taskforce
            </span>
          )}
        </div>
      </Link>

      {/* 새 프로젝트 버튼 */}
      <div className="p-3">
        <Link href="/taskforce/new">
          <Button
            className={cn(
              "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg transition-all",
              isExpanded ? "w-full" : "w-10 h-10 p-0",
            )}
          >
            <Users className="h-4 w-4" />
            {isExpanded && <span className="ml-2">New AI Team Project</span>}
          </Button>
        </Link>
      </div>

      {/* New AI team Meeting 버튼 */}
      <div className="px-3 pb-3">
        <Link href="/meeting/new">
          <Button
            className={cn(
              "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white shadow-lg transition-all",
              isExpanded ? "w-full" : "w-10 h-10 p-0",
            )}
          >
            <MessageSquare className="h-4 w-4" />
            {isExpanded && <span className="ml-2">New AI Team Meeting</span>}
          </Button>
        </Link>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const isActive =
            item.name === "Projects"
              ? isTotalProjectActive
              : item.name === "Meeting"
                ? isMeetingActive
                : item.name === "Resource"
                  ? isResourceActive
                  : item.name === "Community" // Check for Community active state
                    ? isCommunityActive
                    : pathname === item.href
          const hasSubItems = item.subItems && item.subItems.length > 0

          return (
            <div key={item.name} className="relative">
              <Link
                href={item.href}
                className={cn(
                  "flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative",
                  isActive
                    ? "bg-gradient-to-r from-blue-50 to-purple-50 text-blue-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
                  !isExpanded && "justify-center",
                )}
                onMouseEnter={() => hasSubItems && setHoveredItem(item.name)}
              >
                <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-blue-600" : "text-gray-400")} />
                {isExpanded && (
                  <>
                    <span className="ml-3 whitespace-nowrap">{item.name}</span>
                    {hasSubItems && (
                      <ChevronRight
                        className={cn(
                          "h-4 w-4 ml-auto transition-transform",
                          hoveredItem === item.name ? "rotate-90" : "",
                        )}
                      />
                    )}
                  </>
                )}
              </Link>

              {/* 서브메뉴 */}
              {hasSubItems && isExpanded && hoveredItem === item.name && (
                <div className="ml-6 mt-1 space-y-1 border-l-2 border-gray-100 pl-4 max-h-96 overflow-y-auto">
                  {/* Resource 메뉴의 경우 카테고리별로 그룹화 */}
                  {item.name === "Resource" ? (
                    <>
                      {/* AI 에이전트 설정 카테고리 */}
                      <div className="mb-3">
                        <div className="flex items-center px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <Bot className="h-3 w-3 mr-2" />
                          AI 에이전트 설정
                        </div>
                        {item.subItems
                          .filter((subItem) => "category" in subItem && subItem.category === "AI 에이전트 설정")
                          .map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ml-2",
                                  isSubActive
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                                )}
                              >
                                <subItem.icon
                                  className={cn("h-4 w-4 mr-3", isSubActive ? "text-blue-600" : "text-gray-400")}
                                />
                                <span className="whitespace-nowrap text-xs">{subItem.name}</span>
                              </Link>
                            )
                          })}
                      </div>

                      {/* PM 도구 카테고리 */}
                      <div>
                        <div className="flex items-center px-2 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                          <UserCheck className="h-3 w-3 mr-2" />
                          PM 도구
                        </div>
                        {item.subItems
                          .filter((subItem) => "category" in subItem && subItem.category === "PM 도구")
                          .map((subItem) => {
                            const isSubActive = pathname === subItem.href
                            return (
                              <Link
                                key={subItem.name}
                                href={subItem.href}
                                className={cn(
                                  "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200 ml-2",
                                  isSubActive
                                    ? "bg-blue-100 text-blue-700 font-medium"
                                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                                )}
                              >
                                <subItem.icon
                                  className={cn("h-4 w-4 mr-3", isSubActive ? "text-blue-600" : "text-gray-400")}
                                />
                                <span className="whitespace-nowrap text-xs">{subItem.name}</span>
                              </Link>
                            )
                          })}
                      </div>
                    </>
                  ) : (
                    /* 다른 메뉴들은 기존 방식 유지 */
                    item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      const isAddNew = "isAddNew" in subItem && subItem.isAddNew

                      return (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={cn(
                            "flex items-center px-3 py-2 text-sm rounded-lg transition-all duration-200",
                            isAddNew
                              ? "text-blue-600 hover:text-blue-700 hover:bg-blue-50 font-medium border border-dashed border-blue-300"
                              : isSubActive
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                          )}
                        >
                          {"status" in subItem ? (
                            <subItem.icon className={cn("h-4 w-4 mr-3", getStatusColor(subItem.status))} />
                          ) : (
                            <subItem.icon
                              className={cn(
                                "h-4 w-4 mr-3",
                                isAddNew ? "text-blue-600" : isSubActive ? "text-blue-600" : "text-gray-400",
                              )}
                            />
                          )}
                          <span className="whitespace-nowrap text-xs">{subItem.name}</span>
                        </Link>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      {/* 하단 설정 버튼 */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start hover:bg-gray-50 transition-colors",
              isExpanded ? "p-3 h-auto" : "p-2 h-10 justify-center",
            )}
          >
            <div className="flex items-center space-x-3">
              <Settings className="h-5 w-5 text-gray-600" />
              {isExpanded && <span className="text-sm font-medium text-gray-900">Setting</span>}
            </div>
          </Button>
        </Link>
      </div>
    </div>
  )
}
