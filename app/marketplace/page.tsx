"use client"

import type React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import {
  Search,
  Filter,
  ArrowDownWideNarrow,
  Flame,
  ChevronLeft,
  ChevronRight,
  Globe,
  Code,
  ImageIcon,
  Video,
  Languages,
  Volume2,
  Box,
  Scan,
  Text,
  PenTool,
  FileQuestionIcon as Question,
  BarChart,
  Mic,
} from "lucide-react"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect, useMemo } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ko } from "date-fns/locale"

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
  status?: string
  status_icon?: React.ElementType
}

// Mock data for UI development and testing
const mockMarketplaceItems: MarketplaceItem[] = [
  {
    id: "mock-1",
    name: "Hunyuan3D-2.1",
    description: "Image-to-3D Generation",
    type: "Image Generation",
    price: 15.99,
    is_paid: true,
    file_url: "/mock-files/data-analyst-persona.json",
    creator_id: "user-1",
    creator_name: "tencent",
    likes: 378,
    downloads: 150,
    updated_at: "2024-06-20T10:00:00Z", // 3 days ago
    gradient_from: "from-red-500",
    gradient_to: "to-orange-500",
    status: "Running on ZERO",
    status_icon: Globe,
  },
  {
    id: "mock-2",
    name: "PartPacker",
    description: "Part-level image-to-3D generation.",
    type: "Video Generation",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/brainstorming-prompts.json",
    creator_id: "user-2",
    creator_name: "nvidia",
    likes: 189,
    downloads: 500,
    updated_at: "2024-06-18T14:30:00Z", // 5 days ago
    gradient_from: "from-blue-500",
    gradient_to: "to-indigo-500",
    status: "Running on ZERO",
    status_icon: Globe,
  },
  {
    id: "mock-3",
    name: "Pixel3dmm [Image Mode]",
    description: "Versatile Single-Image 3D Face Reconstruction",
    type: "3D Modeling",
    price: 29.99,
    is_paid: true,
    file_url: "/mock-files/agile-ai-workflow.json",
    creator_id: "user-3",
    creator_name: "alexnasa",
    likes: 66,
    downloads: 1200,
    updated_at: "2024-06-19T08:00:00Z", // 4 days ago
    gradient_from: "from-green-500",
    gradient_to: "to-teal-500",
    status: "Running on ZERO",
    status_icon: Globe,
  },
  {
    id: "mock-4",
    name: "NAG Wan2-1-fast",
    description: "Demo of Normalized Attention Guidance for 4 steps Wan2.1",
    type: "Text Generation",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/meeting-minutes-format.json",
    creator_id: "user-4",
    creator_name: "ChenDY",
    likes: 60,
    downloads: 50,
    updated_at: "2024-06-09T11:00:00Z", // 14 days ago
    gradient_from: "from-emerald-600",
    gradient_to: "to-green-600",
    status: "Running",
  },
  {
    id: "mock-5",
    name: "MiniMax M1",
    description: "Generate code from text prompts",
    type: "Code Generation",
    price: 22.5,
    is_paid: true,
    file_url: "/mock-files/policy-planning-mcp.json",
    creator_id: "user-1",
    creator_name: "MiniMaxAI",
    likes: 244,
    downloads: 2500,
    updated_at: "2024-06-23T06:00:00Z", // about 18 hours ago
    gradient_from: "from-purple-500",
    gradient_to: "to-pink-500",
    status: "Running",
  },
  {
    id: "mock-6",
    name: "ScouterAI",
    description: "The agent using over 9000 vision models from the HF Hub.",
    type: "Object Detection",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/project-evaluation.json",
    creator_id: "user-5",
    creator_name: "Agents-MCP-Hackathon",
    likes: 58,
    downloads: 300,
    updated_at: "2024-06-17T16:00:00Z", // 6 days ago
    gradient_from: "from-green-600",
    gradient_to: "to-teal-600",
    status: "Running",
  },
  {
    id: "mock-7",
    name: "Nanonets OCR",
    description: "Demo for Nanonets-OCR",
    type: "Text Analysis",
    price: 12.0,
    is_paid: true,
    file_url: "/mock-files/customer-service-persona.json",
    creator_id: "user-2",
    creator_name: "MohamedRashad",
    likes: 59,
    downloads: 1800,
    updated_at: "2024-06-18T13:00:00Z", // 5 days ago
    gradient_from: "from-cyan-500",
    gradient_to: "to-blue-500",
    status: "Running on ZERO",
    status_icon: Globe,
  },
  {
    id: "mock-8",
    name: "Sparc3D",
    description: "Next-Gen High-Resolution 3D Model Generation",
    type: "3D Modeling",
    price: 35.0,
    is_paid: true,
    file_url: "/mock-files/marketing-project.json",
    creator_id: "user-3",
    creator_name: "1lcve21",
    likes: 678,
    downloads: 700,
    updated_at: "2024-06-22T10:00:00Z", // 1 day ago
    gradient_from: "from-orange-500",
    gradient_to: "to-red-500",
    status: "Running",
  },
  {
    id: "mock-9",
    name: "DeepSite v2",
    description: "Generate any application with DeepSeek",
    type: "Code Generation",
    price: 0,
    is_paid: false,
    file_url: "/mock-files/weekly-report.json",
    creator_id: "user-4",
    creator_name: "enzostvs",
    likes: 8480, // 8.48k
    downloads: 400,
    updated_at: "2024-06-20T10:00:00Z", // 3 days ago
    gradient_from: "from-blue-600",
    gradient_to: "to-indigo-600",
    status: "Running",
  },
  {
    id: "mock-10",
    name: "HunYuan3D-2.1",
    description: "Image-to-3D Generation",
    type: "Image Generation",
    price: 5.0,
    is_paid: true,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-5",
    creator_name: "tencent",
    likes: 378,
    downloads: 100,
    updated_at: "2024-06-20T10:00:00Z", // 3 days ago
    gradient_from: "from-red-500",
    gradient_to: "to-orange-500",
    status: "Running on ZERO",
    status_icon: Globe,
  },
  {
    id: "mock-11",
    name: "MiniMax M1",
    description: "Generate code from text prompts",
    type: "Code Generation",
    price: 10.0,
    is_paid: true,
    file_url: "/mock-files/online-meeting-format.json",
    creator_id: "user-1",
    creator_name: "MiniMaxAI",
    likes: 244,
    downloads: 80,
    updated_at: "2024-06-23T06:00:00Z", // about 18 hours ago
    gradient_from: "from-purple-500",
    gradient_to: "to-pink-500",
    status: "Running",
  },
]

