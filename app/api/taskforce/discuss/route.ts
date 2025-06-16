import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const messages: any[] = []

export async function POST(request: NextRequest) {
  const { sessionId, problem, personas } = await request.json()

  try {
    // 각 페르소나가 순차적으로 의견을 제시
    for (const persona of personas) {
      const { text } = await generateText({
        model: openai("gpt-4o-mini"),
        system: persona.system_prompt + ` 당신은 "${persona.name}"이라는 ${persona.role} 역할을 맡고 있습니다.`,
        prompt: `다음 문제에 대해 당신의 전문 분야 관점에서 의견을 제시해주세요: ${problem}
        
        이전 대화 내용을 참고하여 건설적인 의견을 제시하되, 200자 이내로 간결하게 작성해주세요.
        
        이전 대화:
        ${messages
          .filter((m) => m.session_id === sessionId)
          .map((m) => `${m.persona_name}: ${m.content}`)
          .join("\n")}`,
      })

      const newMessage = {
        id: messages.length + 1,
        session_id: sessionId,
        persona_id: persona.id,
        persona_name: persona.name,
        persona_role: persona.role,
        persona_avatar: persona.avatar_url,
        content: text,
        created_at: new Date().toISOString(),
      }

      messages.push(newMessage)

      // 각 메시지 사이에 약간의 지연
      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("토론 생성 실패:", error)
    return NextResponse.json({ error: "토론 생성 실패" }, { status: 500 })
  }
}
