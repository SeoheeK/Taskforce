import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export default function MarketplaceFeedbackPage() {
  // Placeholder feedback data
  const feedbackItems = [
    { id: "fdb_001", from: "User A", to: "Creator X", message: "Great template, very useful!", date: "2023-10-21" },
    {
      id: "fdb_002",
      from: "User B",
      to: "Creator Y",
      message: "Persona helped a lot with my marketing campaign.",
      date: "2023-10-23",
    },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Leave Feedback</CardTitle>
          <CardDescription>Share your experience with other users and creators.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="feedback-message">Your Feedback</Label>
            <Textarea id="feedback-message" placeholder="Write your feedback here..." rows={5} />
          </div>
          <Button className="w-full">Submit Feedback</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Feedback</CardTitle>
          <CardDescription>See what others are saying.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {feedbackItems.length > 0 ? (
            feedbackItems.map((feedback) => (
              <div key={feedback.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                <p className="font-semibold">
                  {feedback.from} to {feedback.to}
                </p>
                <p className="text-gray-700 dark:text-gray-300 mt-1">{feedback.message}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{feedback.date}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-600 dark:text-gray-400">No feedback yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
