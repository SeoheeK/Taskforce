import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// 임시 작업 저장소 (실제로는 데이터베이스 사용)
const tasks: any[] = []

export async function POST(request: NextRequest, { params }: { params: { sessionId: string; taskId: string } }) {
  const { action } = await request.json()
  const taskId = Number.parseInt(params.taskId)
  const sessionId = Number.parseInt(params.sessionId)

  try {
    const task = tasks.find((t) => t.id === taskId && t.sessionId === sessionId)
    if (!task) {
      return NextResponse.json({ error: "작업을 찾을 수 없습니다" }, { status: 404 })
    }

    switch (action) {
      case "pause":
        task.status = "일시정지"
        task.lastUpdate = "일시정지됨"
        await generateActionResponse(task, "작업을 일시정지했습니다.")
        break

      case "resume":
        task.status = "진행중"
        task.lastUpdate = "재개됨"
        await generateActionResponse(task, "작업을 재개했습니다.")
        break

      case "complete":
        task.status = "완료"
        task.progress = 100
        task.completedAt = new Date().toISOString()
        task.lastUpdate = "완료됨"
        await generateActionResponse(task, "작업을 완료했습니다.")
        break

      default:
        return NextResponse.json({ error: "알 수 없는 액션입니다" }, { status: 400 })
    }

    return NextResponse.json({ success: true, task })
  } catch (error) {
    console.error("작업 액션 처리 실패:", error)
    return NextResponse.json({ error: "작업 액션 처리 실패" }, { status: 500 })
  }
}

async function generateActionResponse(task: any, actionMessage: string) {
  try {
    const assigneeInfo = getAssigneeInfo(task.assigneeId)
    if (!assigneeInfo) return

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `당신은 ${assigneeInfo.name}이라는 ${assigneeInfo.role}입니다.`,
      prompt: `작업 "${task.title}"에 대해 ${actionMessage}

현재 상황에 대한 간단한 코멘트를 100자 이내로 작성해주세요.`,
    })

    console.log(`${assigneeInfo.name}: ${text}`)

    // 실제로는 메시지를 데이터베이스에 저장
  } catch (error) {
    console.error("액션 응답 생성 실패:", error)
  }
}

function getAssigneeInfo(assigneeId: number) {
  const personas = [
    { id: 1, name: "전략가 알렉스", role: "Strategic Planner" },
    { id: 2, name: "개발자 사라", role: "Technical Lead" },
    { id: 3, name: "디자이너 마크", role: "UX Designer" },
    { id: 4, name: "분석가 리나", role: "Data Analyst" },
    { id: 5, name: "마케터 제니", role: "Marketing Specialist" },
    { id: 6, name: "PM 톰", role: "Product Manager" },
    { id: 7, name: "QA 엘리", role: "Quality Assurance" },
  ]

  return personas.find((p) => p.id === assigneeId)
}
