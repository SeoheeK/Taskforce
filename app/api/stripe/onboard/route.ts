import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})
const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { userId } = await req.json() // The ID of the user who wants to be a seller

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 })
    }

    let accountId
    const [existingAccount] = await sql`SELECT account_id FROM stripe_accounts WHERE user_id = ${userId}`

    if (existingAccount) {
      accountId = existingAccount.account_id
    } else {
      const account = await stripe.accounts.create({
        type: "express",
        country: "US", // Or dynamically set based on user
        email: `user_${userId}@example.com`, // Replace with actual user email
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        metadata: {
          userId: userId, // Store your internal user ID
        },
      })
      accountId = account.id

      await sql`
        INSERT INTO stripe_accounts (user_id, account_id)
        VALUES (${userId}, ${accountId});
      `
    }

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/refresh?user_id=${userId}`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/upload?onboarding=success`,
      type: "account_onboarding",
    })

    return NextResponse.json({ url: accountLink.url })
  } catch (error) {
    console.error("Error creating Stripe Connect account or account link:", error)
    return NextResponse.json({ error: "Failed to onboard seller" }, { status: 500 })
  }
}
