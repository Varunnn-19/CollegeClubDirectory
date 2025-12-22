"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, Star, MessageSquare } from "lucide-react"
import {
  getMembershipsByUser,
  getEventRSVPsByUser,
  getReviewsByUser,
  getConversations,
  getClubs,
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
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router])

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (!currentUser) {
    return null
  }

  const allClubs = clubDirectory
  const activeMemberships = memberships.filter((m) => m.status === "active")
 const joinedClubs = allClubs.filter((c) => activeMemberships.some((m) => String(m.clubId) === String(c.id || c._id)))
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
        event = (club.events || []).find((e) => (e.id || `${e.title}-${e.date}`) === r.eventId) || null
      }
      if (!event) return null
      return { ...r, club, event }
    })
    .filter(Boolean)
    .sort((a, b) => new Date(a.event?.date || 0) - new Date(b.event?.date || 0))

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-muted-foreground mt-2">Manage your clubs, events, and activity</p>
        </div>

        <div className="grid gap-6 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4" />
                Joined Clubs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{activeMemberships.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{upcomingRSVPs.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Star className="h-4 w-4" />
                Reviews Written
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{reviews.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Conversations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{conversationCount}</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{currentUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{currentUser.email}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">USN</p>
                <p className="font-medium">{currentUser.usn}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Year of Study</p>
                <p className="font-medium">{currentUser.yearOfStudy}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">{currentUser.phoneNumber}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge>{currentUser.role === "admin" ? "Club Admin" : "Student"}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="clubs" className="mt-8">
          <TabsList>
            <TabsTrigger value="clubs">My Clubs</TabsTrigger>
            <TabsTrigger value="events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="reviews">My Reviews</TabsTrigger>
          </TabsList>

          <TabsContent value="clubs" className="mt-6">
            {joinedClubs.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">You haven't joined any clubs yet.</p>
                  <div className="mt-4 text-center">
                    <Link href="/clubs">
                      <Button>Browse Clubs</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {joinedClubs.map((club) => {
                  const membership = activeMemberships.find((m) => m.clubId === club.id)
                  return (
                    <Card key={club.id}>
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <img
                            src={club.logoUrl || "/placeholder.svg"}
                            alt={club.name}
                            className="h-12 w-12 rounded-md border object-cover"
                          />
                          <div className="flex-1">
                            <CardTitle className="text-base">{club.name}</CardTitle>
                            <Badge variant="secondary" className="mt-1">
                              {membership?.role || "member"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{club.shortDescription}</p>
                        <Link href={`/clubs/${club.slug}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Club
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            {upcomingRSVPs.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">No upcoming events.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {upcomingRSVPs.map((rsvp) => (
                  <Card key={rsvp.id}>
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-medium">{rsvp.event?.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{rsvp.club?.name}</p>
                          <div className="mt-2 text-sm text-muted-foreground">
                            <p>{rsvp.event?.date} {rsvp.event?.time && `at ${rsvp.event.time}`}</p>
                            <p>{rsvp.event?.location}</p>
                          </div>
                        </div>
                        <Link href={`/clubs/${rsvp.club?.slug}`}>
                          <Button variant="outline" size="sm">
                            View Club
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="reviews" className="mt-6">
            {reviews.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-center text-muted-foreground">You haven't written any reviews yet.</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {reviews.map((review) => {
                  const club = allClubs.find((c) => c.id === review.clubId)
                  return (
                    <Card key={review.id}>
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">{club?.name || "Unknown Club"}</h3>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{review.comment}</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          {club && (
                            <Link href={`/clubs/${club.slug}`}>
                              <Button variant="outline" size="sm">
                                View Club
                              </Button>
                            </Link>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

