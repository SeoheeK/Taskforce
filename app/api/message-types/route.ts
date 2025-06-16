import { type NextRequest, NextResponse } from "next/server"

// 임시 데이터 (실제로는 데이터베이스 연결 필요)
const messageTypes = [
  {
    id: 1,
    name: "Proposal",
    description: "새로운 아이디어나 해결책을 제안하는 메시지",
    category: "task",
    requires_response: true,
    priority_level: "medium",
    use_cases: ["새로운 아이디어 제안", "기능 개선 제안", "전략 제안"],
    example_content: "저는 사용자 경험을 개선하기 위해 다음과 같은 기능을 제안합니다...",
    response_timeout: 48,
    is_system_message: false,
  },
  {
    id: 2,
    name: "Response",
    description: "다른 Agent의 메시지에 대한 응답",
    category: "communication",
    requires_response: false,
    priority_level: "medium",
    use_cases: ["제안에 대한 피드백", "질문에 대한 답변", "의견 표명"],
    example_content: "제안해주신 아이디어에 대해 다음과 같이 생각합니다...",
    response_timeout: 24,
    is_system_message: false,
  },
  {
    id: 3,
    name: "Feedback",
    description: "작업 결과나 아이디어에 대한 피드백",
    category: "feedback",
    requires_response: false,
    priority_level: "low",
    use_cases: ["작업 결과 평가", "개선사항 제안", "칭찬과 격려"],
    example_content: "작업 결과를 검토한 결과, 다음 부분에서 개선이 필요합니다...",
    response_timeout: 72,
    is_system_message: false,
  },
  {
    id: 4,
    name: "Report",
    description: "작업 진행 상황이나 결과를 보고하는 메시지",
    category: "task",
    requires_response: false,
    priority_level: "high",
    use_cases: ["진행 상황 보고", "완료 보고", "문제 상황 보고"],
    example_content: "할당받은 작업의 현재 진행 상황을 보고드립니다...",
    response_timeout: 12,
    is_system_message: false,
  },
  {
    id: 5,
    name: "Question",
    description: "정보나 의견을 요청하는 질문 메시지",
    category: "communication",
    requires_response: true,
    priority_level: "medium",
    use_cases: ["정보 요청", "의견 수렴", "확인 요청"],
    example_content: "이 부분에 대해 더 자세한 정보가 필요합니다. 설명해주실 수 있나요?",
    response_timeout: 24,
    is_system_message: false,
  },
  {
    id: 6,
    name: "Assignment",
    description: "새로운 작업을 할당하는 메시지",
    category: "task",
    requires_response: true,
    priority_level: "high",
    use_cases: ["작업 할당", "역할 분담", "책임 부여"],
    example_content: "다음 작업을 담당해주시기 바랍니다...",
    response_timeout: 6,
    is_system_message: false,
  },
  {
    id: 7,
    name: "System Notification",
    description: "시스템에서 자동으로 생성되는 알림 메시지",
    category: "system",
    requires_response: false,
    priority_level: "low",
    use_cases: ["상태 변경 알림", "마감일 알림", "시스템 업데이트"],
    example_content: "프로젝트 상태가 '진행 중'에서 '검토 중'으로 변경되었습니다.",
    response_timeout: 0,
    is_system_message: true,
  },
]

export async function GET() {
  return NextResponse.json(messageTypes)
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newMessageType = {
    id: messageTypes.length + 1,
    ...body,
  }
  messageTypes.push(newMessageType)
  return NextResponse.json(newMessageType, { status: 201 })
}
