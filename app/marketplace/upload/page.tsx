import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

export default function MarketplaceUploadPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Upload New Resource</CardTitle>
        <CardDescription>Share your AI templates, personas, or workflows with the community.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="resource-name">Resource Name</Label>
          <Input id="resource-name" placeholder="e.g., Advanced NLP Template" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="resource-type">Resource Type</Label>
          <Select>
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
          <Textarea id="description" placeholder="Provide a detailed description of your resource..." rows={5} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price">Price ($)</Label>
          <Input id="price" type="number" placeholder="e.g., 19.99" step="0.01" />
        </div>
        <Button className="w-full">Submit for Review</Button>
      </CardContent>
    </Card>
  )
}
