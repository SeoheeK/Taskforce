import { type NextRequest, NextResponse } from "next/server"

// Remove the AI SDK imports since we don't have API keys in demo
// import { generateText } from "ai"
// import { openai } from "@ai-sdk/openai"

const availableExperts = [
  {
    id: 1,
    name: "전략가 알렉스",
    role: "Strategic Planner",
    description: "비즈니스 전략과 계획 수립 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["전략", "기획", "분석", "시장조사", "비즈니스모델"],
  },
  {
    id: 2,
    name: "개발자 사라",
    role: "Technical Lead",
    description: "기술 구현과 아키텍처 설계 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["개발", "기술", "아키텍처", "프로그래밍", "시스템"],
  },
  {
    id: 3,
    name: "디자이너 마크",
    role: "UX Designer",
    description: "사용자 경험과 인터페이스 디자인 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["디자인", "UX", "UI", "사용자경험", "프로토타입"],
  },
  {
    id: 4,
    name: "분석가 리나",
    role: "Data Analyst",
    description: "데이터 분석과 인사이트 도출 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["데이터", "분석", "통계", "인사이트", "리포트"],
  },
  {
    id: 5,
    name: "마케터 제니",
    role: "Marketing Specialist",
    description: "마케팅 전략과 브랜딩 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["마케팅", "브랜딩", "광고", "홍보", "고객"],
  },
  {
    id: 6,
    name: "PM 톰",
    role: "Product Manager",
    description: "제품 기획과 프로젝트 관리 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["프로젝트관리", "제품기획", "일정관리", "팀관리", "로드맵"],
  },
  {
    id: 7,
    name: "QA 엘리",
    role: "Quality Assurance",
    description: "품질 보증과 테스트 전문가",
    avatar_url: "/placeholder.svg?height=40&width=40",
    keywords: ["품질보증", "테스트", "QA", "버그", "검증"],
  },
]

export async function POST(request: NextRequest) {
  const { title, description, background, challenges, template } = await request.json()

  try {
    // Since we don't have OpenAI API key in demo, use intelligent fallback
    const recommendations = getIntelligentRecommendations(title, description, template, background, challenges)

    return NextResponse.json(recommendations)
  } catch (error) {
    console.error("전문가 추천 실패:", error)

    // 오류 발생 시 기본 추천 반환
    const defaultRecommendations = getDefaultRecommendations(title, description, template)
    return NextResponse.json(defaultRecommendations)
  }
}

