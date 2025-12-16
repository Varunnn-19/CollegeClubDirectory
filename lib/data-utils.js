import { apiRequest } from "./api-client"
import { clubs as staticClubs } from "./clubs"

// Clubs
export const getClubs = async () => {
  try {
    return staticClubs
    }
  catch (error) { return staticClubs }
  };

export const getClubDetail = async (slug) => {
  if (!slug) return null
  try {
    const fallbackClub = staticClubs.find((club) => club.slug === slug)
    return fallbackClub ? { club: fallbackClub, stats: {} } : null
    }
    catch (err) { return null };
    };

export const saveClub = async (club) => {
  const data = await apiRequest("/clubs", { method: "POST", body: club })
  return data.club
}

export const updateClub = async (clubId, updates) => {
  const data = await apiRequest(`/clubs/${clubId}`, { method: "PATCH", body: updates })
  return data.club
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
  await apiRequest("/memberships", { method: "DELETE", body: { userId, clubId } })
}

export const updateMembership = async (membershipId, updates) => {
  const data = await apiRequest(`/memberships/${membershipId}`, { method: "PATCH", body: updates })
  return data.membership
}

// Events
export const getEventsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/events/club/${clubId}`)
  return data.events || []
}

export const saveEvent = async (event) => {
  if (event.id) {
    const data = await apiRequest(`/events/${event.id}`, { method: "PUT", body: event })
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
export const getAnnouncementsByClub = async (clubId) => {
  if (!clubId) return []
  const data = await apiRequest(`/announcements/club/${clubId}`)
  return data.announcements || []
}

export const saveAnnouncement = async (announcement) => {
  if (announcement.id) {
    const data = await apiRequest(`/announcements/${announcement.id}`, { method: "PUT", body: announcement })
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

export {
  getClubs,
  getClubDetail,
  saveClub,
  updateClub,
  deleteClub,
  getMembershipsByUser,
  getMembershipsByClub,
  saveMembership,
  deleteMembership,
  updateMembership,
  getEvents,
  getEventsByClub,
  saveEvent,
  deleteEvent,
  getEventRSVPsByUser,
  getEventRSVPsByEvent,
  saveEventRSVP,
  getAnnouncements,
  saveAnnouncement,
  deleteAnnouncement,
  getConversations,
  getMessagesBetweenUsers,
  saveMessage,
  markMessagesAsRead,
  getReviewsByClub,
  getReviewsByUser,
  saveReview,
  getAverageRating,
};
