import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    const items = await sql`SELECT * FROM marketplace_items ORDER BY created_at DESC`
    return NextResponse.json(items)
  } catch (error) {
    console.error("Error fetching marketplace items:", error)
    return NextResponse.json({ error: "Failed to fetch marketplace items" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, description, type, price, creatorId, fileUrl } = await req.json()

    if (!name || !type || !creatorId) {
      return NextResponse.json({ error: "Missing required fields: name, type, creatorId" }, { status: 400 })
    }

    const isPaid = price > 0

    const [newItem] = await sql`
      INSERT INTO marketplace_items (name, description, type, price, is_paid, creator_id, file_url)
      VALUES (${name}, ${description}, ${type}, ${price}, ${isPaid}, ${creatorId}, ${fileUrl})
      RETURNING *;
    `

    return NextResponse.json(newItem, { status: 201 })
  } catch (error) {
    console.error("Error creating marketplace item:", error)
    return NextResponse.json({ error: "Failed to create marketplace item" }, { status: 500 })
  }
}
