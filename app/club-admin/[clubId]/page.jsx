"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  getClubs,
  getMembershipsByClub,
  updateMembership,
  getEventsByClub,
  saveEvent,
  deleteEvent,
  getAnnouncementsByClub,
  saveAnnouncement,
  deleteAnnouncement,
  updateClub,
} from "@/lib/data-utils"
import { Users, Calendar, Bell, Settings, Plus, Edit, Trash2 } from "lucide-react"

export default function ClubAdminPage() {
  const router = useRouter()
  const { clubId } = useParams()

  const [currentUser, setCurrentUser] = useState(null)
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const loadData = useCallback(async () => {
    const [members, events, announcements] = await Promise.all([
      getMembershipsByClub(clubId),
      getEventsByClub(clubId),
      getAnnouncementsByClub(clubId),
    ])
    setMembers(members)
    setEvents(events)
    setAnnouncements(announcements)
  }, [clubId])

  useEffect(() => {
    const init = async () => {
      const user = JSON.parse(localStorage.getItem("currentUser") || "null")

      // ✅ CORRECT AUTH CHECK (NO club_admin ROLE)
      if (
        !user ||
        user.role !== "admin" ||
        String(user.assignedClubId) !== String(clubId)
      ) {
        router.push("/")
        return
      }

      setCurrentUser(user)

      const clubs = await getClubs()
      const foundClub = clubs.find(
        (c) => String(c.id || c._id) === String(clubId)
      )

      if (!foundClub) {
        setError("Club not found")
        return
      }

      setClub(foundClub)
      await loadData()
      setLoading(false)
    }

    init()
  }, [clubId, router, loadData])

  const handleApproveMember = async (id) => {
    await updateMembership(id, { status: "joined" })
    await loadData()
  }

  const handleRejectMember = async (id) => {
    await updateMembership(id, { status: "rejected" })
    await loadData()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="text-red-600 text-center">{error}</div>

  const pendingMembers = members.filter((m) => m.status === "pending")
  const activeMembers = members.filter((m) => m.status === "joined")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{club.name} – Admin Panel</h1>

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members"><Users className="h-4 w-4 mr-2" />Members</TabsTrigger>
          <TabsTrigger value="events"><Calendar className="h-4 w-4 mr-2" />Events</TabsTrigger>
          <TabsTrigger value="announcements"><Bell className="h-4 w-4 mr-2" />Announcements</TabsTrigger>
        </TabsList>

        {/* MEMBERS */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {pendingMembers.map((m) => (
                <div key={m.id} className="flex justify-between items-center">
                  <div>
                    <p>{m.userName}</p>
                    <p className="text-sm text-muted-foreground">{m.userEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveMember(m.id)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectMember(m.id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Active Members</CardTitle>
            </CardHeader>
            <CardContent>
              {activeMembers.map((m) => (
                <div key={m.id} className="py-1">{m.userName}</div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
