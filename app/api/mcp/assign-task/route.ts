import { type NextRequest, NextResponse } from "next/server"

const mcpTasks: any[] = []

export async function POST(request: NextRequest) {
  const { sessionId, personaId, taskDescription, taskType } = await request.json()

  const newTask = {
    id: mcpTasks.length + 1,
    session_id: sessionId,
    assigned_persona_id: personaId,
    task_description: taskDescription,
    task_type: taskType,
    status: "pending",
    created_at: new Date().toISOString(),
  }

  mcpTasks.push(newTask)

  // 실제로는 여기서 MCP 서버에 작업을 전송
  // 시뮬레이션을 위해 2초 후 완료 처리
  setTimeout(() => {
    const task = mcpTasks.find((t) => t.id === newTask.id)
    if (task) {
      task.status = "completed"
      task.result = `${taskDescription}이(가) 성공적으로 완료되었습니다.`
      task.completed_at = new Date().toISOString()
    }
  }, 2000)

  return NextResponse.json(newTask, { status: 201 })
}

export async function GET() {
  return NextResponse.json(mcpTasks)
}
