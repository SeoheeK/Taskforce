"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import { Search, Filter, ArrowDownWideNarrow } from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  is_paid: boolean
  file_url?: string
  creator_id: string
  creator_name?: string
  likes: number
  downloads: number
  updated_at: string // ISO string
  gradient_from?: string
  gradient_to?: string
}

// Mock data for UI development and testing
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "mock-1",
    name: "Doc Mcp",
    description: "RAG on documentations for your agent",
    type: "Persona",
    price: 15.99,
    is_paid: true,
    file_url: "/mock-files/data-analyst-persona.json",
    creator_id: "user-1",
    creator_name: "Agents-MCP-Hackathon",
    likes: 21,
    downloads: 150,
    updated_at: "2024-06-10T10:00:00Z", // 13 days ago
    gradient_from: "from-red-500",
    gradient_to: "to-orange-500",
  },
  {
    id: "mock-2",
    name: "core OCR",
    description: "core ocr / docscope ocr / monkey ocr",
    type: "Prompt 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/brainstorming-prompts.json",
    creator_id: "user-2",
    creator_name: "prithiviMLmods",
    likes: 202,
    downloads: 500,
    updated_at: "2024-06-21T14:30:00Z", // 2 days ago
    gradient_from: "from-blue-500",
    gradient_to: "to-indigo-500",
  },
  {
    id: "mock-3",
    name: "FineWeb: decanting the web for the finest text data at scale",
    description: "Generate high-quality web text data for LLM training",
    type: "Workflow 템플릿",
    price: 29.99,
    is_paid: true,
    file_url: "/mock-files/agile-ai-workflow.json",
    creator_id: "user-3",
    creator_name: "HuggingFaceFW",
    likes: 974,
    downloads: 1200,
    updated_at: "2023-12-19T08:00:00Z", // Dec 19, 2023
    gradient_from: "from-pink-500",
    gradient_to: "to-red-500",
  },
  {
    id: "mock-4",
    name: "Housing Price Estimation",
    description: "Streamlit template space",
    type: "Output Format",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/meeting-minutes-format.json",
    creator_id: "user-4",
    creator_name: "mohamedanwarsha008",
    likes: 10,
    downloads: 50,
    updated_at: "2024-06-18T11:00:00Z", // 5 days ago
    gradient_from: "from-red-600",
    gradient_to: "to-red-800",
  },
  {
    id: "mock-5",
    name: "Computer Agent",
    description: "Interact with an agent to perform web-based tasks",
    type: "Persona",
    price: 22.5,
    is_paid: true,
    file_url: "/mock-files/policy-planning-mcp.json",
    creator_id: "user-1",
    creator_name: "smolagents",
    likes: 887,
    downloads: 2500,
    updated_at: "2024-05-14T09:00:00Z", // May 14
    gradient_from: "from-orange-500",
    gradient_to: "to-red-500",
  },
  {
    id: "mock-6",
    name: "Dots Demo",
    description: "Generate responses to text inputs",
    type: "평가표 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/project-evaluation.json",
    creator_id: "user-5",
    creator_name: "rednote-hilab",
    likes: 124,
    downloads: 300,
    updated_at: "2024-06-06T16:00:00Z", // 17 days ago
    gradient_from: "from-purple-500",
    gradient_to: "to-pink-500",
  },
  {
    id: "mock-7",
    name: "First Agent Template",
    description: "Fetch the current time in any timezone",
    type: "Prompt 템플릿",
    price: 12.0,
    is_paid: true,
    file_url: "/mock-files/customer-service-persona.json",
    creator_id: "user-2",
    creator_name: "agents-course",
    likes: 522,
    downloads: 1800,
    updated_at: "2024-05-06T13:00:00Z", // May 6
    gradient_from: "from-yellow-500",
    gradient_to: "to-orange-500",
  },
  {
    id: "mock-8",
    name: "Mistral-7B",
    description: "LLM, chatbot",
    type: "MCP 전략",
    price: 35.0,
    is_paid: true,
    file_url: "/mock-files/marketing-project.json",
    creator_id: "user-3",
    creator_name: "hysts",
    likes: 86,
    downloads: 700,
    updated_at: "2024-01-11T10:00:00Z", // Jan 11
    gradient_from: "from-purple-600",
    gradient_to: "to-indigo-600",
  },
  {
    id: "mock-9",
    name: "Seed1.5 VL",
    description: "Seed1.5-VL API Demo",
    type: "프로젝트 템플릿",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/weekly-report.json",
    creator_id: "user-4",
    creator_name: "ByteDance-Seed",
    likes: 131,
    downloads: 400,
    updated_at: "2024-06-12T10:00:00Z", // 11 days ago
    gradient_from: "from-green-500",
    gradient_to: "to-teal-500",
  },
  {
    id: "mock-10",
    name: "Autotrain Mcp",
    description: "Train ML models via MCP",
    type: "MCP 전략",
    price: 5.0,
    is_paid: true,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-5",
    creator_name: "burtenashaw",
    likes: 37,
    downloads: 100,
    updated_at: "2024-06-11T10:00:00Z", // 12 days ago
    gradient_from: "from-blue-400",
    gradient_to: "to-cyan-400",
  },
  {
    id: "mock-11",
    name: "SlideDeck AI",
    description: "Turn any document into interactive presentation",
    type: "산출물 템플릿",
    price: 10.0,
    is_paid: true,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-1",
    creator_name: "Agents-MCP-Hackathon",
    likes: 10,
    downloads: 80,
    updated_at: "2024-06-10T10:00:00Z", // 13 days ago
    gradient_from: "from-purple-400",
    gradient_to: "to-pink-400",
  },
  {
    id: "mock-12",
    name: "CourseCrafter",
    description: "Generate a personalized course plan",
    type: "회의 유형 / 포맷",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-2",
    creator_name: "CourseGenius",
    likes: 5,
    downloads: 30,
    updated_at: "2024-06-11T10:00:00Z", // 12 days ago
    gradient_from: "from-emerald-400",
    gradient_to: "to-green-400",
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
  const initialSort = searchParams.get("sort") || "relevance"

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState(initialSort)

  useEffect(() => {
    setSearchQuery(initialSearchQuery)
    setSelectedCategory(initialCategory)
    setSortBy(initialSort)
  }, [initialSearchQuery, initialCategory, initialSort])

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

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("sort", value)
    router.push(`/marketplace?${params.toString()}`)
  }

  const filteredAndSortedItems = useMemo(() => {
    const items = mockMarketplaceItems.filter((item) => {
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.creator_name && item.creator_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      const matchesCategory = selectedCategory === "All" || item.type === selectedCategory
      return matchesSearch && matchesCategory
    })

    // Apply sorting
    switch (sortBy) {
      case "likes":
        items.sort((a, b) => b.likes - a.likes)
        break
      case "downloads":
        items.sort((a, b) => b.downloads - a.downloads)
        break
      case "updated_at":
        items.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
        break
      case "relevance":
      default:
        // For mock data, relevance is just default order.
        // In a real app, this would involve more complex ranking.
        break
    }
    return items
  }, [searchQuery, selectedCategory, sortBy])

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50">Spaces</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">The AI App Directory</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="relative w-full max-w-3xl mx-auto">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <Input
          type="text"
          placeholder="Ask anything you want to do with AI"
          className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {/* Category Navigation */}
      <div className="flex justify-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {resourceCategories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            onClick={() => handleCategoryClick(category.value)}
            className="flex-shrink-0 px-4 py-2 rounded-full text-base"
          >
            {category.title}
          </Button>
        ))}
      </div>

      {/* Filter and Sort Controls */}
      <div className="flex justify-end items-center space-x-4">
        <Button variant="outline" className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span>Filters (0)</span>
        </Button>
        <Select onValueChange={handleSortChange} value={sortBy}>
          <SelectTrigger className="w-[180px]">
            <ArrowDownWideNarrow className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Sort: Relevance</SelectItem>
            <SelectItem value="likes">Sort: Likes</SelectItem>
            <SelectItem value="downloads">Sort: Downloads</SelectItem>
            <SelectItem value="updated_at">Sort: Updated Date</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Featured Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Featured</h2>
        <p className="text-gray-600 dark:text-gray-400">Curated top picks from this week</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAndSortedItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500 mt-8">
              선택한 카테고리 또는 검색어에 해당하는 리소스가 없습니다.
            </p>
          ) : (
            filteredAndSortedItems.map((item) => <MarketplaceItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>
    </div>
  )
}
