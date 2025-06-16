import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

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
    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `당신은 프로젝트 분석 전문가입니다. 주어진 프로젝트 정보를 분석하여 필요한 전문가들을 추천해주세요.

사용 가능한 전문가들:
${availableExperts
  .map((expert) => `- ${expert.name} (${expert.role}): ${expert.description} [키워드: ${expert.keywords.join(", ")}]`)
  .join("\n")}

각 전문가에 대해 다음 정보를 JSON 배열로 반환해주세요:
- id: 전문가 ID
- relevanceScore: 프로젝트와의 적합도 (0-100)
- reason: 왜 이 전문가가 필요한지 구체적인 이유 (100자 이내)
- priority: "high" (필수), "medium" (권장), "low" (선택) 중 하나

적합도가 30 이상인 전문가만 포함하고, 적합도 순으로 정렬해주세요.`,

      prompt: `프로젝트 정보:
제목: ${title}
설명: ${description}
배경: ${background}
도전과제: ${challenges || "없음"}
템플릿: ${template}

이 프로젝트에 필요한 전문가들을 분석하고 추천해주세요.`,
    })

    // AI 응답을 파싱하여 JSON으로 변환
    let recommendations
    try {
      recommendations = JSON.parse(text)
    } catch (parseError) {
      // AI 응답이 JSON이 아닌 경우 기본 추천 로직 사용
      recommendations = getDefaultRecommendations(title, description, template)
    }

    // 전문가 정보와 결합
    const enrichedRecommendations = recommendations
      .map((rec: any) => {
        const expert = availableExperts.find((e) => e.id === rec.id)
        if (!expert) return null

        return {
          ...expert,
          relevanceScore: rec.relevanceScore,
          reason: rec.reason,
          priority: rec.priority,
        }
      })
      .filter(Boolean)
      .sort((a: any, b: any) => b.relevanceScore - a.relevanceScore)

    return NextResponse.json(enrichedRecommendations)
  } catch (error) {
    console.error("전문가 추천 실패:", error)

    // 오류 발생 시 기본 추천 반환
    const defaultRecommendations = getDefaultRecommendations(title, description, template)
    return NextResponse.json(defaultRecommendations)
  }
}

function getDefaultRecommendations(title: string, description: string, template: string) {
  const text = `${title} ${description}`.toLowerCase()

  const recommendations = availableExperts.map((expert) => {
    let score = 0
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
