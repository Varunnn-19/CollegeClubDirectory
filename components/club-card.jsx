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
      className="hover:shadow-lg transition-all transform hover:-translate-y-1 border-2"
      style={{ 
        backgroundColor: '#fdfceb',
        borderColor: '#9fdcc8'
      }}
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
          <CardTitle className="text-base font-bold" style={{ color: '#22112a' }}>{club.name}</CardTitle>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <Badge 
              variant="secondary"
              style={{ 
                backgroundColor: '#9fdcc8',
                color: '#22112a'
              }}
            >
              {club.category}
            </Badge>
            <Badge
              style={{ 
                backgroundColor: '#a3635d',
                color: '#fdfceb'
              }}
            >
              {club.membershipType}
            </Badge>
            {rating > 0 && (
              <Badge 
                variant="outline" 
                className="gap-1"
                style={{ 
                  borderColor: '#a3635d',
                  color: '#a3635d'
                }}
              >
                <Star className="h-3 w-3 fill-current" style={{ color: '#a3635d' }} />
                {rating}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm" style={{ color: '#4a3a4f' }}>{club.shortDescription}</p>
        <div className="flex items-center justify-between text-xs" style={{ color: '#4a3a4f' }}>
          <span className="font-medium">{memberCount} members</span>
          <div className="flex items-center gap-2">
            <button
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: '#9fdcc8' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a3635d'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9fdcc8'}
              onClick={() => onOpen?.(club)}
              aria-label={`Quick view ${club.name}`}
            >
              Quick view
            </button>
            <span style={{ color: '#9fdcc8' }}>•</span>
            <Link
              className="text-sm font-medium transition-colors hover:underline"
              style={{ color: '#9fdcc8' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#a3635d'}
              onMouseLeave={(e) => e.currentTarget.style.color = '#9fdcc8'}
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
