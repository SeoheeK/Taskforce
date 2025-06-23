"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { Search } from "lucide-react" // Removed Filter, ArrowDownWideNarrow
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react" // Keep useMemo for filtering, remove for sorting
import { Input } from "@/components/ui/input"
// Removed Select imports

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string // This 'type' should match the 'title' in resourceCategories.items
  price: number
  is_paid: boolean
  file_url?: string
  creator_id: string
  creator_name?: string // Keep for mock data consistency
  // Removed likes, downloads, updated_at, gradient_from, gradient_to
}

// Mock data for UI development and testing
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "mock-1",
    name: "데이터 분석 페르소나",
    description: "복잡한 데이터를 분석하고 통찰력을 제공하는 전문가 페르소나입니다.",
    type: "Persona",
    price: 15.99,
    is_paid: true,
    file_url: "/mock-files/data-analyst-persona.json",
    creator_id: "user-1",
    creator_name: "AI Solutions Inc.",
  },
  {
    id: "mock-2",
    name: "브레인스토밍 프롬프트 템플릿",
    description: "창의적인 아이디어를 도출하기 위한 효과적인 브레인스토밍 프롬프트 모음입니다.",
    type: "Prompt 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/brainstorming-prompts.json",
    creator_id: "user-2",
    creator_name: "Creative AI",
  },
  {
    id: "mock-3",
    name: "Agile AI 워크플로우",
    description: "애자일 방법론을 AI 프로젝트에 적용하기 위한 워크플로우 템플릿입니다.",
    type: "Workflow 템플릿",
    price: 29.99,
    is_paid: true,
    file_url: "/mock-files/agile-ai-workflow.json",
    creator_id: "user-3",
    creator_name: "Workflow Masters",
  },
  {
    id: "mock-4",
    name: "회의록 Output Format",
    description: "AI가 자동으로 회의록을 생성할 수 있도록 최적화된 출력 포맷입니다.",
    type: "Output Format",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/meeting-minutes-format.json",
    creator_id: "user-4",
    creator_name: "Meeting AI",
  },
  {
    id: "mock-5",
    name: "정책 기획 MCP 전략",
    description: "정책 수립 과정에서 AI 에이전트 간의 효율적인 토론을 위한 MCP 전략입니다.",
    type: "MCP 전략",
    price: 22.5,
    is_paid: true,
    file_url: "/mock-files/policy-planning-mcp.json",
    creator_id: "user-1",
    creator_name: "AI Solutions Inc.",
  },
  {
    id: "mock-6",
    name: "프로젝트 관리 평가표",
    description: "AI 프로젝트의 성과를 체계적으로 평가하기 위한 템플릿입니다.",
    type: "평가표 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/project-evaluation.json",
    creator_id: "user-5",
    creator_name: "Project Success",
  },
  {
    id: "mock-7",
    name: "고객 서비스 페르소나",
    description: "친절하고 효율적인 고객 응대를 위한 AI 에이전트 페르소나입니다.",
    type: "Persona",
    price: 12.0,
    is_paid: true,
    file_url: "/mock-files/customer-service-persona.json",
    creator_id: "user-2",
    creator_name: "Service AI",
  },
  {
    id: "mock-8",
    name: "마케팅 캠페인 프로젝트 템플릿",
    description: "성공적인 마케팅 캠페인 기획을 위한 프로젝트 템플릿입니다.",
    type: "프로젝트 템플릿",
    price: 35.0,
    is_paid: true,
    file_url: "/mock-files/marketing-project.json",
    creator_id: "user-3",
    creator_name: "Marketing Pro",
  },
  {
    id: "mock-9",
    name: "주간 보고서 산출물 템플릿",
    description: "주간 업무 보고서 작성을 위한 표준화된 산출물 템플릿입니다.",
    type: "산출물 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/weekly-report.json",
    creator_id: "user-4",
    creator_name: "Report Genie",
  },
  {
    id: "mock-10",
    name: "온라인 미팅 포맷",
    description: "효율적인 온라인 회의 진행을 위한 포맷 가이드입니다.",
    type: "회의 유형 / 포맷",
    price: 5.0,
    is_paid: true,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-5",
    creator_name: "Meeting Facilitator",
  },
]

// Resource categories for filtering
const resourceCategories = [
  { title: "All", value: "All" },
  { title: "Persona", value: "Persona" },
  { title: "Prompt 템플릿", value: "Prompt 템플릿" },
  { title: "MCP 전략", value: "MCP 전략" },
  { title: "Output Format", value: "Output Format" },
  { title: "Workflow 템플릿", value: "Workflow 템플릿" },
  { title: "평가표 템플릿", value: "평가표 템플릿" },
  { title: "프로젝트 템플릿", value: "프로젝트 템플릿" },
  { title: "산출물 템플릿", value: "산출물 템플릿" },
  { title: "회의 유형 / 포맷", value: "회의 유형 / 포맷" },
]

export default function MarketplaceHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearchQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("type") || "All"
  // Removed initialSort

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  // Removed sortBy state

  useEffect(() => {
    setSearchQuery(initialSearchQuery)
    setSelectedCategory(initialCategory)
    // Removed setSortBy
  }, [initialSearchQuery, initialCategory]) // Removed initialSort from dependency array

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (searchQuery) {
      params.set("q", searchQuery)
    } else {
      params.delete("q")
    }
    router.push(`/marketplace?${params.toString()}`)
  }

  const handleCategoryClick = (category: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (category !== "All") {
      params.set("type", category)
    } else {
      params.delete("type")
    }
    router.push(`/marketplace?${params.toString()}`)
  }

  // Removed handleSortChange

  const filteredItems = useMemo(() => {
    // Renamed from filteredAndSortedItems
    const items = mockMarketplaceItems.filter((item) => {
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.creator_name && item.creator_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      const matchesCategory = selectedCategory === "All" || item.type === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Removed sorting logic
    return items
  }, [searchQuery, selectedCategory]) // Removed sortBy from dependency array

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto"> {/* Reverted max-w-6xl */}
      {/* Header Section */}
      <div className="text-center"> {/* Removed space-y-2 */}
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Marketplace</h1> {/* Reverted title */}
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400"> {/* Reverted description */}
          AI 리소스들을 탐색하고 공유하세요
        </p>
        <Button asChild className="mt-6"> {/* Added back upload button */}
          <Link href="/marketplace/upload">Upload Your Resource</Link>
        </Button>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Resource 검색" {/* Reverted placeholder */}
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Category Navigation */}
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 scrollbar-hide"> {/* Reverted space-x-4 */}
        {resourceCategories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "ghost"} {/* Reverted variant */}
            onClick={() => handleCategoryClick(category.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-base"
          >
            {category.title}
          </Button>
        ))}
      </div>

      {/* Removed Filter and Sort Controls */}
\
      {/* Featured Section - Renamed to general section as "Featured" was part of smithery.ai design */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"> {/* Reverted grid layout and gap */}
        {filteredItems.length === 0 ? ( // Renamed from filteredAndSortedItems
          <p className="col-span-full text-center text-gray-500 mt-8">
            마켓플레이스에 리소스가 없습니다. 첫 번째 리소스를 업로드하세요!
          </p>
        ) : (
          filteredItems.map((item) => <MarketplaceItemCard key={item.id} item={item} />) // Renamed from filteredAndSortedItems
        )}
      </section>
    </div>
  )
}
