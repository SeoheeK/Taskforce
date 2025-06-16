"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Clock, CheckCircle, AlertTriangle, Play, Pause, RotateCcw } from "lucide-react"

interface Task {
  id: number
  title: string
  assigneeId: number
  assigneeName: string
  status: string
  progress: number
  priority: string
  deadline: string
  estimatedHours: string
  lastUpdate: string
}

interface TaskProgressMonitorProps {
  sessionId: number
}

export function TaskProgressMonitor({ sessionId }: TaskProgressMonitorProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchTasks()
    const interval = setInterval(fetchTasks, 5000) // 5초마다 업데이트
    return () => clearInterval(interval)
  }, [sessionId])

  const fetchTasks = async () => {
    try {
      const response = await fetch(`/api/taskforce/${sessionId}/tasks`)
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("작업 로딩 실패:", error)
    }
  }

  const handleTaskAction = async (taskId: number, action: string) => {
    setIsLoading(true)
    try {
      await fetch(`/api/taskforce/${sessionId}/tasks/${taskId}/action`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      fetchTasks()
    } catch (error) {
      console.error("작업 액션 실패:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "완료":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "진행중":
        return <Play className="h-4 w-4 text-blue-600" />
      case "일시정지":
        return <Pause className="h-4 w-4 text-yellow-600" />
      case "할당됨":
        return <Clock className="h-4 w-4 text-gray-600" />
      default:
        return <AlertTriangle className="h-4 w-4 text-red-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "완료":
        return "bg-green-100 text-green-800"
      case "진행중":
        return "bg-blue-100 text-blue-800"
      case "일시정지":
        return "bg-yellow-100 text-yellow-800"
      case "할당됨":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-red-100 text-red-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">실시간 작업 진행 상황</h3>
        <Button variant="outline" size="sm" onClick={fetchTasks}>
          <RotateCcw className="h-4 w-4 mr-1" />
          새로고침
        </Button>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-gray-500">진행 중인 작업이 없습니다.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority === "high" ? "높음" : task.priority === "medium" ? "보통" : "낮음"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Avatar className="w-6 h-6 mr-2">
                          <AvatarFallback className="text-xs bg-gradient-to-br from-blue-400 to-purple-500 text-white">
                            {task.assigneeName?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <span>{task.assigneeName}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{task.estimatedHours}</span>
                      </div>
                      <div className="flex items-center">
                        <span>마감: {task.deadline}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(task.status)}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">진행률</span>
                      <span className="text-sm text-gray-600">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-2" />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">최근 업데이트: {task.lastUpdate || "방금 전"}</span>

                    <div className="flex space-x-2">
                      {task.status === "진행중" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, "pause")}
                          disabled={isLoading}
                        >
                          <Pause className="h-3 w-3 mr-1" />
                          일시정지
                        </Button>
                      )}

                      {task.status === "일시정지" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskAction(task.id, "resume")}
                          disabled={isLoading}
                        >
                          <Play className="h-3 w-3 mr-1" />
                          재개
                        </Button>
                      )}

                      {task.status !== "완료" && (
                        <Button
                          size="sm"
                          onClick={() => handleTaskAction(task.id, "complete")}
                          disabled={isLoading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          완료
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
