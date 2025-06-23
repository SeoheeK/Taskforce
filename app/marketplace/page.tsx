"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { Search } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string // This 'type' should match the 'title' in resourceCategories.items
  price: number
  is_paid: boolean
  file_url?: string
  creator_id: string
  creator_name?: string // Added for mock data
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

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)

  useEffect(() => {
    setSearchQuery(initialSearchQuery)
    setSelectedCategory(initialCategory)
  }, [initialSearchQuery, initialCategory])

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

  const filteredItems = mockMarketplaceItems.filter((item) => {
    const matchesSearch = searchQuery
      ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.creator_name && item.creator_name.toLowerCase().includes(searchQuery.toLowerCase()))
      : true
    const matchesCategory = selectedCategory === "All" || item.type === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="p-6 space-y-8 max-w-6xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50">Resource</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          직접 만든 AI 프롬프트, 에이전트 설정, 전략 문서, 템플릿을 판매하세요.  
          필요한 사람들에게 리소스를 유료로 제공하고, 수익을 얻을 수 있습니다.  
          지금 등록하고 첫 판매를 경험해보세요.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-2xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Resource 검색"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Category Navigation */}
      <div className="flex justify-center space-x-4 overflow-x-auto pb-2 scrollbar-hide">
        {resourceCategories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "ghost"}
            onClick={() => handleCategoryClick(category.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-base"
          >
            {category.title}
          </Button>
        ))}
      </div>

      {/* Featured Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Featured</h2>
        <p className="text-gray-600 dark:text-gray-400">Curated top picks from this week</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-4">
          {filteredItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              선택한 카테고리 또는 검색어에 해당하는 리소스가 없습니다.
            </p>
          ) : (
            filteredItems.map((item) => <MarketplaceItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  )
}
