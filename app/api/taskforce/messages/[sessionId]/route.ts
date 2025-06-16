import { type NextRequest, NextResponse } from "next/server"

// 임시 메시지 저장소 (실제로는 데이터베이스 사용)
const messages: any[] = []

export async function GET(request: NextRequest, { params }: { params: { sessionId: string } }) {
  const sessionId = Number.parseInt(params.sessionId)
  const sessionMessages = messages.filter((m) => m.session_id === sessionId)

  // 페르소나 정보를 포함한 메시지 반환
  const messagesWithPersona = sessionMessages.map((msg) => ({
    ...msg,
    persona: {
      id: msg.persona_id,
      name: msg.persona_name,
      role: msg.persona_role,
      avatar_url: msg.persona_avatar,
    },
  }))

  return NextResponse.json(messagesWithPersona)
}
