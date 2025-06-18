import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MarketplaceItemCard } from "@/components/marketplace-item-card"

interface MarketplaceItem {
  id: string
  name: string
  description: string
  type: string
  price: number
  is_paid: boolean
  file_url?: string
}

async function getMarketplaceItems(): Promise<MarketplaceItem[]> {
  // In a real application, you would fetch this from your API
  // For now, let's use a placeholder fetch
  const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/marketplace/items`, {
    cache: "no-store", // Ensure fresh data
  })
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    throw new Error("Failed to fetch marketplace items")
  }
  return res.json()
}

export default async function MarketplaceHome() {
  const items = await getMarketplaceItems()

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50">Discover & Share AI Resources</h2>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Browse templates, personas, and more to enhance your AI projects.
        </p>
        <Button asChild className="mt-6">
          <Link href="/marketplace/upload">Upload Your Resource</Link>
        </Button>
      </div>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">No marketplace items found. Be the first to upload!</p>
        ) : (
          items.map((item) => <MarketplaceItemCard key={item.id} item={item} />)
        )}
      </section>
    </div>
  )
}
