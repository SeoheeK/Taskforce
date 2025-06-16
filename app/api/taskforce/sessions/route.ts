import { type NextRequest, NextResponse } from "next/server"

const sessions: any[] = []

export async function POST(request: NextRequest) {
  const body = await request.json()
  const newSession = {
    id: sessions.length + 1,
    title: body.title,
    problem_description: body.problem_description,
    status: "active",
    created_at: new Date().toISOString(),
  }

  sessions.push(newSession)
  return NextResponse.json(newSession, { status: 201 })
}

export async function GET() {
  return NextResponse.json(sessions)
}
