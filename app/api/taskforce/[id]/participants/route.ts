import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 저장소
const taskforceSessions: any[] = [
  {
    id: 1,
    title: "모바일 앱 기획 및 전략 수립",
    participants: [
      { id: 1, name: "전략가 알렉스", role: "Strategic Planner" },
      { id: 2, name: "개발자 사라", role: "Technical Lead" },
      { id: 3, name: "디자이너 마크", role: "UX Designer" },
      { id: 4, name: "분석가 리나", role: "Data Analyst" },
    ],
  },
]

const allPersonas = [
  { id: 1, name: "전략가 알렉스", role: "Strategic Planner", description: "비즈니스 전략과 계획 수립 전문가" },
  { id: 2, name: "개발자 사라", role: "Technical Lead", description: "기술 구현과 아키텍처 설계 전문가" },
  { id: 3, name: "디자이너 마크", role: "UX Designer", description: "사용자 경험과 인터페이스 디자인 전문가" },
  { id: 4, name: "분석가 리나", role: "Data Analyst", description: "데이터 분석과 인사이트 도출 전문가" },
  { id: 5, name: "마케터 제니", role: "Marketing Specialist", description: "마케팅 전략과 브랜딩 전문가" },
  { id: 6, name: "PM 톰", role: "Product Manager", description: "제품 기획과 프로젝트 관리 전문가" },
  { id: 7, name: "QA 엘리", role: "Quality Assurance", description: "품질 보증과 테스트 전문가" },
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = Number.parseInt(params.id)
  const { personaIds } = await request.json()

  try {
    const session = taskforceSessions.find((s) => s.id === sessionId)
    if (!session) {
      return NextResponse.json({ error: "세션을 찾을 수 없습니다" }, { status: 404 })
    }

    // 새로운 참여자들을 추가
    const newParticipants = allPersonas.filter((p) => personaIds.includes(p.id))

    newParticipants.forEach((persona) => {
      if (!session.participants.find((p: any) => p.id === persona.id)) {
        session.participants.push({
          ...persona,
          status: "active",
          currentTask: "새로 참여함",
          joinedAt: new Date().toISOString(),
        })
      }
    })

    // 새로운 참여자들에게 환영 메시지 생성
    await generateWelcomeMessages(sessionId, newParticipants)

    return NextResponse.json({
      success: true,
      addedParticipants: newParticipants.length,
    })
  } catch (error) {
    console.error("참여자 추가 실패:", error)
    return NextResponse.json({ error: "참여자 추가 실패" }, { status: 500 })
  }
}

async function generateWelcomeMessages(sessionId: number, newParticipants: any[]) {
  // 실제로는 AI SDK를 사용해서 환영 메시지 생성
  // 여기서는 시뮬레이션
  for (const participant of newParticipants) {
    console.log(`${participant.name}이(가) 태스크포스에 참여했습니다.`)

    // 실제 구현에서는 여기서 AI 메시지를 생성하고 저장
    setTimeout(() => {
      console.log(
        `${participant.name}: 안녕하세요! 새로 참여하게 된 ${participant.name}입니다. 어떤 도움이 필요한지 알려주세요.`,
      )
    }, 2000)
  }
}
