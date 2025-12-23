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
  getEventsByClub,
  saveEvent,
  deleteEvent,
  getAnnouncementsByClub,
  saveAnnouncement,
  deleteAnnouncement,
  updateClub,
} from "@/lib/data-utils"
import { apiRequest } from "@/lib/api-client"
import { Users, Calendar, Bell, Settings, Plus, Edit, Trash2 } from "lucide-react"

export default function ClubAdminPage() {
  const router = useRouter()
  const params = useParams()
  const clubId = params?.clubId

  const [currentUser, setCurrentUser] = useState(null)
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [showEventDialog, setShowEventDialog] = useState(false)
  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [editingAnnouncement, setEditingAnnouncement] = useState(null)

  const [formData, setFormData] = useState({
    name: "",
    shortDescription: "",
    fullDescription: "",
    email: "",
    meetingTimes: "",
    membershipType: "",
  })

  const [eventForm, setEventForm] = useState({
    title: "",
    date: "",
    time: "",
    location: "",
    description: "",
  })

  const [announcementForm, setAnnouncementForm] = useState({
    title: "",
    content: "",
    priority: "medium",
  })

  const loadData = useCallback(async () => {
    try {
      const [membersData, eventsData, announcementsData] = await Promise.all([
        getMembershipsByClub(clubId),
        getEventsByClub(clubId),
        getAnnouncementsByClub(clubId),
      ])
      setMembers(membersData)
      setEvents(eventsData)
      setAnnouncements(announcementsData)
    } catch (err) {
      setError("Failed to load club data.")
    }
  }, [clubId])

  useEffect(() => {
    if (!clubId) return router.push("/")

    const user = JSON.parse(localStorage.getItem("currentUser") || "null")

    // 🔐 CLUB ADMIN ONLY
    if (!user || user.role !== "club_admin" || user.assignedClubId !== clubId) {
      router.push("/")
      return
    }

    setCurrentUser(user)

    const init = async () => {
      try {
        const clubs = await getClubs()
        const clubData = clubs.find((c) => String(c.id) === String(clubId))
        if (!clubData) return setError("Club not found")

        setClub(clubData)
        setFormData({
          name: clubData.name,
          shortDescription: clubData.shortDescription,
          fullDescription: clubData.fullDescription,
          email: clubData.email,
          meetingTimes: clubData.meetingTimes,
          membershipType: clubData.membershipType,
        })

        await loadData()
      } catch {
        setError("Failed to load club")
      } finally {
        setLoading(false)
      }
    }

    init()
  }, [clubId, router, loadData])

  /* ======================
     MEMBERSHIP ACTIONS
  ====================== */

  const handleApproveMember = async (id) => {
    try {
      await apiRequest(`/memberships/admin/${id}/approve`, { method: "PATCH" })
      await loadData()
      setSuccess("Member approved")
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Failed to approve member")
    }
  }

  const handleRejectMember = async (id) => {
    try {
      await apiRequest(`/memberships/admin/${id}/reject`, { method: "PATCH" })
      await loadData()
      setSuccess("Member rejected")
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Failed to reject member")
    }
  }

  /* ======================
     SAVE CLUB SETTINGS
  ====================== */

  const handleSaveClub = async (e) => {
    e.preventDefault()
    try {
      const updated = await updateClub(clubId, formData)
      setClub(updated)
      setEditMode(false)
      setSuccess("Club updated")
      setTimeout(() => setSuccess(""), 3000)
    } catch {
      setError("Failed to update club")
    }
  }

  /* ======================
     STATUS FILTERS
  ====================== */

  const pendingMembers = members.filter((m) => m.status === "pending")
  const activeMembers = members.filter((m) => m.status === "joined")

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading…</div>

  return (
    <div className="min-h-screen bg-background p-6 max-w-6xl mx-auto">
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">{club?.name} – Admin</h1>
        <Link href="/"><Button variant="outline">Back</Button></Link>
      </div>

      {success && <div className="mb-4 p-3 bg-green-500/10 text-green-600">{success}</div>}
      {error && <div className="mb-4 p-3 bg-red-500/10 text-red-600">{error}</div>}

      <Tabs defaultValue="members">
        <TabsList>
          <TabsTrigger value="members"><Users className="mr-2 h-4 w-4" /> Members</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4" /> Settings</TabsTrigger>
        </TabsList>

        {/* MEMBERS TAB */}
        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Pending Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingMembers.length === 0 && <p>No pending requests</p>}
              {pendingMembers.map((m) => (
                <div key={m._id} className="flex justify-between mb-2">
                  <div>
                    <p>{m.userName}</p>
                    <p className="text-xs">{m.userEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleApproveMember(m._id)}>Approve</Button>
                    <Button size="sm" variant="outline" onClick={() => handleRejectMember(m._id)}>Reject</Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SETTINGS TAB */}
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Club Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveClub} className="space-y-4">
                <Input name="name" value={formData.name} onChange={(e)=>setFormData({...formData,name:e.target.value})} />
                <Textarea name="shortDescription" value={formData.shortDescription} onChange={(e)=>setFormData({...formData,shortDescription:e.target.value})} />
                <Textarea name="fullDescription" value={formData.fullDescription} onChange={(e)=>setFormData({...formData,fullDescription:e.target.value})} />
                <Button type="submit">Save</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
