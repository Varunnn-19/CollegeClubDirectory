"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, LogOut, ExternalLink } from "lucide-react"
import {
  getMembershipsByUser,
  getEventRSVPsByUser,
  getReviewsByUser,
  getConversations,
  getClubs,
  deleteMembership,
} from "@/lib/data-utils"

export default function ProfilePage() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [memberships, setMemberships] = useState([])
  const [rsvps, setRsvps] = useState([])
  const [reviews, setReviews] = useState([])
  const [conversationCount, setConversationCount] = useState(0)
  const [clubDirectory, setClubDirectory] = useState([])
  const [loading, setLoading] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!user) {
        router.push("/sign-in")
        return
      }

      setCurrentUser(user)

      try {
        const [
          userMemberships,
          userRsvps,
          userReviews,
          userConversations,
          allClubs,
        ] = await Promise.all([
          getMembershipsByUser(user.id),
          getEventRSVPsByUser(user.id),
          getReviewsByUser(user.id),
          getConversations(user.id),
          getClubs(),
        ])

        setMemberships(userMemberships)
        setRsvps(userRsvps)
        setReviews(userReviews)
        setConversationCount(userConversations.length)
        setClubDirectory(allClubs)
      } catch (err) {
        console.error(err)
        setError("Failed to load profile data")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  const handleLeaveClub = async (clubId, clubName) => {
    if (!confirm(`Are you sure you want to leave ${clubName}?`)) return

    try {
      setError("")
      await deleteMembership(currentUser.id, clubId)
      setMemberships((prev) => prev.filter((m) => m.clubId !== clubId))
      setSuccess(`Successfully left ${clubName}`)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
      setError(`Failed to leave ${clubName}. Please try again.`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your profile...</p>
      </div>
    )
  }

  if (!currentUser) return null

  const joinedMemberships = memberships.filter((m) => m.status === "joined")
  const pendingMemberships = memberships.filter((m) => m.status === "pending")

  const joinedClubs = clubDirectory.filter((c) =>
    joinedMemberships.some((m) => String(m.clubId) === String(c.id || c._id))
  )

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>

        {success && <div className="mb-4 text-green-600">{success}</div>}
        {error && <div className="mb-4 text-red-600">{error}</div>}

        <Tabs defaultValue="clubs">
          <TabsList className="grid grid-cols-2 w-full mb-6">
            <TabsTrigger value="clubs">My Clubs</TabsTrigger>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
          </TabsList>

          {/* CLUBS TAB */}
          <TabsContent value="clubs">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {joinedClubs.map((club) => (
                <Card key={club.id || club._id}>
                  <CardHeader>
                    <CardTitle>{club.name}</CardTitle>
                    <CardDescription>{club.category}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm mb-4">{club.shortDescription}</p>
                    <div className="flex gap-2">
                      <Link href={`/clubs/${club.slug || club.id}`} className="flex-1">
                        <Button variant="outline" size="sm" className="w-full">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View
                        </Button>
                      </Link>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleLeaveClub(club.id || club._id, club.name)}
                      >
                        <LogOut className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-slate-600">Full Name</p>
                  <p className="text-lg">{currentUser.name}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600">Email</p>
                  <p className="text-lg">{currentUser.email}</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
