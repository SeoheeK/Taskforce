import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(req: NextRequest) {
  try {
    // In a real app, you'd get the current user's ID from their session/auth
    // For now, let's assume a placeholder user ID or fetch all for demonstration
    const userId = req.nextUrl.searchParams.get("userId") // Example: /api/marketplace/transactions?userId=YOUR_USER_ID

    let transactions
    if (userId) {
      transactions = await sql`
        SELECT
          mt.*,
          mi.name AS item_name,
          mi.type AS item_type,
          mi.creator_id AS item_creator_id
        FROM marketplace_transactions mt
        JOIN marketplace_items mi ON mt.item_id = mi.id
        WHERE mt.buyer_id = ${userId} OR mt.seller_id = ${userId}
        ORDER BY mt.created_at DESC;
      `
    } else {
      // For demonstration, fetch all transactions if no userId is provided
      transactions = await sql`
        SELECT
          mt.*,
          mi.name AS item_name,
          mi.type AS item_type,
          mi.creator_id AS item_creator_id
        FROM marketplace_transactions mt
        JOIN marketplace_items mi ON mt.item_id = mi.id
        ORDER BY mt.created_at DESC;
      `
    }

    return NextResponse.json(transactions)
  } catch (error) {
    console.error("Error fetching marketplace transactions:", error)
    return NextResponse.json({ error: "Failed to fetch marketplace transactions" }, { status: 500 })
  }
}
