"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from 'next/navigation'
import { ClubCard3D } from "@/components/club-card-3d"
import { ClubModal } from "@/components/club-modal"
import { SearchFilters } from "@/components/search-filters"
import { clubs, categories, membershipTypes } from "@/lib/clubs"
import { getClubs, getAverageRating, getMembershipsByClub } from "@/lib/data-utils"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const PAGE_SIZE = 8

export default function ClubsPage() {
  const router = useRouter()
  const [isClient, setIsClient] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [membership, setMembership] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [minRating, setMinRating] = useState("0")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)

  // Get all clubs (default + custom)
  const allClubs = useMemo(() => {
    if (typeof window === "undefined") return clubs
    const customClubs = getClubs()
    return [...clubs, ...customClubs]
  }, [])

  // Filter and sort clubs
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = allClubs.filter((c) => {
      const matchesQuery = q
        ? c.name.toLowerCase().includes(q) ||
          c.shortDescription?.toLowerCase().includes(q) ||
          c.fullDescription?.toLowerCase().includes(q)
        : true
      const matchesCategory = category === "All" ? true : c.category === category
      const matchesMembership = membership === "All" ? true : c.membershipType === membership
      
      // Rating filter
      if (minRating !== "0") {
        const rating = parseFloat(getAverageRating(c.id)) || 0
        if (rating < parseFloat(minRating)) return false
      }
      
      return matchesQuery && matchesCategory && matchesMembership
    })

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name)
        case "name-desc":
          return b.name.localeCompare(a.name)
        case "rating":
          const ratingA = parseFloat(getAverageRating(a.id)) || 0
          const ratingB = parseFloat(getAverageRating(b.id)) || 0
          return ratingB - ratingA
        case "members":
          const membersA = getMembershipsByClub(a.id).filter((m) => m.status === "active").length
          const membersB = getMembershipsByClub(b.id).filter((m) => m.status === "active").length
          return membersB - membersA
        case "recent":
          const dateA = new Date(a.createdAt || 0)
          const dateB = new Date(b.createdAt || 0)
          return dateB - dateA
        default:
          return 0
      }
    })

    return filtered
  }, [query, category, membership, sortBy, minRating, allClubs])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  // Reset to page 1 when filters change
  function handleFilterChange(setter) {
    return (v) => {
      setter(v)
      setPage(1)
    }
  }

  function openModal(club) {
    setSelected(club)
    setOpen(true)
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6" style={{ backgroundColor: '#fdfceb' }}>
      <section className="mb-6">
        <h1 
          className="text-balance text-2xl font-semibold tracking-tight md:text-3xl"
          style={{ color: '#22112a' }}
        >
          Explore Student Clubs
        </h1>
        <p 
          className="text-pretty text-sm md:text-base"
          style={{ color: '#4a3a4f' }}
        >
          Browse clubs by category and membership. Use quick view or open a full details page.
        </p>
      </section>

      <SearchFilters
        query={query}
        setQuery={handleFilterChange(setQuery)}
        category={category}
        setCategory={handleFilterChange(setCategory)}
        membership={membership}
        setMembership={handleFilterChange(setMembership)}
        categories={categories}
        memberships={membershipTypes}
        sortBy={sortBy}
        setSortBy={handleFilterChange(setSortBy)}
        minRating={minRating}
        setMinRating={handleFilterChange(setMinRating)}
      />

      <section className="mt-6" aria-label="Club results">
        <p 
          className="mb-3 text-sm font-medium"
          style={{ color: '#4a3a4f' }}
        >
          Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {paginated.map((club, index) => (
            <div
              key={club.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <ClubCard3D club={club} onOpen={openModal} />
            </div>
          ))}
        </div>

        {filtered.length > PAGE_SIZE && (
          <div className="mt-6 flex justify-center">
            <Pagination aria-label="Pagination">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.max(1, p - 1))
                    }}
                    aria-disabled={page === 1}
                    className={page === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {Array.from({ length: totalPages })
                  .slice(0, 3)
                  .map((_, i) => {
                    const index = i + 1
                    return (
                      <PaginationItem key={index}>
                        <PaginationLink
                          href="#"
                          isActive={page === index}
                          onClick={(e) => {
                            e.preventDefault()
                            setPage(index)
                          }}
                        >
                          {index}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                {totalPages > 3 && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        isActive={page === totalPages}
                        onClick={(e) => {
                          e.preventDefault()
                          setPage(totalPages)
                        }}
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      setPage((p) => Math.min(totalPages, p + 1))
                    }}
                    aria-disabled={page === totalPages}
                    className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </section>

      <ClubModal open={open} onOpenChange={setOpen} club={selected} />
    </main>
  )
}
