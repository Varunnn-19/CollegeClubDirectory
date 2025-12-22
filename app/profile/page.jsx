"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Star, MessageSquare, LogOut, ExternalLink } from "lucide-react"
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
        const [userMemberships, userRsvps, userReviews, userConversations, allClubs] = await Promise.all([
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
      
      // Update local state
      setMemberships(memberships.filter(m => m.clubId !== clubId))
      setSuccess(`Successfully left ${clubName}`)
      
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error(err)
      setError(`Failed to leave ${clubName}. Please try again.`)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return null
  }

  const allClubs = clubDirectory
  const joinedMemberships = memberships.filter((m) => m.status === "joined")
  const pendingMemberships = memberships.filter((m) => m.status === "pending")
  const joinedClubs = allClubs.filter((c) =>
    joinedMemberships.some((m) => String(m.clubId) === String(c.id || c._id))
  )
  const pendingClubs = allClubs.filter((c) =>
    pendingMemberships.some((m) => String(m.clubId) === String(c.id || c._id))
  )

  const upcomingRSVPs = rsvps
    .filter((r) => r.status === "going")
    .map((r) => {
      const club = allClubs.find((c) => c.id === r.clubId) || null
      let event = null

      if (r.eventTitle) {
        event = {
          title: r.eventTitle,
          date: r.eventDate,
          time: r.eventTime,
          location: r.eventLocation,
        }
      } else if (club) {
        event =
          (club.events || []).find((e) => (e.id || `${e.title}-${e.date}`) === r.eventId) || null
      }

      if (!event) return null
      return { ...r, club, event }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.event?.date || 0) - new Date(b.event?.date || 0))

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">My Profile</h1>
          <p className="text-slate-600">Manage your clubs, events, and activity</p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            {success}
          </div>
        )}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Joined Clubs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{joinedMemberships.length}</div>
              <p className="text-xs text-slate-500 mt-1">Active memberships</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingMemberships.length}</div>
              <p className="text-xs text-slate-500 mt-1">Awaiting approval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">{upcomingRSVPs.length}</div>
              <p className="text-xs text-slate-500 mt-1">RSVP'd events</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600">{reviews.length}</div>
              <p className="text-xs text-slate-500 mt-1">Written reviews</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="clubs" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="clubs">My Clubs</TabsTrigger>
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>

          {/* My Clubs Tab */}
          <TabsContent value="clubs" className="space-y-4">
            <div className="space-y-4">
              {/* Joined Clubs Section */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">Joined Clubs ({joinedClubs.length})</h2>
                {joinedClubs.length === 0 ? (
                  <Card className="border-dashed">
                    <CardContent className="pt-8">
                      <div className="text-center">
                        <Users className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 mb-4">You haven't joined any clubs yet.</p>
                        <Link href="/clubs">
                          <Button>Browse Clubs</Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {joinedClubs.map((club) => {
                      const membership = joinedMemberships.find((m) => String(m.clubId) === String(club.id || club._id))
                      return (
                        <Card key={club.id || club._id} className="hover:shadow-lg transition-shadow">
                          <CardHeader>
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <CardTitle className="text-lg">{club.name}</CardTitle>
                                <CardDescription className="mt-1">
                                  {membership?.role || "Member"}
                                </CardDescription>
                              </div>
                              <Badge variant="default">{club.membershipType}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-slate-600 mb-4">{club.shortDescription}</p>
                            <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                              <span className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                {club.stats?.memberCount || 0} members
                              </span>
                              <span>{club.category}</span>
                            </div>
                            <div className="flex gap-2">
                              <Link href={`/clubs/${club.slug || club.id}`} className="flex-1">
                                <Button variant="outline" size="sm" className="w-full">
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  View Club
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
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Pending Requests Section */}
              {pendingClubs.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">Pending Requests ({pendingClubs.length})</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pendingClubs.map((club) => (
                      <Card key={club.id || club._id} className="border-yellow-200 bg-yellow-50">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <CardTitle className="text-lg">{club.name}</CardTitle>
                              <CardDescription className="mt-1">Awaiting approval</CardDescription>
                            </div>
                            <Badge variant="outline" className="bg-yellow-100">Pending</Badge>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-slate-600 mb-4">{club.shortDescription}</p>
                          <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {club.stats?.memberCount || 0} members
                            </span>
                            <span>{club.category}</span>
                          </div>
                          <Link href={`/clubs/${club.slug || club.id}`} className="w-full">
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="h-4 w-4 mr-2" />
                              View Club
                            </Button>
                          </Link>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Profile Info Tab */}
          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Full Name</p>
                    <p className="text-lg text-slate-900">{currentUser.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 font-medium mb-1">Email</p>
                     <p className="text-lg text-slate-900">{currentUser.email}</p>
                     </div>
                   </CardContent>
                 </Card>
               </TabsContent>
             </Tabs>
           </div>
         </div>
      )}
