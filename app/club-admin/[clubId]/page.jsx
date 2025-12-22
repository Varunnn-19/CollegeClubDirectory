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
import { Users, Calendar, Bell, Settings, X, Plus, Edit, Trash2 } from "lucide-react"

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
      const [allMembers, clubEvents, clubAnnouncements] = await Promise.all([
        getMembershipsByClub(clubId),
        getEventsByClub(clubId),
        getAnnouncementsByClub(clubId),
      ])
      setMembers(allMembers)
      setEvents(clubEvents)
      setAnnouncements(clubAnnouncements)
    } catch (err) {
      console.error(err)
      setError("Failed to load club data.")
    }
  }, [clubId])

  useEffect(() => {
    if (!clubId) {
      router.push("/")
      return
    }
    
    const user = JSON.parse(localStorage.getItem("currentUser") || "null")

    if (!user || user.role !== "admin" || user.assignedClubId !== clubId) {
      router.push("/")
      return
    }

    setCurrentUser(user)

    const initialize = async () => {
      try {
        const allClubs = await getClubs()
        const clubData = allClubs.find((c) => c.id === clubId)
        if (!clubData) {
          setError("Club not found")
          return
        }

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
      } catch (err) {
        setError("Failed to load club information.")
      } finally {
        setLoading(false)
      }
    }

    initialize()
  }, [clubId, router, loadData])



  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")

    try {
      const updated = await updateClub(clubId, formData)
      setClub(updated)
      setSuccess("Club details updated successfully!")
      setEditMode(false)
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError(err.message || "Failed to save club details")
    }
  }

  const handleApproveMember = async (membershipId) => {
    try {
    const membership = members.find((m) => m.id === membershipId)
    if (!membership) return
    await updateMembership(membershipId, { status: "active" })
    await loadData()
    setSuccess("Member approved!")
    setTimeout(() => setSuccess(""), 3000)
  } catch (err) { setError(err.message || "Error"); }
    }

  const handleRejectMember = async (membershipId) => {
    try {
    const membership = members.find((m) => m.id === membershipId)
    if (!membership) return
    await updateMembership(membershipId, { status: "rejected" })
    await loadData()
    setSuccess("Member request rejected")
    setTimeout(() => setSuccess(""), 3000)
  } catch (err) { setError(err.message || "Error"); }
    }

  const handleSaveEvent = async (e) => {
    e.preventDefault()
    const event = {
      id: editingEvent?.id,
      clubId: clubId,
      title: eventForm.title,
      date: eventForm.date,
      time: eventForm.time,
      location: eventForm.location,
      description: eventForm.description,
      createdBy: currentUser.id,
    }

    await saveEvent(event)
    await loadData()
    setShowEventDialog(false)
    setEventForm({ title: "", date: "", time: "", location: "", description: "" })
    setEditingEvent(null)
    setSuccess("Event saved successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleDeleteEvent = async (eventId) => {
    if (confirm("Are you sure you want to delete this event?")) {
      await deleteEvent(eventId)
      await loadData()
      setSuccess("Event deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time || "",
      location: event.location,
      description: event.description || "",
    })
    setShowEventDialog(true)
  }

  const handleSaveAnnouncement = async (e) => {
    e.preventDefault()
    const announcement = {
      id: editingAnnouncement?.id,
      clubId: clubId,
      title: announcementForm.title,
      content: announcementForm.content,
      priority: announcementForm.priority,
      createdBy: currentUser.id,
    }

    await saveAnnouncement(announcement)
    await loadData()
    setShowAnnouncementDialog(false)
    setAnnouncementForm({ title: "", content: "", priority: "medium" })
    setEditingAnnouncement(null)
    setSuccess("Announcement posted successfully!")
    setTimeout(() => setSuccess(""), 3000)
  }

  const handleDeleteAnnouncement = async (announcementId) => {
    if (confirm("Are you sure you want to delete this announcement?")) {
      await deleteAnnouncement(announcementId)
      await loadData()
      setSuccess("Announcement deleted successfully!")
      setTimeout(() => setSuccess(""), 3000)
    }
  }

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement)
    setAnnouncementForm({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority || "medium",
    })
    setShowAnnouncementDialog(true)
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  if (error && !club) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
            <Button onClick={() => router.push("/")} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const activeMembers = members.filter((m) => m.status === "active")
  const pendingMembers = members.filter((m) => m.status === "pending")

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">{club?.name} - Admin Panel</h1>
            <p className="text-muted-foreground mt-1">Manage your club</p>
          </div>
          <Link href="/">
            <Button variant="outline">Back to Directory</Button>
          </Link>
        </div>

        {success && (
          <div className="mb-6 p-4 bg-primary/10 border border-primary/20 rounded text-primary">{success}</div>
        )}
        {error && <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded text-destructive">{error}</div>}

        <Tabs defaultValue="members" className="mt-6">
          <TabsList>
            <TabsTrigger value="members">
              <Users className="h-4 w-4 mr-2" />
              Members ({activeMembers.length})
            </TabsTrigger>
            <TabsTrigger value="events">
              <Calendar className="h-4 w-4 mr-2" />
              Events ({events.length})
            </TabsTrigger>
            <TabsTrigger value="announcements">
              <Bell className="h-4 w-4 mr-2" />
              Announcements ({announcements.length})
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="members" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Club Members</CardTitle>
                <CardDescription>Manage club members and membership requests</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingMembers.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-medium mb-3">Pending Requests ({pendingMembers.length})</h3>
                    <div className="space-y-2">
                      {pendingMembers.map((member) => (
                        <Card key={member.id} className="bg-secondary/10 border-secondary/20">
                          <CardContent className="pt-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">{member.userName || "Unknown User"}</p>
                                <p className="text-sm text-muted-foreground">{member.userEmail || "No email"}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  Requested: {new Date(member.joinedAt).toLocaleDateString()}
                                </p>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveMember(member.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectMember(member.id)}
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <h3 className="font-medium mb-3">Active Members ({activeMembers.length})</h3>
                {activeMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No active members yet.</p>
                ) : (
                  <div className="space-y-2">
                    {activeMembers.map((member) => (
                      <Card key={member.id}>
                        <CardContent className="pt-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium">{member.userName || "Unknown User"}</p>
                              <p className="text-sm text-muted-foreground">{member.userEmail || "No email"}</p>
                              <Badge variant="secondary" className="mt-1">
                                {member.role}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Joined: {new Date(member.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Club Events</CardTitle>
                    <CardDescription>Create and manage club events</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingEvent(null)
                    setEventForm({ title: "", date: "", time: "", location: "", description: "" })
                    setShowEventDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Event
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {events.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No events yet. Create your first event!</p>
                ) : (
                  <div className="space-y-3">
                    {events.map((event) => {
                      const eventId = event.id || `${event.title}-${event.date}`
                      return (
                        <Card key={eventId}>
                          <CardContent className="pt-6">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h3 className="font-medium">{event.title}</h3>
                                {event.description && (
                                  <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                                )}
                                <div className="mt-2 text-sm text-muted-foreground">
                                  <p>
                                    {event.date} {event.time && `at ${event.time}`} • {event.location}
                                  </p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleEditEvent(event)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleDeleteEvent(eventId)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="announcements" className="mt-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Announcements</CardTitle>
                    <CardDescription>Post announcements to club members</CardDescription>
                  </div>
                  <Button onClick={() => {
                    setEditingAnnouncement(null)
                    setAnnouncementForm({ title: "", content: "", priority: "medium" })
                    setShowAnnouncementDialog(true)
                  }}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Announcement
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {announcements.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No announcements yet.</p>
                ) : (
                  <div className="space-y-3">
                    {announcements.map((announcement) => (
                      <Card key={announcement.id} className="bg-primary/10 border-primary/20">
                        <CardContent className="pt-6">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-medium">{announcement.title}</h3>
                                <Badge variant="outline">{announcement.priority}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{announcement.content}</p>
                              <p className="text-xs text-muted-foreground mt-2">
                                {new Date(announcement.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditAnnouncement(announcement)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteAnnouncement(announcement.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Club Settings</CardTitle>
                <CardDescription>Edit your club information</CardDescription>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form onSubmit={handleSave} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Club Name</label>
                      <Input name="name" value={formData.name} onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Short Description</label>
                      <Input
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        placeholder="Brief description for directory listings"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Full Description</label>
                      <Textarea
                        name="fullDescription"
                        value={formData.fullDescription}
                        onChange={handleChange}
                        placeholder="Detailed description of your club"
                        required
                        rows={4}
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Contact Email</label>
                      <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Meeting Times</label>
                      <Input
                        name="meetingTimes"
                        value={formData.meetingTimes}
                        onChange={handleChange}
                        placeholder="e.g., Mondays and Wednesdays, 6-8 PM"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium">Membership Type</label>
                      <Select
                        name="membershipType"
                        value={formData.membershipType}
                        onValueChange={(value) => setFormData((prev) => ({ ...prev, membershipType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2">
                      <Button type="submit" className="bg-green-600 hover:bg-green-700">
                        Save Changes
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Club Name</p>
                      <p className="font-medium">{formData.name}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Short Description</p>
                      <p className="font-medium">{formData.shortDescription}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Full Description</p>
                      <p className="font-medium whitespace-pre-wrap">{formData.fullDescription}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Contact Email</p>
                      <p className="font-medium">{formData.email}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Meeting Times</p>
                      <p className="font-medium">{formData.meetingTimes}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Membership Type</p>
                      <p className="font-medium">{formData.membershipType}</p>
                    </div>

                    <Button onClick={() => setEditMode(true)} className="bg-blue-600 hover:bg-blue-700">
                      Edit Club Details
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Event Dialog */}
        <Dialog open={showEventDialog} onOpenChange={setShowEventDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingEvent ? "Edit Event" : "Create New Event"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveEvent} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Event Title</label>
                <Input
                  value={eventForm.title}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Date</label>
                <Input
                  type="date"
                  value={eventForm.date}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, date: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Time (optional)</label>
                <Input
                  type="time"
                  value={eventForm.time}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <div>
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={eventForm.location}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, location: e.target.value }))}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Description (optional)</label>
                <Textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingEvent ? "Update Event" : "Create Event"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowEventDialog(false)
                    setEditingEvent(null)
                    setEventForm({ title: "", date: "", time: "", location: "", description: "" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Announcement Dialog */}
        <Dialog open={showAnnouncementDialog} onOpenChange={setShowAnnouncementDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSaveAnnouncement} className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={announcementForm.title}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={announcementForm.content}
                  onChange={(e) =>
                    setAnnouncementForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  rows={4}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Priority</label>
                <Select
                  value={announcementForm.priority}
                  onValueChange={(value) =>
                    setAnnouncementForm((prev) => ({ ...prev, priority: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingAnnouncement ? "Update Announcement" : "Post Announcement"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAnnouncementDialog(false)
                    setEditingAnnouncement(null)
                    setAnnouncementForm({ title: "", content: "", priority: "medium" })
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
