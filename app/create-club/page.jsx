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
    description: "",
    category: "",
    membershipType: "Open",
    email: "",
    meetingTimes: "",
    website: "",
    twitter: "",
    instagram: "",
  })

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setCurrentUser(user)
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        localStorage.removeItem("currentUser")
        router.push("/sign-in")
        return
      }
    } else {
      router.push("/sign-in")
      return
    }
    setLoading(false)
  }, [router])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const generateSlug = (name) =>
    name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSubmitting(true)

    if (!formData.name || !formData.shortDescription || !formData.description || !formData.category) {
      setError("Please fill in all required fields.")
      setSubmitting(false)
      return
    }

    try {
      const userId = currentUser?.id || currentUser?._id
      const payload = {
        name: formData.name,
        slug: generateSlug(formData.name),
        category: formData.category,

        // Store EVERYTHING safely inside description
        description: JSON.stringify({
          shortDescription: formData.shortDescription,
          fullDescription: formData.description,
          membershipType: formData.membershipType,
          contactEmail: formData.email || currentUser.email,
          meetingTimes: formData.meetingTimes,
          social: {
            website: formData.website,
            twitter: formData.twitter,
            instagram: formData.instagram,
          },
        }),

        status: "pending",
        createdBy: userId,
      }

      const response = await apiRequest("/clubs", {
        method: "POST",
        body: payload,
      })

      if (!response?.club) {
        throw new Error("Failed to create club.")
      }

      setSuccess(true)
      setTimeout(() => router.push("/clubs"), 2000)
    } catch (err) {
      console.error(err)
      setError(err.message || "Failed to create club.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-green-600 text-center">Club Request Submitted ✓</CardTitle>
            <CardDescription className="text-center">
              Your club is pending admin approval. Redirecting to clubs...
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
            <CardDescription>All fields marked * are required</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input name="name" placeholder="Club Name *" value={formData.name} onChange={handleChange} />
              <Input name="shortDescription" placeholder="Short Description *" value={formData.shortDescription} onChange={handleChange} />
              <Textarea name="description" placeholder="Full Description *" value={formData.description} onChange={handleChange} rows={4} />

              <Select value={formData.category} onValueChange={(v) => setFormData(p => ({ ...p, category: v }))}>
                <SelectTrigger><SelectValue placeholder="Select Category *" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sports">Sports</SelectItem>
                  <SelectItem value="Tech">Tech</SelectItem>
                  <SelectItem value="Arts">Arts</SelectItem>
                  <SelectItem value="Community">Community</SelectItem>
                  <SelectItem value="Academic">Academic</SelectItem>
                </SelectContent>
              </Select>

              <Button type="submit" disabled={submitting} className="w-full bg-green-600">
                {submitting ? "Creating..." : "Create Club"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
