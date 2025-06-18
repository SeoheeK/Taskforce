import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"
import {
  Bot,
  MessageSquare,
  Zap,
  FileText,
  Briefcase,
  GitBranch,
  ClipboardList,
  FolderIcon as FolderTemplate,
  FileOutput,
  Users,
  Share2,
} from "lucide-react"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string // This 'type' should match the 'title' in resourceCategories.items
  price: number
  is_paid: boolean
  file_url?: string
  creator_id: string
}

async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  const res = await fetch("/api/marketplace/items", {
    cache: "no-store", // Ensure fresh data
  })
  if (!res.ok) {
    throw new Error("Failed to fetch marketplace items")
  }
  return res.json()
}

// Re-using resource categories structure for consistent display
const resourceCategories = [
  // 🤖 AI 에이전트 설정
  {
    id: 1,
    category: "AI 에이전트 설정",
    categoryIcon: Bot,
    categoryColor: "from-blue-500 to-cyan-500",
    items: [
      {
        id: 11,
        title: "Persona",
        description: "이름, 역할, 말투, 전문분야, 제약조건 등 AI Agent 성격 설정",
        href: "/resource/personas",
        icon: Bot,
        color: "from-blue-500 to-cyan-500",
      },
      {
        id: 12,
        title: "Prompt 템플릿",
        description: "역할/상황별 프롬프트 조각 모듈화 (기획 요청, 반론 유도 등)",
        href: "/resource/prompt-templates",
        icon: MessageSquare,
        color: "from-purple-500 to-pink-500",
      },
      {
        id: 13,
        title: "MCP 전략",
        description: "토론 및 의사결정 흐름 제어 규칙 (round-robin, voting 등)",
        href: "/resource/mcp-strategy",
        icon: Zap,
        color: "from-orange-500 to-red-500",
      },
      {
        id: 14,
        title: "Output Format",
        description: "AI가 출력할 문서 포맷 정의 (예: 회의록, 요약문, 테이블)",
        href: "/resource/output-formats",
        icon: FileText,
        color: "from-green-500 to-teal-500",
      },
    ],
  },
  // 👩‍💼 PM 도구 (운영/관리자용)
  {
    id: 2,
    category: "Project Management Tool",
    categoryIcon: Briefcase,
    categoryColor: "from-indigo-500 to-purple-500",
    items: [
      {
        id: 21,
        title: "Workflow 템플릿",
        description: "특정 산업/분야별 업무 전개 흐름 템플릿 (예: 정책기획, 시공 프로세스 등)",
        href: "/resource/workflow-templates",
        icon: GitBranch,
        color: "from-indigo-500 to-blue-500",
      },
      {
        id: 22,
        title: "평가표 템플릿",
        description: "AI Task 결과물 평가 항목 세트 (정확성, 창의성, 실현가능성 등)",
        href: "/resource/evaluation-templates",
        icon: ClipboardList,
        color: "from-yellow-500 to-orange-500",
      },
      {
        id: 23,
        title: "프로젝트 템플릿",
        description: "과거 프로젝트의 세팅 값(규칙/참여페르소나/MCP 등)을 유사프로젝트에 활용할 수 있도록 템플릿화",
        href: "/resource/project-templates",
        icon: FolderTemplate,
        color: "from-pink-500 to-rose-500",
      },
      {
        id: 24,
        title: "산출물 템플릿",
        description: "보고서/계획서 등의 정형 문서 구조 (Markdown / Table 등)",
        href: "/resource/deliverable-templates",
        icon: FileOutput,
        color: "from-emerald-500 to-green-500",
      },
      {
        id: 25,
        title: "회의 유형 / 포맷",
        description: "주제 발제형, 브레인스토밍형, 정리형 등 회의 운영 방식 정의",
        href: "/resource/meeting-formats",
        icon: Users,
        color: "from-cyan-500 to-blue-500",
      },
    ],
  },
]

export default async function MarketplaceHome() {
  const items = await getMarketplaceItems()

  // Group items by their 'type'
  const categorizedItems: { [key: string]: MarketplaceItem[] } = {}
  items.forEach((item) => {
    if (!categorizedItems[item.type]) {
      categorizedItems[item.type] = []
    }
    categorizedItems[item.type].push(item)
  })

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
          <p className="text-gray-600 mt-2">AI 리소스들을 탐색하고 공유하세요</p>
        </div>
        <Link href="/marketplace/upload">
          <Button>
            <Share2 className="h-4 w-4 mr-2" />
            리소스 업로드
          </Button>
        </Link>
      </div>

      {/* Resource Categories Sections */}
      {resourceCategories.map((category) => {
        const categoryItems = category.items.flatMap((resourceType) => {
          return categorizedItems[resourceType.title] || []
        })

        if (categoryItems.length === 0) {
          return null // Don't render category if no items exist for it
        }

        return (
          <div key={category.id} className="space-y-4">
            {/* Category Header */}
            <div className="flex items-center space-x-3 pb-2 border-b border-gray-200">
              <div
                className={`h-8 w-8 bg-gradient-to-r ${category.categoryColor} rounded-lg flex items-center justify-center`}
              >
                <category.categoryIcon className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">{category.category}</h2>
              <div className="text-sm text-gray-500">({categoryItems.length}개)</div>
            </div>

            {/* Category Items */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {categoryItems.map((item) => (
                <MarketplaceItemCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        )
      })}

      {/* Message if no items at all */}
      {items.length === 0 && (
        <p className="col-span-full text-center text-gray-500 mt-8">
          마켓플레이스에 리소스가 없습니다. 첫 번째 리소스를 업로드하세요!
        </p>
      )}
    </div>
  )
}
