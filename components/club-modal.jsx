"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Star, Users, Calendar, MapPin } from "lucide-react"
import { getMembershipsByClub, getAverageRating, getReviewsByClub, getEventsByClub } from "@/lib/data-utils"

/**
 * @param {Object} props
 * @param {boolean} props.open
 * @param {Function} props.onOpenChange
 * @param {Object} [props.club]
 */
export function ClubModal({ open, onOpenChange, club }) {
  const [memberCount, setMemberCount] = useState(0)
  const [rating, setRating] = useState(0)
  const [reviewCount, setReviewCount] = useState(0)
  const [events, setEvents] = useState([])

  useEffect(() => {
    if (club && typeof window !== "undefined") {
      const members = getMembershipsByClub(club.id).filter((m) => m.status === "active")
      setMemberCount(members.length)
      const avgRating = getAverageRating(club.id)
      setRating(parseFloat(avgRating) || 0)
      const reviews = getReviewsByClub(club.id)
      setReviewCount(reviews.length)
      
      // Load events from localStorage (admin-created) or use default club events
      const clubEvents = getEventsByClub(club.id)
      setEvents(clubEvents.length > 0 ? clubEvents : club.events || [])
    }
  }, [club])

  if (!club) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-balance">{club.name}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary">{club.category}</Badge>
            <Badge>{club.membershipType}</Badge>
            {rating > 0 && (
              <Badge variant="outline" className="gap-1">
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                {rating} ({reviewCount})
              </Badge>
            )}
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              {memberCount} members
            </span>
          </div>

          <p className="text-sm text-muted-foreground">{club.fullDescription}</p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h4 className="font-medium">Meeting Times</h4>
              <p className="text-sm text-muted-foreground">{club.meetingTimes}</p>
            </div>
            <div>
              <h4 className="font-medium">Contact</h4>
              <ul className="text-sm text-muted-foreground">
                <li>
                  <a className="underline underline-offset-4" href={`mailto:${club.email}`}>
                    {club.email}
                  </a>
                </li>
                {club.social?.website && (
                  <li>
                    <a
                      className="underline underline-offset-4"
                      href={club.social.website}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Website
                    </a>
                  </li>
                )}
                {club.social?.twitter && (
                  <li>
                    <a
                      className="underline underline-offset-4"
                      href={club.social.twitter}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Twitter
                    </a>
                  </li>
                )}
                {club.social?.instagram && (
                  <li>
                    <a
                      className="underline underline-offset-4"
                      href={club.social.instagram}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {events.length > 0 ? (
            <div className="space-y-2">
              <h4 className="font-medium">Upcoming Events</h4>
              <ul className="text-sm text-muted-foreground space-y-2">
                {events.map((e, i) => {
                  const eventId = e.id || `${e.title}-${e.date}`
                  return (
                    <li key={eventId} className="flex items-start justify-between gap-3 p-2 rounded-md border bg-card">
                      <div className="flex-1">
                        <span className="font-medium">{e.title}</span>
                        {e.description && (
                          <p className="text-xs text-muted-foreground mt-1">{e.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {e.date} {e.time && `at ${e.time}`}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {e.location}
                          </span>
                        </div>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          ) : null}

          {club.images?.length ? (
            <>
              <Separator />
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
            </>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  )
}
