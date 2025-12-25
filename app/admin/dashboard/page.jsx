"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiRequest } from "@/lib/api-client"

const approverEmails = (process.env.NEXT_PUBLIC_APPROVER_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [pendingClubs, setPendingClubs] = useState([])
  const [allClubs, setAllClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [error, setError] = useState("")

  // Initialize currentUser from localStorage immediately
  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setCurrentUser(user)
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  useEffect(() => {
    const init = async () => {
      const userString = localStorage.getItem("currentUser")
      if (!userString) {
        router.push("/sign-in")
        return
      }

      const cachedUser = JSON.parse(userString)
      // Ensure currentUser is set
      setCurrentUser(cachedUser)

      try {
        const cachedUserId = cachedUser?.id || cachedUser?._id
        if (!cachedUserId) {
          router.push("/sign-in")
          return
        }

        const { user } = await apiRequest(`/users/id/${cachedUserId}`)

        const assignedClubId = user?.assignedClubId
        const hasAssignedClub =
          assignedClubId !== undefined &&
          assignedClubId !== null &&
          String(assignedClubId).trim() !== "" &&
          String(assignedClubId).trim().toLowerCase() !== "null" &&
          String(assignedClubId).trim().toLowerCase() !== "undefined"

        const isPageAdmin = user.role === "pageAdmin" || (user.role === "admin" && !hasAssignedClub)
        if (!isPageAdmin) {
          router.push("/")
          return
        }

        if (hasAssignedClub) {
          setError("Club admins cannot approve new clubs.")
          setLoading(false)
          return
        }

        if (approverEmails.length > 0 && !approverEmails.includes(user.email.toLowerCase())) {
          setError("You are not authorized to approve clubs.")
          setLoading(false)
          return
        }

        // Update with fresh user data
        setCurrentUser(user)
        await Promise.all([loadPendingClubs(), loadAllClubs()])
      } catch (err) {
        console.error("Admin dashboard auth check failed:", err)
        // Only redirect to sign-in if it's an auth error (401/403)
        if (err.status === 401 || err.status === 403) {
          router.push("/sign-in")
        } else {
          setError("Failed to verify admin access. Please try again.")
          setLoading(false)
        }
      }
    }

    init()
  }, [router])

  const loadPendingClubs = async () => {
    try {
      const response = await apiRequest("/clubs?status=pending")
      console.log("Pending clubs response:", response)
      setPendingClubs(response.clubs || [])
    } catch (err) {
      console.error("Failed to load pending clubs:", err)
    }
  }

  const loadAllClubs = async () => {
    try {
      const response = await apiRequest("/clubs?status=all")
      console.log("All clubs response:", response)
      setAllClubs(response.clubs || [])
    } catch (err) {
      console.error("Failed to load all clubs:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteClub = async (clubId) => {
    if (!confirm("Delete this club? This will also remove its events, memberships, reviews, announcements and RSVPs.")) return
    setProcessing((prev) => ({ ...prev, [clubId]: "deleting" }))
    try {
      await apiRequest(`/clubs/${clubId}`, { method: "DELETE" })
      await Promise.all([loadPendingClubs(), loadAllClubs()])
    } catch (err) {
      console.error("Failed to delete club:", err)
      alert(err.message || "Failed to delete club.")
    } finally {
      setProcessing((prev) => ({ ...prev, [clubId]: null }))
    }
  }

  const handleApprove = async (clubId) => {
    if (!currentUser) {
      setError("User not authenticated")
      return
    }
    
    setProcessing((prev) => ({ ...prev, [clubId]: "approving" }))

    try {
      await apiRequest(`/clubs/${clubId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "approved",
          approverEmail: currentUser.email,
        }),
      })

      await Promise.all([loadPendingClubs(), loadAllClubs()])
    } catch (err) {
      console.error("Failed to approve club:", err)
      alert(err.message || "Failed to approve club.")
    } finally {
      setProcessing((prev) => ({ ...prev, [clubId]: null }))
    }
  }

  const handleReject = async (clubId) => {
    if (!currentUser) {
      setError("User not authenticated")
      return
    }
    
    if (!confirm("Are you sure you want to reject this club?")) return

    setProcessing((prev) => ({ ...prev, [clubId]: "rejecting" }))

    try {
      await apiRequest(`/clubs/${clubId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "rejected",
          approverEmail: currentUser.email,
        }),
      })

      await Promise.all([loadPendingClubs(), loadAllClubs()])
    } catch (err) {
      console.error("Failed to reject club:", err)
      alert(err.message || "Failed to reject club.")
    } finally {
      setProcessing((prev) => ({ ...prev, [clubId]: null }))
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24">
        <div className="mx-auto max-w-3xl px-4">
          <Card>
            <CardHeader>
              <CardTitle>Admin Access Restricted</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/">
                <Button variant="outline">Return Home</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 bg-background">
      <div className="mx-auto max-w-6xl px-4 space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage club approvals and oversee all clubs</p>
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">Pending Club Approvals</h2>
              <Badge variant="secondary" className="text-sm">
                {pendingClubs.length} {pendingClubs.length === 1 ? 'Request' : 'Requests'}
              </Badge>
            </div>

            {pendingClubs.length === 0 ? (
              <Card className="border-dashed border-muted-foreground/25">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">No pending requests</h3>
                      <p className="text-sm text-muted-foreground mt-1">All club requests have been processed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {pendingClubs.map((club) => (
                  <Card key={club.id || club._id} className="overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <CardTitle className="text-xl text-foreground">{club.name || 'Unnamed Club'}</CardTitle>
                          <div className="flex gap-2 flex-wrap">
                            <Badge variant="secondary">{club.category || 'Uncategorized'}</Badge>
                            <Badge variant="outline" className="text-orange-600 border-orange-600">Pending Approval</Badge>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Description</h4>
                        <p className="text-sm text-foreground leading-relaxed">
                          {club.fullDescription || club.shortDescription || 'No description available'}
                        </p>
                      </div>
                      
                      {club.email && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium text-muted-foreground">Contact Information</h4>
                          <p className="text-sm text-foreground">{club.email}</p>
                        </div>
                      )}

                      <div className="flex gap-3 pt-2">
                        <Button
                          onClick={() => handleApprove(club.id || club._id)}
                          disabled={processing[club.id || club._id]}
                          className="bg-green-600 hover:bg-green-700 text-white min-w-[100px]"
                        >
                          {processing[club.id || club._id] === "approving" ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Approving...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Approve
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={() => handleReject(club.id || club._id)}
                          disabled={processing[club.id || club._id]}
                          variant="destructive"
                          className="min-w-[100px]"
                        >
                          {processing[club.id || club._id] === "rejecting" ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Rejecting...
                            </>
                          ) : (
                            <>
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                              Reject
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">All Clubs</h2>
              <Badge variant="secondary" className="text-sm">
                {allClubs.length} {allClubs.length === 1 ? 'Club' : 'Clubs'}
              </Badge>
            </div>

            {allClubs.length === 0 ? (
              <Card className="border-dashed border-muted-foreground/25">
                <CardContent className="pt-8 pb-8 text-center">
                  <div className="space-y-3">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-foreground">No clubs found</h3>
                      <p className="text-sm text-muted-foreground mt-1">No clubs have been created yet</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {allClubs.map((club) => (
                  <Card key={club.id || club._id} className="overflow-hidden">
                    <CardHeader className="pb-3">
                      <div className="space-y-2">
                        <CardTitle className="text-lg text-foreground leading-tight">{club.name || 'Unnamed Club'}</CardTitle>
                        <div className="flex gap-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">{club.category || 'Uncategorized'}</Badge>
                          <Badge 
                            variant={club.status === 'approved' ? 'default' : club.status === 'rejected' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {club.status || "approved"}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {club.shortDescription || club.fullDescription || 'No description available'}
                      </p>
                      
                      <div className="flex gap-2 pt-2">
                        <Link href={`/clubs/${club.slug}`} className="flex-1">
                          <Button size="sm" variant="outline" className="w-full">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Button>
                        </Link>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={processing[club.id || club._id]}
                          onClick={() => handleDeleteClub(club.id || club._id)}
                          className="px-3"
                        >
                          {processing[club.id || club._id] === "deleting" ? (
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
