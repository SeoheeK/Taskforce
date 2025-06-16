import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 (실제로는 데이터베이스 연결 필요)
const deliverables = [
  {
    id: 1,
    sessionId: 1,
    title: "모바일 앱 기획서",
    description: "새로운 헬스케어 모바일 앱의 전체 기획 문서",
    fileName: "mobile_app_plan.pdf",
    filePath: "/files/mobile_app_plan.pdf",
    fileSize: 2048576,
    fileType: "pdf",
    category: "document",
    status: "final",
    version: "2.1",
    tags: ["기획서", "모바일앱", "헬스케어"],
    createdByPersonaId: 1,
    createdAt: "2024-01-10T09:00:00Z",
    updatedAt: "2024-01-15T16:30:00Z",
  },
  // ... 더 많은 결과물 데이터
]

const sessions = [
  {
    id: 1,
    title: "모바일 앱 기획 및 전략 수립",
    status: "완료",
    completedAt: "2024-01-15",
    totalDeliverables: 5,
    participants: 4,
  },
  {
    id: 2,
    title: "마케팅 캠페인 최적화",
    status: "완료",
    completedAt: "2024-01-12",
    totalDeliverables: 3,
    participants: 3,
  },
  {
    id: 3,
    title: "사용자 경험 개선 프로젝트",
    status: "완료",
    completedAt: "2024-01-10",
    totalDeliverables: 4,
    participants: 5,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get("sessionId")

  if (sessionId) {
    // 특정 세션의 결과물 반환
    const sessionDeliverables = deliverables.filter((d) => d.sessionId === Number.parseInt(sessionId))
    return NextResponse.json(sessionDeliverables)
  } else {
    // 모든 완료된 세션 반환
    return NextResponse.json(sessions)
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newDeliverable = {
    id: deliverables.length + 1,
    ...body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
  deliverables.push(newDeliverable)
  return NextResponse.json(newDeliverable, { status: 201 })
}
