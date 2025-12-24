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
  deleteMembershipById,
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
  const { clubId } = useParams()

  const [currentUser, setCurrentUser] = useState(null)
  const [club, setClub] = useState(null)
  const [members, setMembers] = useState([])
  const [events, setEvents] = useState([])
  const [announcements, setAnnouncements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const [showEventDialog, setShowEventDialog] = useState(false)
  const [eventForm, setEventForm] = useState({ title: "", description: "", date: "", time: "", location: "" })

  const [showAnnouncementDialog, setShowAnnouncementDialog] = useState(false)
  const [announcementForm, setAnnouncementForm] = useState({ title: "", content: "", priority: "medium" })

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
      const cachedUser = JSON.parse(localStorage.getItem("currentUser") || "null")
      const cachedUserId = cachedUser?.id || cachedUser?._id
      if (!cachedUserId) {
        router.push("/sign-in")
        return
      }

      // Ensure currentUser is set
      setCurrentUser(cachedUser)

      try {
        const { user } = await apiRequest(`/users/id/${cachedUserId}`)

        const isClubAdmin = user?.role === "clubAdmin" || user?.role === "admin"
        if (!isClubAdmin || String(user.assignedClubId) !== String(clubId)) {
          router.push("/")
          return
        }

        setCurrentUser(user)
      } catch (_err) {
        router.push("/sign-in")
        return
      }

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

  const handleRemoveMember = async (id) => {
    if (!confirm("Remove this member from the club?")) return
    await deleteMembershipById(id)
    await loadData()
  }

  const handleCreateEvent = async () => {
    setError("")
    setSuccess("")
    try {
      await saveEvent({
        clubId: String(clubId),
        title: eventForm.title,
        description: eventForm.description,
        date: eventForm.date,
        time: eventForm.time,
        location: eventForm.location,
        createdBy: currentUser?.id || currentUser?._id || "",
      })
      setShowEventDialog(false)
      setEventForm({ title: "", description: "", date: "", time: "", location: "" })
      await loadData()
      setSuccess("Event saved.")
    } catch (err) {
      setError(err.message || "Failed to save event.")
    }
  }

  const handleDeleteEvent = async (id) => {
    if (!confirm("Delete this event?")) return
    setError("")
    setSuccess("")
    try {
      await deleteEvent(id)
      await loadData()
      setSuccess("Event deleted.")
    } catch (err) {
      setError(err.message || "Failed to delete event.")
    }
  }

  const handleCreateAnnouncement = async () => {
    setError("")
    setSuccess("")
    try {
      await saveAnnouncement({
        clubId: String(clubId),
        title: announcementForm.title,
        content: announcementForm.content,
        priority: announcementForm.priority,
        createdBy: currentUser?.email || "",
      })
      setShowAnnouncementDialog(false)
      setAnnouncementForm({ title: "", content: "", priority: "medium" })
      await loadData()
      setSuccess("Announcement saved.")
    } catch (err) {
      setError(err.message || "Failed to save announcement.")
    }
  }

  const handleDeleteAnnouncement = async (id) => {
    if (!confirm("Delete this announcement?")) return
    setError("")
    setSuccess("")
    try {
      await deleteAnnouncement(id)
      await loadData()
      setSuccess("Announcement deleted.")
    } catch (err) {
      setError(err.message || "Failed to delete announcement.")
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (error) return <div className="text-red-600 text-center">{error}</div>

  const pendingMembers = members.filter((m) => m.status === "pending")
  const activeMembers = members.filter((m) => m.status === "joined")

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">{club.name} – Admin Panel</h1>

      {success && !error && (
        <div className="mb-4 p-3 rounded bg-primary/10 border border-primary/20 text-sm text-foreground">
          {success}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 rounded bg-destructive/10 border border-destructive/20 text-sm text-destructive">
          {error}
        </div>
      )}

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
                <div key={m.id} className="flex items-center justify-between py-1">
                  <div>{m.userName}</div>
                  <Button size="sm" variant="destructive" onClick={() => handleRemoveMember(m.id)}>
                    Remove
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Events</h2>
            <Button size="sm" onClick={() => setShowEventDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Event
            </Button>
          </div>

          <div className="space-y-3">
            {events.length === 0 ? (
              <Card><CardContent className="pt-6 text-sm text-muted-foreground">No events yet.</CardContent></Card>
            ) : (
              events.map((evt) => (
                <Card key={evt.id || evt._id}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{evt.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {evt.date}{evt.time ? ` • ${evt.time}` : ""}{evt.location ? ` • ${evt.location}` : ""}
                      </div>
                      {evt.description ? (
                        <div className="text-sm mt-2">{evt.description}</div>
                      ) : null}
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteEvent(evt.id || evt._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Event</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={eventForm.title} onChange={(e) => setEventForm((p) => ({ ...p, title: e.target.value }))} />
                <Textarea placeholder="Description" value={eventForm.description} onChange={(e) => setEventForm((p) => ({ ...p, description: e.target.value }))} />
                <Input placeholder="Date" value={eventForm.date} onChange={(e) => setEventForm((p) => ({ ...p, date: e.target.value }))} />
                <Input placeholder="Time" value={eventForm.time} onChange={(e) => setEventForm((p) => ({ ...p, time: e.target.value }))} />
                <Input placeholder="Location" value={eventForm.location} onChange={(e) => setEventForm((p) => ({ ...p, location: e.target.value }))} />
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowEventDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateEvent}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="announcements">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Announcements</h2>
            <Button size="sm" onClick={() => setShowAnnouncementDialog(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Announcement
            </Button>
          </div>

          <div className="space-y-3">
            {announcements.length === 0 ? (
              <Card><CardContent className="pt-6 text-sm text-muted-foreground">No announcements yet.</CardContent></Card>
            ) : (
              announcements.map((a) => (
                <Card key={a.id || a._id}>
                  <CardContent className="pt-6 flex items-start justify-between">
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{a.priority}</div>
                      <div className="text-sm mt-2">{a.content}</div>
                    </div>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteAnnouncement(a.id || a._id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Announcement</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input placeholder="Title" value={announcementForm.title} onChange={(e) => setAnnouncementForm((p) => ({ ...p, title: e.target.value }))} />
                <Textarea placeholder="Content" value={announcementForm.content} onChange={(e) => setAnnouncementForm((p) => ({ ...p, content: e.target.value }))} />
                <Select value={announcementForm.priority} onValueChange={(v) => setAnnouncementForm((p) => ({ ...p, priority: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">low</SelectItem>
                    <SelectItem value="medium">medium</SelectItem>
                    <SelectItem value="high">high</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2 justify-end">
                  <Button variant="outline" onClick={() => setShowAnnouncementDialog(false)}>Cancel</Button>
                  <Button onClick={handleCreateAnnouncement}>Save</Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </TabsContent>
      </Tabs>
    </div>
  )
}
