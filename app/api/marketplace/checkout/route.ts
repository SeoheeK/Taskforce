import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})
const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  try {
    const { itemId, userId } = await req.json() // userId is the buyer's ID

    if (!itemId || !userId) {
      return NextResponse.json({ error: "Missing itemId or userId" }, { status: 400 })
    }

    const [item] = await sql`SELECT * FROM marketplace_items WHERE id = ${itemId}`
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    if (!item.is_paid || item.price <= 0) {
      return NextResponse.json({ error: "This item is not for sale or has no price" }, { status: 400 })
    }

    // Get seller's Stripe Connect account ID
    const [sellerStripeAccount] = await sql`SELECT account_id FROM stripe_accounts WHERE user_id = ${item.creator_id}`
    if (!sellerStripeAccount || !sellerStripeAccount.account_id) {
      return NextResponse.json({ error: "Seller Stripe account not configured" }, { status: 400 })
    }

    const amountInCents = Math.round(item.price * 100)
    const applicationFeeAmount = Math.round(amountInCents * 0.1) // 10% platform fee

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.name,
              description: item.description,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/transactions?status=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/item/${itemId}?status=cancelled`,
      payment_intent_data: {
        application_fee_amount: applicationFeeAmount,
        transfer_data: {
          destination: sellerStripeAccount.account_id,
        },
      },
      metadata: {
        itemId: item.id,
        buyerId: userId,
        sellerId: item.creator_id,
        platformFee: applicationFeeAmount,
        sellerPayout: amountInCents - applicationFeeAmount,
      },
    })

    // Optionally, create a pending transaction record in your DB
    await sql`
      INSERT INTO marketplace_transactions (item_id, buyer_id, seller_id, amount, platform_fee, seller_payout, status)
      VALUES (${item.id}, ${userId}, ${item.creator_id}, ${item.price}, ${applicationFeeAmount / 100}, ${(amountInCents - applicationFeeAmount) / 100}, 'pending');
    `

    return NextResponse.json({ sessionId: session.id, url: session.url })
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error)
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 })
  }
}
