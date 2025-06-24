"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"
import {
  Users,
  Zap,
  Settings,
  FolderOpen,
  Briefcase,
  Database,
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
  Home,
  LayoutDashboard,
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

const navItems = [
  { href: "/", icon: Home, label: "홈" },
  { href: "/total-projects", icon: LayoutDashboard, label: "프로젝트" },
  { href: "/personas", icon: Users, label: "페르소나" },
  { href: "/settings", icon: Settings, label: "설정" },
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
    <aside className="fixed inset-y-0 left-0 w-16 bg-white border-r shadow-sm flex flex-col items-center py-4 space-y-4">
      {navItems.map(({ href, icon: Icon, label }) => (
        <Link
          key={href}
          href={href}
          className={cn("group flex flex-col items-center text-gray-500 hover:text-blue-600 transition-colors")}
        >
          <Icon className="h-6 w-6 mb-1" />
          <span className="sr-only">{label}</span>
        </Link>
      ))}
    </aside>
  )
}

export default ModernSidebar
