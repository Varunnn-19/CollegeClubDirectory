import { apiRequest } from "./api-client"
import { clubs as staticClubs } from "./clubs"

// Clubs
export const getClubs = async () => {
  try {
    const data = await apiRequest("/clubs")
    return (data.clubs && data.clubs.length > 0) ? data.clubs : staticClubs
  } catch (error) {
    console.error("API getClubs failed, using static data", error)
    return staticClubs
  }
}

export const getClubDetail = async (slug) => {
  if (!slug) return null
  try {
    const clubs = await getClubs()
    const club = clubs.find((c) => c.slug === slug)
    if (club) {
          const dbClub = await apiRequest(`/clubs?slug=${slug}`).then(res => res.clubs?.[0])
          if (!dbClub || !dbClub._id) {
      const fallbackClub = staticClubs.find((c) => c.slug === slug)
      return fallbackClub ? { club: fallbackClub, stats: {} } : null
    }
      const data = await apiRequest(`/clubs/${dbClub._id}`)
      return data
    }
    return null
  } catch (err) {
    console.error("API getClubDetail failed, using static data", err)
    const fallbackClub = staticClubs.find((c) => c.slug === slug)
    return fallbackClub ? { club: fallbackClub, stats: {} } : null
  }
}

export const saveClub = async (club) => {
  return apiRequest("/clubs", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(club),
  })
}


export const updateClub = async (clubId, updates) => {
  const data = await apiRequest(`/clubs/${clubId}`, { method: "PATCH", body: updates })
  return data.club
}

export const deleteClub = async (clubId) => {
  await apiRequest(`/clubs/${clubId}`, { method: "DELETE" })
}

// Memberships
export const getMembershipsByUser = async (userId) => {
  if (!userId) return []
  const data = await apiRequest(`/memberships/user/${userId}`)
  return data.memberships || []
}

export const getMembershipsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/memberships/club/${clubId}`)
  return data.memberships || []
}

export const saveMembership = async (membership) => {
  const data = await apiRequest("/memberships", { method: "POST", body: membership })
  return data.membership
}

export const deleteMembership = async (userId, clubId) => {
  if (!userId || !clubId) return
  // Find membership ID first
  const memberships = await getMembershipsByUser(userId)
  const m = memberships.find(m => m.clubId === clubId)
  if (m) {
    await apiRequest(`/memberships/${m.id || m._id}`, { method: "DELETE" })
  }
}

export const updateMembership = async (membershipId, updates) => {
  const data = await apiRequest(`/memberships/${membershipId}`, { method: "PATCH", body: updates })
  return data.membership
}

// Events
export const getEvents = async () => {
  const data = await apiRequest("/events")
  return data.events || []
}

export const getEventsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/events/club/${clubId}`)
  return data.events || []
}

export const saveEvent = async (event) => {
  if (event.id || event._id) {
    const data = await apiRequest(`/events/${event.id || event._id}`, { method: "PUT", body: event })
    return data.event
  }
  const data = await apiRequest("/events", { method: "POST", body: event })
  return data.event
}

export const deleteEvent = async (eventId) => {
  if (!eventId) return
  await apiRequest(`/events/${eventId}`, { method: "DELETE" })
}

// RSVPs
export const getEventRSVPsByUser = async (userId) => {
  if (!userId) return []
  const data = await apiRequest(`/rsvps/user/${userId}`)
  return data.rsvps || []
}

export const getEventRSVPsByEvent = async (eventId) => {
  if (!eventId) return []
  const data = await apiRequest(`/rsvps/event/${eventId}`)
  return data.rsvps || []
}

export const saveEventRSVP = async (rsvp) => {
  const data = await apiRequest("/rsvps", { method: "POST", body: rsvp })
  return data.rsvp
}

// Announcements
export const getAnnouncements = async () => {
  const data = await apiRequest("/announcements")
  return data.announcements || []
}

export const getAnnouncementsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/announcements/club/${clubId}`)
  return data.announcements || []
}

export const saveAnnouncement = async (announcement) => {
  if (announcement.id || announcement._id) {
    const data = await apiRequest(`/announcements/${announcement.id || announcement._id}`, { method: "PUT", body: announcement })
    return data.announcement
  }
  const data = await apiRequest("/announcements", { method: "POST", body: announcement })
  return data.announcement
}

export const deleteAnnouncement = async (announcementId) => {
  if (!announcementId) return
  await apiRequest(`/announcements/${announcementId}`, { method: "DELETE" })
}

// Reviews
export const getReviewsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/reviews/club/${clubId}`)
  return data.reviews || []
}

export const getReviewsByUser = async (userId) => {
  if (!userId) return []
  const data = await apiRequest(`/reviews/user/${userId}`)
  return data.reviews || []
}

export const saveReview = async (review) => {
  const data = await apiRequest("/reviews", { method: "POST", body: review })
  return data.review
}

export const getAverageRating = async (clubId) => {
  const reviews = await getReviewsByClub(clubId)
  if (!reviews.length) return 0
  const sum = reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0)
  return Number((sum / reviews.length).toFixed(1))
}

// Messages
