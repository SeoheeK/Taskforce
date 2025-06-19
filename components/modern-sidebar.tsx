"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Settings,
  History,
  Bot,
  MessageSquare,
  Zap,
  FileText,
  GitBranch,
  ClipboardList,
  FolderIcon as FolderTemplate,
  FileOutput,
  Globe,
  Store,
} from "lucide-react"
import { useState } from "react"

export function ModernSidebar() {
  const pathname = usePathname()
  const [isCommunityOpen, setIsCommunityOpen] = useState(
    pathname.startsWith("/marketplace") || pathname.startsWith("/resource"),
  )

  const navItems = [
    {
      title: "Dashboard",
      href: "/",
      icon: LayoutDashboard,
      isDropdown: false,
      activePaths: ["/"],
    },
    {
      title: "Taskforce",
      href: "/taskforce",
      icon: Users,
      isDropdown: false,
      activePaths: ["/taskforce", "/taskforce/new", "/taskforce/[id]"],
    },
    {
      title: "History",
      href: "/history",
      icon: History,
      isDropdown: false,
      activePaths: ["/history"],
    },
    {
      title: "Community",
      href: "#", // No direct link, acts as a parent for dropdown
      icon: Globe,
      isDropdown: true,
      activePaths: [
        "/marketplace",
        "/marketplace/upload",
        "/marketplace/item",
        "/marketplace/transactions",
        "/marketplace/feedback",
      ],
      subItems: [
        {
          title: "Marketplace",
          href: "/marketplace",
          icon: Store,
          activePaths: [
            "/marketplace",
            "/marketplace/upload",
            "/marketplace/item",
            "/marketplace/transactions",
            "/marketplace/feedback",
          ],
        },
        {
          title: "Persona",
          href: "/marketplace?type=Persona", // Link to marketplace with filter
          icon: Bot,
          activePaths: [], // No specific active path for sub-filter
        },
        {
          title: "Prompt 템플릿",
          href: "/marketplace?type=Prompt 템플릿",
          icon: MessageSquare,
          activePaths: [],
        },
        {
          title: "MCP 전략",
          href: "/marketplace?type=MCP 전략",
          icon: Zap,
          activePaths: [],
        },
        {
          title: "Output Format",
          href: "/marketplace?type=Output Format",
          icon: FileText,
          activePaths: [],
        },
        {
          title: "Workflow 템플릿",
          href: "/marketplace?type=Workflow 템플릿",
          icon: GitBranch,
          activePaths: [],
        },
        {
          title: "평가표 템플릿",
          href: "/marketplace?type=평가표 템플릿",
          icon: ClipboardList,
          activePaths: [],
        },
        {
          title: "프로젝트 템플릿",
          href: "/marketplace?type=프로젝트 템플릿",
          icon: FolderTemplate,
          activePaths: [],
        },
        {
          title: "산출물 템플릿",
          href: "/marketplace?type=산출물 템플릿",
          icon: FileOutput,
          activePaths: [],
        },
        {
          title: "회의 유형 / 포맷",
          href: "/marketplace?type=회의 유형 / 포맷",
          icon: Users,
          activePaths: [],
        },
      ],
    },
    {
      title: "Resource Center",
      href: "/resource",
      icon: Settings,
      isDropdown: false,
      activePaths: ["/resource", "/resource/[type]"],
    },
  ]

  return (
    <aside className="w-64 bg-gray-900 text-gray-50 h-full flex flex-col">
      <div className="flex items-center justify-center h-16 border-b border-gray-800">
        <Link className="flex items-center gap-2 font-semibold" href="/">
          <Bot className="h-6 w-6" />
          <span>Taskforce AI</span>
        </Link>
      </div>
      <nav className="flex-1 overflow-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = item.activePaths.some((path) => {
              if (path.includes("[id]") || path.includes("[type]")) {
                const base = path.split("/[")[0]
                return pathname.startsWith(base)
              }
              return pathname === path
            })

            if (item.isDropdown) {
              return (
                <li key={item.title}>
                  <button
                    onClick={() => setIsCommunityOpen(!isCommunityOpen)}
                    className={cn(
                      "flex items-center w-full gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-gray-50 hover:bg-gray-800",
                      (isActive || isCommunityOpen) && "text-gray-50 bg-gray-800",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                    <span className="ml-auto">
                      {isCommunityOpen ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </span>
                  </button>
                  {isCommunityOpen && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.subItems?.map((subItem) => {
                        const isSubItemActive = subItem.activePaths.some((path) => {
                          if (path.includes("[id]") || path.includes("[type]")) {
                            const base = path.split("/[")[0]
                            return pathname.startsWith(base)
                          }
                          return pathname === path
                        })
                        return (
                          <li key={subItem.title}>
                            <Link
                              className={cn(
                                "flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-gray-50 hover:bg-gray-800",
                                isSubItemActive && "text-gray-50 bg-gray-800",
                              )}
                              href={subItem.href}
                            >
                              <subItem.icon className="h-5 w-5" />
                              {subItem.title}
                            </Link>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </li>
              )
            } else {
              return (
                <li key={item.title}>
                  <Link
                    className={cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-gray-50 hover:bg-gray-800",
                      isActive && "text-gray-50 bg-gray-800",
                    )}
                    href={item.href}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.title}
                  </Link>
                </li>
              )
            }
          })}
        </ul>
      </nav>
      <div className="mt-auto p-4 border-t border-gray-800">
        <Link
          className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-400 transition-all hover:text-gray-50 hover:bg-gray-800"
          href="/settings"
        >
          <Settings className="h-5 w-5" />
          Settings
        </Link>
      </div>
    </aside>
  )
}
