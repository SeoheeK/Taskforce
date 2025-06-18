import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function MarketplaceHome() {
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
        {/* Placeholder for ItemCard components */}
        <Card>
          <CardHeader>
            <CardTitle>Example Template</CardTitle>
            <CardDescription>A powerful template for data analysis.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">$29.99</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace/item/123">View Details</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>AI Persona: Marketing Guru</CardTitle>
            <CardDescription>Expert persona for campaign design.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">$19.99</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace/item/456">View Details</Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Project Workflow: Agile AI</CardTitle>
            <CardDescription>Streamlined workflow for AI product development.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-semibold">$39.99</p>
            <Button asChild className="mt-4">
              <Link href="/marketplace/item/789">View Details</Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
