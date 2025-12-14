"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { getMembershipsByClub, getAverageRating, getReviewsByClub } from "@/lib/data-utils"

/**
 * @param {Object} props
 * @param {Object} props.club
 * @param {Function} [props.onOpen]
 */
export function ClubCard({ club, onOpen }) {
  const [memberCount, setMemberCount] = useState(0)
  const [rating, setRating] = useState(0)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const members = getMembershipsByClub(club.id).filter((m) => m.status === "active")
      setMemberCount(members.length)
      const avgRating = getAverageRating(club.id)
      setRating(parseFloat(avgRating) || 0)
    }
  }, [club.id])

  return (
    <Card 
      className="hover-lift hover-glow animate-fade-in transition-all duration-300 border-2 cursor-pointer"
    >
      <CardHeader className="flex flex-row items-center gap-3">
        <img
          src={club.logoUrl || "/placeholder.svg"}
          alt={`${club.name} logo`}
          width={48}
          height={48}
          className="h-12 w-12 rounded-lg border-2 object-cover"
          style={{ borderColor: '#9fdcc8' }}
        />
        <div className="flex-1">
          <CardTitle className="text-base font-bold text-foreground">{club.name}</CardTitle>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
              {club.category}
            </Badge>
            <Badge className="transition-all duration-300 hover:scale-105">
              {club.membershipType}
            </Badge>
            {rating > 0 && (
              <Badge variant="outline" className="gap-1 transition-all duration-300 hover:scale-105">
                <Star className="h-3 w-3 fill-current" />
                {rating}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{club.shortDescription}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="font-medium">{memberCount} members</span>
          <div className="flex items-center gap-2">
            <button
              className="text-sm font-medium text-primary transition-all duration-300 hover:underline hover:scale-105 active:scale-95"
              onClick={() => onOpen?.(club)}
              aria-label={`Quick view ${club.name}`}
            >
              Quick view
            </button>
            <span className="text-primary">•</span>
            <Link
              className="text-sm font-medium text-primary transition-all duration-300 hover:underline hover:scale-105 active:scale-95"
              href={`/clubs/${club.slug}`}
              aria-label={`View details page for ${club.name}`}
            >
              View details
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
