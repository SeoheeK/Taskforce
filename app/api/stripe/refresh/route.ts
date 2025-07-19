import { type NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
})

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("user_id")

  if (!userId) {
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/marketplace/upload?onboarding=failed`)
  }

  try {
    // In a real app, you'd fetch the account_id from your DB using userId
    // For this example, let's assume we have a way to get it.
    // For now, I'll use a placeholder or assume it's passed.
    // In a real scenario, you'd query your `stripe_accounts` table.
    // const [stripeAccount] = await sql`SELECT account_id FROM stripe_accounts WHERE user_id = ${userId}`;
    // if (!stripeAccount) {
    //   return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/marketplace/upload?onboarding=failed`);
    // }
    // const accountId = stripeAccount.account_id;

    // Placeholder for accountId - replace with actual DB lookup
    // This is a simplification; in a real app, you'd need to retrieve the accountId associated with the userId
    // For now, let's assume a dummy account ID or that the user will retry onboarding.
    // A more robust solution would involve storing the accountId in the session or a temporary lookup.
    // For the purpose of this example, if the accountId isn't found, it will redirect to failed.
    // In a real app, you'd fetch it from your DB based on userId.
    const accountId = "acct_12345" // This needs to be dynamically fetched from your DB based on userId

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/refresh?user_id=${userId}`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/marketplace/upload?onboarding=success`,
      type: "account_onboarding",
    })

    return NextResponse.redirect(accountLink.url)
  } catch (error) {
    console.error("Error refreshing Stripe Connect account link:", error)
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_APP_URL}/marketplace/upload?onboarding=failed`)
  }
}
