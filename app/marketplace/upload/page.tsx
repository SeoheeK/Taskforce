"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function MarketplaceUploadPage() {
  const [name, setName] = useState("")
  const [type, setType] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState(0)
  const [fileUrl, setFileUrl] = useState("") // Placeholder for file upload URL
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleStripeOnboarding = async () => {
    // In a real app, you'd get the actual userId from your auth system
    const userId = "user_123" // Placeholder user ID for demonstration

    try {
      const res = await fetch("/api/stripe/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
      const data = await res.json()
      if (res.ok && data.url) {
        router.push(data.url)
      } else {
        toast({
          title: "Stripe Onboarding Failed",
          description: data.error || "Could not initiate Stripe onboarding.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error initiating Stripe onboarding:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred during Stripe onboarding.",
        variant: "destructive",
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, you'd get the actual creatorId from your auth system
    const creatorId = "user_123" // Placeholder creator ID for demonstration

    try {
      const res = await fetch("/api/marketplace/items", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          type,
          price: Number.parseFloat(price.toFixed(2)), // Ensure price is a number with 2 decimal places
          creatorId,
          fileUrl, // This would come from a file upload service (e.g., Vercel Blob)
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast({
          title: "Resource Uploaded",
          description: "Your resource has been submitted for review.",
        })
        router.push("/marketplace")
      } else {
        toast({
          title: "Upload Failed",
          description: data.error || "There was an error uploading your resource.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error uploading resource:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload New Resource</CardTitle>
        <CardDescription>Share your AI templates, personas, or workflows with the community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="resource-name">Resource Name</Label>
            <Input
              id="resource-name"
              placeholder="e.g., Advanced NLP Template"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="resource-type">Resource Type</Label>
            <Select value={type} onValueChange={setType} required>
              <SelectTrigger id="resource-type">
                <SelectValue placeholder="Select a type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="persona">Persona</SelectItem>
                <SelectItem value="workflow">Workflow</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Provide a detailed description of your resource..."
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price ($)</Label>
            <Input
              id="price"
              type="number"
              placeholder="e.g., 19.99"
              step="0.01"
              min="0"
              value={price}
              onChange={(e) => setPrice(Number.parseFloat(e.target.value))}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="file-url">Resource File URL</Label>
            <Input
              id="file-url"
              placeholder="e.g., https://your-storage.com/resource.zip"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              required
            />
            <p className="text-sm text-gray-500">
              This is where the actual resource file will be downloaded from. In a real app, you'd integrate with a
              storage service like Vercel Blob.
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit for Review"}
          </Button>
        </form>
        <div className="border-t pt-6 mt-6 space-y-4">
          <h3 className="text-lg font-semibold">Become a Seller</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            To sell paid resources, you need to set up a Stripe Connect account.
          </p>
          <Button onClick={handleStripeOnboarding} className="w-full" variant="secondary">
            Connect with Stripe
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
