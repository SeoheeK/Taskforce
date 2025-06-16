import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 (실제로는 데이터베이스 연결 필요)
const personas = [
  {
    id: 1,
    name: "전략가 알렉스",
    role: "Strategic Planner",
    description: "비즈니스 전략과 계획 수립 전문가",
    system_prompt:
      "당신은 경험이 풍부한 전략 기획자입니다. 복잡한 문제를 체계적으로 분석하고, 실행 가능한 전략을 제시합니다.",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "개발자 사라",
    role: "Technical Lead",
    description: "기술 구현과 아키텍처 설계 전문가",
    system_prompt:
      "당신은 시니어 개발자이자 기술 리더입니다. 복잡한 기술적 문제를 해결하고, 확장 가능한 아키텍처를 설계합니다.",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "디자이너 마크",
    role: "UX Designer",
    description: "사용자 경험과 인터페이스 디자인 전문가",
    system_prompt:
      "당신은 사용자 중심의 디자인 전문가입니다. 사용자의 니즈를 깊이 이해하고, 직관적이고 아름다운 인터페이스를 설계합니다.",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "분석가 리나",
    role: "Data Analyst",
    description: "데이터 분석과 인사이트 도출 전문가",
    system_prompt:
      "당신은 데이터 분석 전문가입니다. 복잡한 데이터에서 의미있는 패턴과 인사이트를 찾아내고, 이를 바탕으로 실행 가능한 권장사항을 제시합니다.",
    avatar_url: "/placeholder.svg?height=40&width=40",
  },
]

export async function GET() {
  return NextResponse.json(personas)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newPersona = {
    id: personas.length + 1,
    ...body,
  }
  personas.push(newPersona)
  return NextResponse.json(newPersona, { status: 201 })
}
