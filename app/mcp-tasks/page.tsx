"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Clock, AlertCircle, Zap } from "lucide-react"

interface MCPTask {
  id: number
  task_description: string
  task_type: string
  status: string
  result?: string
  created_at: string
  completed_at?: string
}

export default function MCPTasksPage() {
  const [tasks, setTasks] = useState<MCPTask[]>([])

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 3000) // 3초마다 업데이트
    return () => clearInterval(interval)
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await fetch("/api/mcp/assign-task")
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("작업 로딩 실패:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Zap className="h-8 w-8 mr-3 text-purple-600" />
            MCP 작업 현황
          </h1>
          <p className="text-gray-600 mt-2">Model Context Protocol을 통한 작업 분배 및 실행 현황</p>
        </div>
        <Button onClick={fetchTasks}>새로고침</Button>
      </div>

      <div className="grid gap-4">
        {tasks.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-gray-500">아직 할당된 MCP 작업이 없습니다.</p>
              <p className="text-sm text-gray-400 mt-2">태스크포스 세션에서 작업을 할당해보세요.</p>
            </CardContent>
          </Card>
        ) : (
          tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg flex items-center">
                      {getStatusIcon(task.status)}
                      <span className="ml-2">작업 #{task.id}</span>
                    </CardTitle>
                    <CardDescription className="mt-1">{task.task_description}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(task.status)}>
                    {task.status === "completed" ? "완료" : task.status === "pending" ? "진행중" : "실패"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">작업 유형:</span>
                    <span className="font-medium">{task.task_type}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">시작 시간:</span>
                    <span>{new Date(task.created_at).toLocaleString()}</span>
                  </div>
                  {task.completed_at && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">완료 시간:</span>
                      <span>{new Date(task.completed_at).toLocaleString()}</span>
                    </div>
                  )}
                  {task.result && (
                    <div className="mt-3 p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-green-800">
                        <strong>결과:</strong> {task.result}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
