import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const deliverableId = Number.parseInt(params.id)

  try {
    // 실제로는 데이터베이스에서 파일 정보를 가져옴
    const deliverable = {
      id: deliverableId,
      fileName: "mobile_app_plan.pdf",
      filePath: "/files/mobile_app_plan.pdf",
      fileType: "pdf",
    }

    if (!deliverable) {
      return NextResponse.json({ error: "파일을 찾을 수 없습니다" }, { status: 404 })
    }

    // 실제 구현에서는 파일 시스템이나 클라우드 스토리지에서 파일을 읽어옴
    // 여기서는 시뮬레이션을 위해 더미 응답 반환
    const headers = new Headers()
    headers.set("Content-Disposition", `attachment; filename="${deliverable.fileName}"`)
    headers.set("Content-Type", "application/octet-stream")

    return new NextResponse("파일 내용 (실제로는 바이너리 데이터)", {
      status: 200,
      headers,
    })
  } catch (error) {
    console.error("파일 다운로드 실패:", error)
    return NextResponse.json({ error: "파일 다운로드 실패" }, { status: 500 })
  }
}
