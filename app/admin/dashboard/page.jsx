"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { apiRequest } from "@/lib/api-client"

export default function AdminDashboard() {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState(null)
  const [pendingClubs, setPendingClubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")

    if (!user || user.role !== "admin") {
      router.push("/")
      return
    }

    setCurrentUser(user)
    loadPendingClubs()
  }, [router])

  const loadPendingClubs = async () => {
    try {
      const response = await apiRequest("/clubs?status=pending")
      setPendingClubs(response.clubs || [])
    } catch (error) {
      console.error("Failed to load pending clubs:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (clubId) => {
    setProcessing((prev) => ({ ...prev, [clubId]: "approving" }))
    try {
      // Find the club in the pending list to get createdBy
      const club = pendingClubs.find(c => c.id === clubId)
      
      // Approve the club
      await apiRequest(`/clubs/${clubId}`, {
        method: "PATCH",
        body: { status: "approved" },
      })
      
      // Promote the creator to admin for this club
      if (club?.createdBy) {
        try {
          await apiRequest(`/users/${club.createdBy}`, {
            method: "PATCH",
            body: { role: "admin", assignedClubId: clubId },
          })
        } catch (userError) {
          console.error("Failed to promote user to admin:", userError)
          // Continue even if user promotion fails
        }
      }
      
      await loadPendingClubs()
    } catch (error) {
      console.error("Failed to approve club:", error)
      alert("Failed to approve club. Please try again.")
    } finally {
      setProcessing((prev) => ({ ...prev, [clubId]: null }))
    }
  }

  const handleReject = async (clubId) => {
    if (!confirm("Are you sure you want to reject this club?")) return
    
    setProcessing((prev) => ({ ...prev, [clubId]: "rejecting" }))
    try {
      await apiRequest(`/clubs/${clubId}`, {
        method: "PATCH",
        body: { status: "rejected" },
      })
      await loadPendingClubs()
    } catch (error) {
      console.error("Failed to reject club:", error)
      alert("Failed to reject club. Please try again.")
    } finally {
      setProcessing((prev) => ({ ...prev, [clubId]: null }))
    }
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background pt-24">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard - Club Approvals</h1>
          <div className="flex gap-2">
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>

        {pendingClubs.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground py-8">No pending club requests at this time.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingClubs.map((club) => (
              <Card key={club.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-2">{club.name}</CardTitle>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <Badge variant="secondary">{club.category}</Badge>
                        <Badge>{club.membershipType}</Badge>
                        <Badge variant="outline" className="bg-yellow-500/20 text-yellow-600">
                          Pending Approval
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{club.shortDescription}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium mb-1">Full Description:</p>
                      <p className="text-sm text-muted-foreground">{club.fullDescription}</p>
                    </div>
                    {club.email && (
                      <div>
                        <p className="text-sm font-medium">Contact Email:</p>
                        <p className="text-sm text-muted-foreground">{club.email}</p>
                      </div>
                    )}
                    {club.meetingTimes && (
                      <div>
                        <p className="text-sm font-medium">Meeting Times:</p>
                        <p className="text-sm text-muted-foreground">{club.meetingTimes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-4 border-t">
                      <Button
                        onClick={() => handleApprove(club.id)}
                        disabled={processing[club.id] === "approving" || processing[club.id] === "rejecting"}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {processing[club.id] === "approving" ? "Approving..." : "Approve"}
                      </Button>
                      <Button
                        onClick={() => handleReject(club.id)}
                        disabled={processing[club.id] === "approving" || processing[club.id] === "rejecting"}
                        variant="destructive"
                      >
                        {processing[club.id] === "rejecting" ? "Rejecting..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