function getIntelligentRecommendations(
  title: string,
  description: string,
  template: string,
  background?: string,
  challenges?: string,
) {
  const text = `${title} ${description} ${background || ""} ${challenges || ""}`.toLowerCase()

  const recommendations = availableExperts.map((expert) => {
    let score = 0
    let reason = `${expert.role}의 전문성이 프로젝트에 도움이 될 것입니다.`
    let priority: "high" | "medium" | "low" = "medium"

    // 키워드 매칭으로 점수 계산
    expert.keywords.forEach((keyword) => {
      if (text.includes(keyword.toLowerCase())) {
        score += 25
      }
    })

    // 역할별 키워드 매칭
    const roleKeywords = {
      "Strategic Planner": ["전략", "기획", "계획", "분석", "비즈니스"],
      "Technical Lead": ["개발", "기술", "시스템", "앱", "웹", "프로그래밍"],
      "UX Designer": ["디자인", "UI", "UX", "사용자", "인터페이스"],
      "Data Analyst": ["데이터", "분석", "통계", "지표", "측정"],
      "Marketing Specialist": ["마케팅", "홍보", "브랜딩", "고객", "캠페인"],
      "Product Manager": ["관리", "프로젝트", "일정", "계획", "로드맵"],
      "Quality Assurance": ["품질", "테스트", "검증", "버그", "QA"],
    }

    const expertRoleKeywords = roleKeywords[expert.role as keyof typeof roleKeywords] || []
    expertRoleKeywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 20
      }
    })

    // 템플릿 기반 추천
    switch (template) {
      case "mobile-app":
        if (expert.role.includes("Technical") || expert.role.includes("Designer")) {
          score += 40
          priority = "high"
          reason = "모바일 앱 개발에 핵심적인 역할을 담당합니다."
        } else if (expert.role.includes("Product Manager")) {
          score += 30
          priority = "high"
          reason = "앱 개발 프로젝트 관리와 일정 조율이 필요합니다."
        }
        break
      case "marketing-campaign":
        if (expert.role.includes("Marketing")) {
          score += 50
          priority = "high"
          reason = "마케팅 캠페인의 핵심 전문가입니다."
        } else if (expert.role.includes("Analyst")) {
          score += 35
          priority = "high"
          reason = "캠페인 성과 측정과 데이터 분석이 필수입니다."
        }
        break
      case "business-strategy":
        if (expert.role.includes("Strategic")) {
          score += 50
          priority = "high"
          reason = "비즈니스 전략 수립의 핵심 전문가입니다."
        } else if (expert.role.includes("Analyst")) {
          score += 40
          priority = "high"
          reason = "전략 수립을 위한 데이터 분석이 필요합니다."
        }
        break
      case "product-launch":
        if (expert.role.includes("Product Manager")) {
          score += 45
          priority = "high"
          reason = "제품 출시 프로젝트의 총괄 관리가 필요합니다."
        } else if (expert.role.includes("Marketing")) {
          score += 40
          priority = "high"
          reason = "제품 출시를 위한 마케팅 전략이 필수입니다."
        }
        break
    }

    // 프로젝트 내용 기반 세부 매칭
    if (text.includes("헬스케어") || text.includes("의료")) {
      if (expert.role.includes("Technical") || expert.role.includes("Designer")) {
        score += 25
        reason = "헬스케어 앱 개발에 필요한 기술적 전문성을 제공합니다."
      }
    }

    // 우선순위 조정
    if (score >= 80) priority = "high"
    else if (score >= 50) priority = "medium"
    else priority = "low"

    return {
      ...expert,
      relevanceScore: Math.min(score, 100),
      reason,
      priority,
    }
  })

  return recommendations.filter((rec) => rec.relevanceScore >= 30).sort((a, b) => b.relevanceScore - a.relevanceScore)
}

function getDefaultRecommendations(title: string, description: string, template: string) {
  // Keep the existing function as fallback
  const text = `${title} ${description}`.toLowerCase()

  const recommendations = availableExperts.map((expert) => {
    let score = 40 // Base score
    let reason = `${expert.role}의 전문성이 프로젝트에 도움이 될 것입니다.`
    let priority: "high" | "medium" | "low" = "medium"

    // 키워드 매칭으로 점수 계산
    expert.keywords.forEach((keyword) => {
      if (text.includes(keyword)) {
        score += 20
      }
    })

    // 템플릿 기반 추천
    switch (template) {
      case "mobile-app":
        if (expert.role.includes("Technical") || expert.role.includes("Designer")) {
          score += 30
          priority = "high"
          reason = "모바일 앱 개발에 핵심적인 역할을 담당합니다."
        }
        break
      case "marketing-campaign":
        if (expert.role.includes("Marketing") || expert.role.includes("Analyst")) {
          score += 30
          priority = "high"
          reason = "마케팅 캠페인의 성공을 위해 필수적입니다."
        }
        break
      case "business-strategy":
        if (expert.role.includes("Strategic") || expert.role.includes("Analyst")) {
          score += 30
          priority = "high"
          reason = "비즈니스 전략 수립의 핵심 전문가입니다."
        }
        break
    }

    // 우선순위 조정
    if (score >= 70) priority = "high"
    else if (score >= 40) priority = "medium"
    else priority = "low"

    return {
      ...expert,
      relevanceScore: Math.min(score, 100),
      reason,
      priority,
    }
  })

  return recommendations.filter((rec) => rec.relevanceScore >= 30).sort((a, b) => b.relevanceScore - a.relevanceScore)
}
