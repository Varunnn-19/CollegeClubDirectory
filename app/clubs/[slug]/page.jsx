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
  getClubs,
  getMembershipsByUser,
  getMembershipsByClub,
  saveMembership,
  deleteMembership,
  getEventsByClub,
  getEventRSVPs,
  saveEventRSVP,
  getReviewsByClub,
  saveReview,
  getAverageRating,
  getAnnouncementsByClub,
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Get all clubs (default + custom)
      if (!params?.slug) {
        router.push("/clubs")
        return
      }
      const customClubs = getClubs()
      const allClubs = [...clubs, ...customClubs]
      const foundClub = allClubs.find((c) => c.slug === params.slug)
      if (!foundClub) {
        router.push("/clubs")
        return
      }
      setClub(foundClub)

      const user = JSON.parse(localStorage.getItem("currentUser") || "null")
      setCurrentUser(user)

      if (user) {
        const memberships = getMembershipsByUser(user.id)
        setIsMember(memberships.some((m) => m.clubId === foundClub.id && m.status === "active"))
      }

      const members = getMembershipsByClub(foundClub.id).filter((m) => m.status === "active")
      setMemberCount(members.length)

      const clubEvents = getEventsByClub(foundClub.id)
      setEvents(clubEvents.length > 0 ? clubEvents : foundClub.events || [])

      const clubReviews = getReviewsByClub(foundClub.id)
      setReviews(clubReviews)

      const clubAnnouncements = getAnnouncementsByClub(foundClub.id)
      setAnnouncements(clubAnnouncements)

      const avgRating = getAverageRating(foundClub.id)
      setRating(parseFloat(avgRating) || 0)

      if (user) {
        const userRsvps = getEventRSVPs().filter((r) => r.userId === user.id)
        const rsvpMap = {}
        userRsvps.forEach((r) => {
          rsvpMap[r.eventId] = r.status
        })
        setRsvps(rsvpMap)
      }
    }
  }, [params.slug, router])

  const handleJoinClub = () => {
    if (!currentUser || !club) {
      if (!currentUser) router.push("/sign-in")
      return
    }

    const membership = {
      id: Date.now().toString(),
      userId: currentUser.id,
      clubId: club.id,
      status: club.membershipType === "Open" ? "active" : "pending",
      role: "member",
      joinedAt: new Date().toISOString(),
    }

    saveMembership(membership)
    setIsMember(true)
    setMemberCount((prev) => prev + 1)
  }

  const handleLeaveClub = () => {
    if (!currentUser || !club) return
    deleteMembership(currentUser.id, club.id)
    setIsMember(false)
    setMemberCount((prev) => Math.max(0, prev - 1))
  }

  const handleRSVP = (eventId, status) => {
    if (!currentUser) {
      router.push("/sign-in")
      return
    }

    const rsvp = {
      id: Date.now().toString(),
      eventId: eventId,
      userId: currentUser.id,
      status: status,
      createdAt: new Date().toISOString(),
    }

    saveEventRSVP(rsvp)
    setRsvps((prev) => ({ ...prev, [eventId]: status }))
  }

  const handleSubmitReview = () => {
    if (!currentUser || !club || !reviewComment.trim()) return

    const review = {
      id: Date.now().toString(),
      clubId: club.id,
      userId: currentUser.id,
      userName: currentUser.name,
      rating: reviewRating,
      comment: reviewComment,
      createdAt: new Date().toISOString(),
    }

    saveReview(review)
    setReviews((prev) => [review, ...prev])
    const newRating = getAverageRating(club.id)
    setRating(parseFloat(newRating) || 0)
    setShowReviewDialog(false)
    setReviewComment("")
    setReviewRating(5)
  }

  if (!club) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  const getEventRSVPCount = (eventId) => {
    return getEventRSVPs().filter((r) => r.eventId === eventId && r.status === "going").length
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
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={club.logoUrl || "/placeholder.svg"}
              alt={`${club.name} logo`}
              width={64}
              height={64}
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
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {memberCount} members
                </span>
              </div>
            </div>
          </div>
          {currentUser && (
            <div className="flex gap-2">
              {!isMember ? (
                <Button onClick={handleJoinClub}>
                  {club.membershipType === "Open" ? "Join Club" : "Request to Join"}
                </Button>
              ) : (
                <Button variant="outline" onClick={handleLeaveClub}>
                  Leave Club
                </Button>
              )}
            </div>
          )}
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
