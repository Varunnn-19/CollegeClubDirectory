"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowLeft } from "lucide-react"
import { saveClub } from "@/lib/data-utils"
import { apiRequest } from "@/lib/api-client"

export default function CreateClubPage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    category: "",
    membershipType: "Open",
    email: "",
    meetingTimes: "",
    website: "",
    twitter: "",
    instagram: "",
  })

  useEffect(() => {
    if (typeof window !== "undefined") {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!user) {
        router.push("/sign-in")
        return
      }
      setCurrentUser(user)
           // Note: Club admins can create clubs but will need page admin approval
      setLoading(false)
    }
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateSlug = (name) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

const handleSubmit = async (e) => {
  e.preventDefault()
  setError("")
  setSubmitting(true)

  if (
    !formData.name ||
    !formData.shortDescription ||
    !formData.fullDescription ||
    !formData.category
  ) {
    setError("Please fill in all required fields")
    setSubmitting(false)
    return
  }

  try {
    const clubPayload = {
      name: formData.name,
      description: formData.fullDescription,
      category: formData.category,
      membershipType: formData.membershipType.toLowerCase(),
    }

    await saveClub(clubPayload)

    setSuccess(true)

    setTimeout(() => {
      router.push("/")
    }, 3000)

  } catch (err) {
    setError(err.message || "Failed to create club. Please try again.")
  } finally {
    setSubmitting(false)
  }
}



      // Note: User will be promoted to admin only after club is approved
      // This will be handled in the admin approval process

      setSuccess(true)
      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (err) {
      setError(err.message || "Failed to create club. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-primary">Club Request Submitted!</CardTitle>
            <CardDescription>
              Your club request has been submitted and is pending approval from the admin.
              You will be notified once it's approved. Redirecting to home...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6 flex items-center gap-4">
          <Link href="/clubs">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Create New Club</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Club Information</CardTitle>
            <CardDescription>Fill in the details to create your new club</CardDescription>
          </CardHeader>
          <CardContent>
                         {currentUser?.assignedClubId && (
              <div className="mb-4 p-4 bg-blue-500/10 border border-blue-500/20 rounded text-blue-600 text-sm">
                <p className="font-semibold mb-2">📋 Club Admin Notice</p>
                <p>As a club admin, new clubs you create will require approval from the page administrator before they become active. You will be notified once the approval decision is made.</p>
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive">{error}</div>
              )}

              <div>
                <label className="text-sm font-medium">Club Name *</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g., Photography Club"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Short Description *</label>
                <Input
                  name="shortDescription"
                  value={formData.shortDescription}
                  onChange={handleChange}
                  placeholder="Brief description for directory listings"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium">Full Description *</label>
                <Textarea
                  name="fullDescription"
                  value={formData.fullDescription}
                  onChange={handleChange}
                  placeholder="Detailed description of your club"
                  rows={4}
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Category *</label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Community">Community</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Membership Type</label>
                  <Select
                    value={formData.membershipType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, membershipType: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Contact Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={currentUser.email}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use your account email
                </p>
              </div>

              <div>
                <label className="text-sm font-medium">Meeting Times</label>
                <Input
                  name="meetingTimes"
                  value={formData.meetingTimes}
                  onChange={handleChange}
                  placeholder="e.g., Mondays and Wednesdays, 6-8 PM"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Social Media (Optional)</label>
                <Input
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="Website URL"
                  type="url"
                />
                <Input
                  name="twitter"
                  value={formData.twitter}
                  onChange={handleChange}
                  placeholder="Twitter URL"
                  type="url"
                />
                <Input
                  name="instagram"
                  value={formData.instagram}
                  onChange={handleChange}
                  placeholder="Instagram URL"
                  type="url"
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700" disabled={submitting}>
                  {submitting ? "Creating..." : "Create Club"}
                </Button>
                <Link href="/clubs">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

