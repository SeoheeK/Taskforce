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

// Mock data for UI development and testing
async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  return [
    {
      id: "mock-1",
      name: "데이터 분석 페르소나",
      description: "복잡한 데이터를 분석하고 통찰력을 제공하는 전문가 페르소나입니다.",
      type: "Persona",
      price: 15.99,
      is_paid: true,
      file_url: "/mock-files/data-analyst-persona.json",
      creator_id: "user-1",
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
    },
  ]
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
