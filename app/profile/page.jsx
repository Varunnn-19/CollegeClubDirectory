"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { ExternalLink, LogOut } from "lucide-react"
import {
  getMembershipsByUser,
  getClubs,
  deleteMembership,
} from "@/lib/data-utils"
import { apiRequest } from "@/lib/api-client"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [memberships, setMemberships] = useState([])
  const [clubs, setClubs] = useState([])
  const [pendingClubs, setPendingClubs] = useState([])
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: "", phoneNumber: "", yearOfStudy: "" })
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")

  // Initialize user from localStorage immediately
  useEffect(() => {
    const userString = localStorage.getItem("currentUser")
    if (userString) {
      try {
        const user = JSON.parse(userString)
        setUser(user)
      } catch (err) {
        console.error("Failed to parse user from localStorage:", err)
        localStorage.removeItem("currentUser")
      }
    }
  }, [])

  useEffect(() => {
    const load = async () => {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!u) return router.push("/sign-in")

      const userId = u.id || u._id

      // Ensure user is set
      setUser(u)

      try {
        const fresh = await apiRequest(`/users/id/${userId}`)
        const nextUser = fresh?.user || u
        setUser(nextUser)
        localStorage.setItem("currentUser", JSON.stringify(nextUser))
        setForm({
          name: nextUser.name || "",
          phoneNumber: nextUser.phoneNumber || "",
          yearOfStudy: nextUser.yearOfStudy || "",
        })
      } catch {
        setUser(u)
        setForm({
          name: u.name || "",
          phoneNumber: u.phoneNumber || "",
          yearOfStudy: u.yearOfStudy || "",
        })
      }

      const [m, c, pending] = await Promise.all([
        getMembershipsByUser(userId),
        getClubs(),
        apiRequest("/clubs?status=pending").then(r => r.clubs || []).catch(() => [])
      ])

      setMemberships(m)
      setClubs(c)
      setPendingClubs(pending.filter(club => String(club.createdBy) === String(userId)))
    }

    load()
  }, [router])

  if (!user) return null

  // ✅ FIXED STATUS
  const joinedMemberships = memberships.filter((m) => m.status === "joined")

  const joinedClubs = clubs.filter((club) =>
    joinedMemberships.some(
      (m) => String(m.clubId) === String(club.id || club._id)
    )
  )

  const handleLeave = async (clubId) => {
    const userId = user.id || user._id
    await deleteMembership(userId, clubId)
    setMemberships((prev) => prev.filter((m) => String(m.clubId) !== String(clubId)))
  }

  const handleSaveProfile = async () => {
    setSaveError("")
    setSaveSuccess("")
    setSaving(true)

    const userId = user.id || user._id

    try {
      const { user: updated } = await apiRequest(`/users/id/${userId}`, {
        method: "PATCH",
        body: {
          name: form.name,
          phoneNumber: form.phoneNumber,
          yearOfStudy: form.yearOfStudy,
        },
      })

      setUser(updated)
      localStorage.setItem("currentUser", JSON.stringify(updated))
      window.dispatchEvent(new Event("auth-change"))
      setEditing(false)
      setSaveSuccess("Profile updated.")
    } catch (err) {
      setSaveError(err.message || "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>

      <Tabs defaultValue="clubs">
        <TabsList>
          <TabsTrigger value="clubs">My Clubs</TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
        </TabsList>

        <TabsContent value="clubs">
          <div className="space-y-6">
            {/* Pending Clubs */}
            {pendingClubs.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Pending Club Submissions</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {pendingClubs.map((club) => (
                    <Card key={club.id || club._id}>
                      <CardHeader>
                        <CardTitle>{club.name}</CardTitle>
                        <Badge variant="outline">Pending Approval</Badge>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{club.shortDescription}</p>
                        <p className="text-xs text-muted-foreground">
                          Submitted {new Date(club.createdAt).toLocaleDateString()}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Joined Clubs */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Joined Clubs</h3>
              {joinedClubs.length === 0 ? (
                <p>No joined clubs yet.</p>
              ) : (
                <div className="grid md:grid-cols-3 gap-4">
                  {joinedClubs.map((club) => (
                    <Card key={club.id || club._id}>
                      <CardHeader>
                        <CardTitle>{club.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm mb-4">{club.shortDescription}</p>
                        <div className="flex gap-2">
                          <Link href={`/clubs/${club.slug}`}>
                            <Button size="sm" variant="outline">
                              <ExternalLink className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleLeave(club.id || club._id)}
                          >
                            <LogOut className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              {saveError && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{saveError}</div>
              )}
              {saveSuccess && !saveError && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{saveSuccess}</div>
              )}

              <p><strong>Email:</strong> {user.email}</p>

              {editing ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <label className="text-sm font-medium">Name</label>
                    <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Phone Number</label>
                    <Input value={form.phoneNumber} onChange={(e) => setForm((p) => ({ ...p, phoneNumber: e.target.value }))} />
                  </div>

                  <div>
                    <label className="text-sm font-medium">Year of Study</label>
                    <select
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-sm"
                      value={form.yearOfStudy}
                      onChange={(e) => setForm((p) => ({ ...p, yearOfStudy: e.target.value }))}
                    >
                      <option value="">Select year</option>
                      <option value="1st">1st Year</option>
                      <option value="2nd">2nd Year</option>
                      <option value="3rd">3rd Year</option>
                      <option value="4th">4th Year</option>
                    </select>
                  </div>

                  <div className="flex gap-2">
                    <Button disabled={saving} onClick={handleSaveProfile}>
                      {saving ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      variant="outline"
                      disabled={saving}
                      onClick={() => {
                        setEditing(false)
                        setSaveError("")
                        setSaveSuccess("")
                        setForm({
                          name: user.name || "",
                          phoneNumber: user.phoneNumber || "",
                          yearOfStudy: user.yearOfStudy || "",
                        })
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>Phone:</strong> {user.phoneNumber || "-"}</p>
                  <p><strong>Year:</strong> {user.yearOfStudy || "-"}</p>
                  <Button className="mt-4" variant="outline" onClick={() => setEditing(true)}>
                    Edit Details
                  </Button>
                </>
              )}

              <Badge className="mt-2">
                {user.role === "pageAdmin"
                  ? "Page Admin"
                  : user.role === "clubAdmin" || user.role === "admin"
                    ? user.assignedClubId
                      ? "Club Admin"
                      : "Admin"
                    : "Student"}
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
