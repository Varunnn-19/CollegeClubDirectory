"use client"

import { useEffect, useMemo, useState } from "react"
import { ClubCard3D } from "@/components/club-card-3d"
import { ClubModal } from "@/components/club-modal"
import { SearchFilters } from "@/components/search-filters"
import { categories, membershipTypes } from "@/lib/clubs"
import { getClubs } from "@/lib/data-utils"
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
  const [isClient, setIsClient] = useState(false)
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState("All")
  const [membership, setMembership] = useState("All")
  const [sortBy, setSortBy] = useState("name")
  const [minRating, setMinRating] = useState("0")
  const [page, setPage] = useState(1)
  const [selected, setSelected] = useState(null)
  const [open, setOpen] = useState(false)
  const [allClubs, setAllClubs] = useState([])
  const [loadingClubs, setLoadingClubs] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        const data = await getClubs()
        if (mounted) {
          setAllClubs(data)
        }
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load clubs.")
      } finally {
        if (mounted) setLoadingClubs(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  // Filter and sort clubs
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    let filtered = allClubs.filter((c) => {
      const matchesQuery = q
        ? (c.name || '').toLowerCase().includes(q) ||
          (c.shortDescription || '').toLowerCase().includes(q) ||
          (c.fullDescription || '').toLowerCase().includes(q)
        : true
      const matchesCategory = category === "All" ? true : (c.category || 'Uncategorized') === category
      const matchesMembership = membership === "All" ? true : (c.membershipType || 'Open') === membership
      
      // Rating filter
      if (minRating !== "0") {
        const rating = parseFloat(c.stats?.rating || 0)
        if (rating < parseFloat(minRating)) return false
      }
      
      return matchesQuery && matchesCategory && matchesMembership
    })

    // Sorting
    filtered = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return (a.name || '').localeCompare(b.name || '')
        case "name-desc":
          return (b.name || '').localeCompare(a.name || '')
        case "rating":
          return (parseFloat(b.stats?.rating || 0) ?? 0) - (parseFloat(a.stats?.rating || 0) ?? 0)
        case "members":
          return (b.stats?.memberCount || 0) - (a.stats?.memberCount || 0)
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

  if (loadingClubs) {
    return <div className="min-h-screen flex items-center justify-center">Loading clubs...</div>
  }

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
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 bg-background">
      <section className="mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight md:text-3xl text-foreground">
          Explore Student Clubs
        </h1>
        <p className="text-pretty text-sm md:text-base text-muted-foreground">
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
        <p className="mb-3 text-sm font-medium text-foreground">
          Showing {filtered.length} result{filtered.length === 1 ? "" : "s"}
        </p>

        {error && <p className="text-sm text-destructive mb-4">{error}</p>}

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
