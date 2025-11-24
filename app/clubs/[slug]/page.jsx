"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Users, Calendar, MapPin, Mail, ExternalLink } from "lucide-react"
import { clubs } from "@/lib/clubs"
import {
  getClubDetail,
  getMembershipsByUser,
  saveMembership,
  deleteMembership,
  saveEventRSVP,
  getEventRSVPsByUser,
  saveReview,
  getAverageRating,
} from "@/lib/data-utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function ClubDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [club, setClub] = useState(null)
  const [currentUser, setCurrentUser] = useState(null)
  const [isMember, setIsMember] = useState(false)
  const [memberCount, setMemberCount] = useState(0)
  const [events, setEvents] = useState([])
  const [reviews, setReviews] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [rating, setRating] = useState(0)
  const [showReviewDialog, setShowReviewDialog] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewComment, setReviewComment] = useState("")
  const [rsvps, setRsvps] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    const loadData = async () => {
      if (!params?.slug) {
        router.push("/clubs")
        return
      }
      setLoading(true)
      try {
        const detail = await getClubDetail(params.slug)
        if (!mounted) return
        const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("currentUser") || "null") : null
        setCurrentUser(user)
        setClub({ ...detail.club, stats: detail.stats })
        setMemberCount(detail.stats?.memberCount || 0)
        setEvents(detail.events || [])
        setReviews(detail.reviews || [])
        setAnnouncements(detail.announcements || [])
        setRating(detail.stats?.rating || 0)

        if (user) {
          const memberships = await getMembershipsByUser(user.id)
          if (!mounted) return
          setIsMember(memberships.some((m) => m.clubId === detail.club.id && m.status === "active"))

          const userRsvps = await getEventRSVPsByUser(user.id)
          if (!mounted) return
          const rsvpMap = {}
          userRsvps.forEach((r) => {
            rsvpMap[r.eventId] = r.status
          })
          setRsvps(rsvpMap)
        } else {
          setIsMember(false)
          setRsvps({})
        }
        setError("")
      } catch (err) {
        setError(err.message || "Unable to load club.")
        router.push("/clubs")
      } finally {
        if (mounted) setLoading(false)
      }
    }
    loadData()
    return () => {
      mounted = false
    }
  }, [params.slug, router])

  const handleJoinClub = async () => {
    if (!currentUser || !club) {
      router.push("/sign-in")
      return
    }

    const membership = {
      userId: currentUser.id,
      clubId: club.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      status: club.membershipType === "Open" ? "active" : "pending",
      role: "member",
      joinedAt: new Date().toISOString(),
    }

    try {
      const saved = await saveMembership(membership)
      if (saved.status === "active") {
        setIsMember(true)
        setMemberCount((prev) => prev + 1)
      } else {
        setIsMember(false)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const handleLeaveClub = async () => {
    if (!currentUser || !club) return
    try {
      await deleteMembership(currentUser.id, club.id)
      setIsMember(false)
      setMemberCount((prev) => Math.max(0, prev - 1))
    } catch (error) {
      console.error(error)
    }
  }

  const handleRSVP = async (eventId, status) => {
    if (!currentUser) {
      router.push("/sign-in")
      return
    }

    const previousStatus = rsvps[eventId]
    try {
      const event = events.find((evt) => (evt.id || `${evt.title}-${evt.date}`) === eventId)
      await saveEventRSVP({
        eventId,
        userId: currentUser.id,
        status,
        clubId: club.id,
        clubName: club.name,
        eventTitle: event?.title,
        eventDate: event?.date,
        eventTime: event?.time,
        eventLocation: event?.location,
      })
      setRsvps((prev) => ({ ...prev, [eventId]: status }))
      setEvents((prev) =>
        prev.map((event) => {
          if ((event.id || `${event.title}-${event.date}`) !== eventId) return event
          let delta = 0
          if (status === "going" && previousStatus !== "going") delta = 1
          if (status !== "going" && previousStatus === "going") delta = -1
          return { ...event, rsvpCount: Math.max(0, (event.rsvpCount || 0) + delta) }
        })
      )
    } catch (error) {
      console.error(error)
    }
  }

  const handleSubmitReview = async () => {
    if (!currentUser || !club || !reviewComment.trim()) return

    const review = {
      clubId: club.id,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    }

    try {
      const saved = await saveReview(review)
      setReviews((prev) => [saved, ...prev])
      const newRating = await getAverageRating(club.id)
      setRating(parseFloat(newRating) || 0)
      setShowReviewDialog(false)
      setReviewComment("")
      setReviewRating(5)
    } catch (error) {
      console.error(error)
    }
  }

  if (loading || !club) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const getEventRSVPCount = (eventId) => {
    const event = events.find((evt) => (evt.id || `${evt.title}-${evt.date}`) === eventId)
    return event?.rsvpCount || 0
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 md:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm">
        <Link href="/" className="underline underline-offset-4 hover:text-primary">
          Home
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <Link href="/clubs" className="underline underline-offset-4 hover:text-primary">
          Clubs
        </Link>
        <span className="mx-2 text-muted-foreground">/</span>
        <span className="text-muted-foreground">{club.name}</span>
      </nav>

      <header className="mb-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-3">
            <img
              src={club.logoUrl || "/placeholder.svg"}
              alt={`${club.name} logo`}
              width={72}
              height={72}
              className="h-16 w-16 rounded-md border object-cover"
            />
            <div>
              <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl">{club.name}</h1>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{club.category}</Badge>
                <Badge>{club.membershipType}</Badge>
                {rating > 0 && (
                  <Badge variant="outline" className="gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    {rating} ({reviews.length})
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {currentUser && (
            <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row lg:justify-end">
              {!isMember ? (
                <Button onClick={handleJoinClub} className="w-full sm:w-auto">
                  {club.membershipType === "Open" ? "Join Club" : "Request to Join"}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleLeaveClub} className="w-full sm:w-auto">
                  Leave Club
                </Button>
              )}
            </div>
          )}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:max-w-xl">
          <div className="rounded-lg border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">Active Members</p>
            <p className="text-2xl font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              {memberCount}
            </p>
          </div>
          <div className="rounded-lg border bg-card/40 p-4">
            <p className="text-sm text-muted-foreground">Community Rating</p>
            <p className="text-2xl font-semibold flex items-center gap-2">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {rating > 0 ? `${rating} (${reviews.length})` : "No reviews yet"}
            </p>
          </div>
        </div>
      </header>

      {announcements.length > 0 && (
        <section className="mb-6">
          <h2 className="text-lg font-medium mb-3">Announcements</h2>
          <div className="space-y-2">
            {announcements.slice(0, 3).map((announcement) => (
              <Card key={announcement.id} className="bg-primary/10 border-primary/20">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{announcement.title}</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">{announcement.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      <section className="prose max-w-none prose-p:leading-relaxed mb-6">
        <p>{club.fullDescription}</p>
      </section>

      <section className="mt-6 grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Meeting Times
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{club.meetingTimes}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>
                <a className="underline underline-offset-4 flex items-center gap-1" href={`mailto:${club.email}`}>
                  <Mail className="h-4 w-4" />
                  {club.email}
                </a>
              </li>
              {club.social?.website && (
                <li>
                  <a
                    className="underline underline-offset-4 flex items-center gap-1"
                    href={club.social.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Website
                  </a>
                </li>
              )}
              {club.social?.twitter && (
                <li>
                  <a
                    className="underline underline-offset-4 flex items-center gap-1"
                    href={club.social.twitter}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Twitter
                  </a>
                </li>
              )}
              {club.social?.instagram && (
                <li>
                  <a
                    className="underline underline-offset-4 flex items-center gap-1"
                    href={club.social.instagram}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Instagram
                  </a>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      </section>

      {events.length > 0 && (
        <section className="mt-6">
          <h2 className="text-lg font-medium mb-3">Upcoming Events</h2>
          <div className="space-y-3">
            {events.map((event) => {
              const eventId = event.id || `${event.title}-${event.date}`
              const rsvpCount = getEventRSVPCount(eventId)
              const userRSVP = rsvps[eventId]

              return (
                <Card key={eventId}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{event.title}</h3>
                        {event.description && <p className="text-sm text-muted-foreground mt-1">{event.description}</p>}
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {event.date} {event.time && `at ${event.time}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </span>
                          {rsvpCount > 0 && <span>{rsvpCount} going</span>}
                        </div>
                      </div>
                      {currentUser && (
                        <div className="flex gap-2 ml-4">
                          {userRSVP === "going" ? (
                            <Button size="sm" variant="outline" onClick={() => handleRSVP(eventId, "not_going")}>
                              Cancel RSVP
                            </Button>
                          ) : (
                            <Button size="sm" onClick={() => handleRSVP(eventId, "going")}>
                              RSVP
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Reviews & Ratings</h2>
          {currentUser && (
            <Button size="sm" onClick={() => setShowReviewDialog(true)}>
              Write Review
            </Button>
          )}
        </div>

        {reviews.length === 0 ? (
          <p className="text-sm text-muted-foreground">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium">{review.userName}</span>
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
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {club.images?.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-medium mb-3">Gallery</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {club.images.map((src, i) => (
              <img
                key={i}
                src={src || "/placeholder.svg"}
                alt={`Gallery image ${i + 1} for ${club.name}`}
                className="h-24 w-full rounded-md border object-cover"
              />
            ))}
          </div>
        </section>
      )}

      <Dialog open={showReviewDialog} onOpenChange={setShowReviewDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Write a Review</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Rating</label>
              <div className="flex items-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewRating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Comment</label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                className="mt-2"
                rows={4}
              />
            </div>
            <Button onClick={handleSubmitReview} className="w-full">
              Submit Review
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  )
}
