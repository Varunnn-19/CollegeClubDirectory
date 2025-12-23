"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ExternalLink, LogOut } from "lucide-react"
import {
  getMembershipsByUser,
  getClubs,
  deleteMembership,
} from "@/lib/data-utils"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [memberships, setMemberships] = useState([])
  const [clubs, setClubs] = useState([])

  useEffect(() => {
    const load = async () => {
      const u = JSON.parse(localStorage.getItem("currentUser") || "null")
      if (!u) return router.push("/sign-in")

      setUser(u)

      const [m, c] = await Promise.all([
        getMembershipsByUser(u.id),
        getClubs(),
      ])

      setMemberships(m)
      setClubs(c)
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
    await deleteMembership(user.id, clubId)
    setMemberships((prev) => prev.filter((m) => m.clubId !== clubId))
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
        </TabsContent>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Account Info</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <Badge className="mt-2">
                {user.role === "admin"
                  ? user.assignedClubId
                    ? "Club Admin"
                    : "Page Admin"
                  : "Student"}
              </Badge>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
