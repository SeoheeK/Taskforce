import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { neon } from "@neondatabase/serverless"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})
const sql = neon(process.env.DATABASE_URL!)

export async function POST(req: NextRequest) {
  const buf = await req.text()
  const sig = req.headers.get("stripe-signature") as string
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`)
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  switch (event.type) {
    case "checkout.session.completed":
      const session = event.data.object as Stripe.Checkout.Session
      const { itemId, buyerId, sellerId, platformFee, sellerPayout } = session.metadata as {
        itemId: string
        buyerId: string
        sellerId: string
        platformFee: string
        sellerPayout: string
      }
      const paymentIntentId = session.payment_intent as string

      try {
        await sql`
          UPDATE marketplace_transactions
          SET
            stripe_charge_id = ${paymentIntentId},
            status = 'completed'
          WHERE
            item_id = ${itemId} AND buyer_id = ${buyerId} AND status = 'pending';
        `
        console.log(`Transaction for item ${itemId} completed and recorded.`)
      } catch (dbError) {
        console.error("Database update error for checkout.session.completed:", dbError)
        // You might want to log this to an error tracking system
      }
      break
    case "account.updated":
      const account = event.data.object as Stripe.Account
      const userId = account.metadata?.userId // Assuming you store userId in metadata when creating account link

      if (userId) {
        try {
          await sql`
            UPDATE stripe_accounts
            SET
              charges_enabled = ${account.charges_enabled},
              payouts_enabled = ${account.payouts_enabled},
              details_submitted = ${account.details_submitted},
              updated_at = CURRENT_TIMESTAMP
            WHERE
              user_id = ${userId};
          `
          console.log(`Stripe account for user ${userId} updated.`)
        } catch (dbError) {
          console.error("Database update error for account.updated:", dbError)
        }
      }
      break
    // Handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  return NextResponse.json({ received: true }, { status: 200 })
}
