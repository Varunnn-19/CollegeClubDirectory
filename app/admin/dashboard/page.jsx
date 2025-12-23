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
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [error, setError] = useState("")

  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (!userString) {
      router.push("/sign-in")
      return
    }

    const user = JSON.parse(userString)

    if (user.role !== "admin") {
      router.push("/")
      return
    }

    if (user.assignedClubId) {
      setError("Club admins cannot approve new clubs.")
      setLoading(false)
      return
    }

    if (approverEmails.length > 0 && !approverEmails.includes(user.email.toLowerCase())) {
      setError("You are not authorized to approve clubs.")
      setLoading(false)
      return
    }

    setCurrentUser(user)
    loadPendingClubs()
  }, [router])

  const loadPendingClubs = async () => {
    try {
      const response = await apiRequest("/clubs?status=pending")
      setPendingClubs(response.clubs || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (clubId) => {
    setProcessing((prev) => ({ ...prev, [clubId]: "approving" }))

    try {
      await apiRequest(`/clubs/${clubId}`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "approved",
          approverEmail: currentUser.email,
        }),
      })

      await loadPendingClubs()
    } catch (err) {
      console.error("Failed to approve club:", err)
      alert(err.message || "Failed to approve club.")
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
        body: JSON.stringify({
          status: "rejected",
          approverEmail: currentUser.email,
        }),
      })

      await loadPendingClubs()
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
    <div className="min-h-screen pt-24">
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard - Club Approvals</h1>

        {pendingClubs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
              No pending club requests.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {pendingClubs.map((club) => (
              <Card key={club.id}>
                <CardHeader>
                  <CardTitle>{club.name}</CardTitle>
                  <div className="flex gap-2">
                    <Badge>{club.category}</Badge>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-4">{club.fullDescription}</p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleApprove(club.id)}
                      disabled={processing[club.id]}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {processing[club.id] === "approving" ? "Approving..." : "Approve"}
                    </Button>
                    <Button
                      onClick={() => handleReject(club.id)}
                      disabled={processing[club.id]}
                      variant="destructive"
                    >
                      {processing[club.id] === "rejecting" ? "Rejecting..." : "Reject"}
                    </Button>
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
