import { createMcpHandler } from "@vercel/mcp-adapter"
import { z } from "zod"

const handler = createMcpHandler((server) => {
  // 작업 분석 도구
  server.tool(
    "analyze_task",
    "주어진 작업을 분석하고 세부 단계로 분해합니다",
    {
      task_description: z.string().describe("분석할 작업 설명"),
      complexity: z.enum(["low", "medium", "high"]).describe("작업 복잡도"),
    },
    async ({ task_description, complexity }) => {
      const steps = []

      if (complexity === "high") {
        steps.push("요구사항 분석", "설계 단계", "구현 단계", "테스트 단계", "배포 단계")
      } else if (complexity === "medium") {
        steps.push("계획 수립", "실행", "검토")
      } else {
        steps.push("즉시 실행")
      }

      return {
        content: [
          {
            type: "text",
            text: `📋 작업 분석 결과:
          
작업: ${task_description}
복잡도: ${complexity}
권장 단계:
${steps.map((step, i) => `${i + 1}. ${step}`).join("\n")}

예상 소요 시간: ${complexity === "high" ? "2-3일" : complexity === "medium" ? "1일" : "2-4시간"}`,
          },
        ],
      }
    },
  )

  // 리소스 할당 도구
  server.tool(
    "allocate_resources",
    "프로젝트에 필요한 리소스를 계산하고 할당합니다",
    {
      project_type: z.string().describe("프로젝트 유형"),
      team_size: z.number().describe("팀 크기"),
      timeline: z.string().describe("프로젝트 일정"),
    },
    async ({ project_type, team_size, timeline }) => {
      const resources = {
        developers: Math.ceil(team_size * 0.6),
        designers: Math.ceil(team_size * 0.2),
        managers: Math.ceil(team_size * 0.2),
        budget_estimate: team_size * 10000, // 임시 계산
      }

      return {
        content: [
          {
            type: "text",
            text: `💼 리소스 할당 계획:
          
프로젝트: ${project_type}
팀 크기: ${team_size}명
일정: ${timeline}

권장 구성:
- 개발자: ${resources.developers}명
- 디자이너: ${resources.designers}명  
- 매니저: ${resources.managers}명

예상 예산: $${resources.budget_estimate.toLocaleString()}`,
          },
        ],
      }
    },
  )

  // 진행 상황 추적 도구
  server.tool(
    "track_progress",
    "프로젝트 진행 상황을 추적하고 보고서를 생성합니다",
    {
      project_id: z.string().describe("프로젝트 ID"),
      completed_tasks: z.number().describe("완료된 작업 수"),
      total_tasks: z.number().describe("전체 작업 수"),
    },
    async ({ project_id, completed_tasks, total_tasks }) => {
      const progress = (completed_tasks / total_tasks) * 100
      const status = progress >= 90 ? "거의 완료" : progress >= 50 ? "진행 중" : "시작 단계"

      return {
        content: [
          {
            type: "text",
            text: `📊 프로젝트 진행 현황:
          
프로젝트 ID: ${project_id}
진행률: ${progress.toFixed(1)}%
상태: ${status}
완료: ${completed_tasks}/${total_tasks} 작업

${progress < 50 ? "⚠️ 진행 속도 점검이 필요합니다." : "✅ 순조롭게 진행 중입니다."}`,
          },
        ],
      }
    },
  )
})

export { handler as GET, handler as POST, handler as DELETE }
