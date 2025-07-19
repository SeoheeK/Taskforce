import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const [item] = await sql`SELECT * FROM marketplace_items WHERE id = ${id}`

    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error("Error fetching marketplace item:", error)
    return NextResponse.json({ error: "Failed to fetch marketplace item" }, { status: 500 })
  }
}
