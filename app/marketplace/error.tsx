"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Marketplace Page Error:", error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-red-600">오류 발생</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg font-medium">마켓플레이스 아이템을 불러오는 데 실패했습니다.</p>
          <p className="text-sm text-gray-500">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
          <p className="text-sm text-gray-500">
            데이터베이스 연결 또는 테이블 설정에 문제가 있을 수 있습니다. 서버 로그를 확인해주세요.
          </p>
          <Button onClick={() => reset()}>다시 시도</Button>
        </CardContent>
      </Card>
    </div>
  )
}