// Resource categories for filtering
const resourceCategories = [
  { title: "Image Generation", value: "Image Generation", icon: ImageIcon },
  { title: "Video Generation", value: "Video Generation", icon: Video },
  { title: "Text Generation", value: "Text Generation", icon: Text },
  { title: "Language Translation", value: "Language Translation", icon: Languages },
  { title: "Speech Synthesis", value: "Speech Synthesis", icon: Volume2 },
  { title: "3D Modeling", value: "3D Modeling", icon: Box },
  { title: "Object Detection", value: "Object Detection", icon: Scan },
  { title: "Text Analysis", value: "Text Analysis", icon: Text },
  { title: "Image Editing", value: "Image Editing", icon: PenTool },
  { title: "Code Generation", value: "Code Generation", icon: Code },
  { title: "Question Answering", value: "Question Answering", icon: Question },
  { title: "Data Visualization", value: "Data Visualization", icon: BarChart },
  { title: "Voice Chat", value: "Voice Chat", icon: Mic },
]

export default function MarketplaceHome() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialSearchQuery = searchParams.get("q") || ""
  const initialCategory = searchParams.get("type") || "" // Default to empty for "All"
  const initialSort = searchParams.get("sort") || "relevance"

  const [searchQuery, setSearchQuery] = useState(initialSearchQuery)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState(initialSort)
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 23)) // June 23, 2025

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
    if (category) {
      // Only set if not empty string (which represents "All")
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

  const handleDateChange = (direction: "prev" | "next") => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate)
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7) // Go back a week
      } else {
        newDate.setDate(newDate.getDate() + 7) // Go forward a week
      }
      return newDate
    })
  }

  const filteredAndSortedItems = useMemo(() => {
    const items = mockMarketplaceItems.filter((item) => {
      const matchesSearch = searchQuery
        ? item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.creator_name && item.creator_name.toLowerCase().includes(searchQuery.toLowerCase()))
        : true
      const matchesCategory = !selectedCategory || item.type === selectedCategory // Empty string for "All"
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

  // For "Spaces of the week" section, just take a few items for demonstration
  const spacesOfTheWeekItems = useMemo(() => {
    // Example: take the first 4 items, or filter by a specific date range if mock data supported it
    return filteredAndSortedItems.slice(0, 4)
  }, [filteredAndSortedItems])

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-50">Spaces</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">The AI App Directory</p>
      </div>

      {/* Top Category Navigation */}
      <div className="flex justify-center space-x-6 overflow-x-auto pb-2 scrollbar-hide">
        {resourceCategories.map((category) => {
          const Icon = category.icon
          return (
            <Button
              key={category.value}
              variant="ghost"
              onClick={() => handleCategoryClick(category.value)}
              className={`flex flex-col items-center space-y-1 text-sm ${
                selectedCategory === category.value ? "text-blue-600 font-semibold" : "text-gray-600"
              }`}
            >
              {Icon && <Icon className="h-6 w-6" />}
              <span>{category.title}</span>
            </Button>
          )
        })}
      </div>

      {/* Date Navigation and Filter/Sort Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Spaces of the week / Date Navigation */}
        <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
          <Flame className="h-5 w-5 text-orange-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">Spaces of the week</span>
          <Button variant="ghost" size="icon" onClick={() => handleDateChange("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">{format(currentDate, "dd MMM yyyy", { locale: ko })}</span>
          <Button variant="ghost" size="icon" onClick={() => handleDateChange("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter and Sort Controls */}
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          <div className="relative flex-grow sm:flex-grow-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Filter by name"
              className="w-full pl-9 pr-4 py-2 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch(e)
              }}
            />
          </div>
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
      </div>

      {/* Spaces of the week Section */}
      <section className="space-y-4">
        <div className="flex items-center space-x-2">
          <Flame className="h-5 w-5 text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Spaces of the week</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {spacesOfTheWeekItems.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">이번 주에 해당하는 스페이스가 없습니다.</p>
          ) : (
            spacesOfTheWeekItems.map((item) => <MarketplaceItemCard key={item.id} item={item} />)
          )}
        </div>
      </section>

      {/* All running apps, trending first Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">All running apps, trending first</h2>
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
