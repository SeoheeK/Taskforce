import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// 임시 작업 저장소
const tasks: any[] = []

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = Number.parseInt(params.id)
  const taskData = await request.json()

  try {
    const newTask = {
      id: tasks.length + 1,
      sessionId,
      title: taskData.title,
      description: taskData.description,
      assigneeId: Number.parseInt(taskData.assigneeId),
      priority: taskData.priority,
      deadline: taskData.deadline,
      estimatedHours: taskData.estimatedHours,
      status: "할당됨",
      progress: 0,
      createdAt: new Date().toISOString(),
      startedAt: null,
      completedAt: null,
    }

    tasks.push(newTask)

    // AI에게 새로운 작업에 대한 초기 응답 생성
    await generateTaskResponse(newTask)

    return NextResponse.json(newTask, { status: 201 })
  } catch (error) {
    console.error("작업 할당 실패:", error)
    return NextResponse.json({ error: "작업 할당 실패" }, { status: 500 })
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const sessionId = Number.parseInt(params.id)
  const sessionTasks = tasks.filter((t) => t.sessionId === sessionId)
  return NextResponse.json(sessionTasks)
}

async function generateTaskResponse(task: any) {
  try {
    // 담당자 정보 가져오기 (실제로는 DB에서)
    const assigneeInfo = getAssigneeInfo(task.assigneeId)

    if (!assigneeInfo) return

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      system: `당신은 ${assigneeInfo.name}이라는 ${assigneeInfo.role}입니다. 새로운 작업이 할당되었습니다.`,
      prompt: `새로운 작업이 할당되었습니다:

작업 제목: ${task.title}
작업 설명: ${task.description}
우선순위: ${task.priority}
마감일: ${task.deadline}
예상 소요 시간: ${task.estimatedHours}

이 작업에 대한 당신의 첫 번째 응답을 작성해주세요. 작업을 어떻게 접근할 것인지, 필요한 정보나 리소스가 있는지 등을 포함해서 150자 이내로 답변해주세요.`,
    })

    // 메시지 저장 (실제로는 DB에)
    console.log(`${assigneeInfo.name}: ${text}`)

    // 작업 상태를 "진행중"으로 업데이트
    task.status = "진행중"
    task.startedAt = new Date().toISOString()
    task.progress = 10
  } catch (error) {
    console.error("작업 응답 생성 실패:", error)
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
