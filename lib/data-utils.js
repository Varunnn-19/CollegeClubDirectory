// Utility functions for managing data in localStorage

export const getMemberships = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("memberships") || "[]")
}

export const saveMembership = (membership) => {
  const memberships = getMemberships()
  const existing = memberships.find((m) => m.userId === membership.userId && m.clubId === membership.clubId)
  if (existing) {
    Object.assign(existing, membership)
  } else {
    memberships.push(membership)
  }
  localStorage.setItem("memberships", JSON.stringify(memberships))
  return membership
}

export const deleteMembership = (userId, clubId) => {
  const memberships = getMemberships()
  const filtered = memberships.filter((m) => !(m.userId === userId && m.clubId === clubId))
  localStorage.setItem("memberships", JSON.stringify(filtered))
}

export const getMembershipsByClub = (clubId) => {
  return getMemberships().filter((m) => m.clubId === clubId)
}

export const getMembershipsByUser = (userId) => {
  return getMemberships().filter((m) => m.userId === userId)
}

export const getEvents = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("events") || "[]")
}

export const saveEvent = (event) => {
  const events = getEvents()
  const existing = events.find((e) => e.id === event.id)
  if (existing) {
    Object.assign(existing, event)
  } else {
    events.push(event)
  }
  localStorage.setItem("events", JSON.stringify(events))
  return event
}

export const deleteEvent = (eventId) => {
  const events = getEvents()
  const filtered = events.filter((e) => e.id !== eventId)
  localStorage.setItem("events", JSON.stringify(filtered))
  // Also delete RSVPs for this event
  const rsvps = getEventRSVPs()
  const filteredRsvps = rsvps.filter((r) => r.eventId !== eventId)
  localStorage.setItem("eventRSVPs", JSON.stringify(filteredRsvps))
}

export const getEventsByClub = (clubId) => {
  return getEvents().filter((e) => e.clubId === clubId)
}

export const getEventRSVPs = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("eventRSVPs") || "[]")
}

export const saveEventRSVP = (rsvp) => {
  const rsvps = getEventRSVPs()
  const existing = rsvps.find((r) => r.userId === rsvp.userId && r.eventId === rsvp.eventId)
  if (existing) {
    Object.assign(existing, rsvp)
  } else {
    rsvps.push(rsvp)
  }
  localStorage.setItem("eventRSVPs", JSON.stringify(rsvps))
  return rsvp
}

export const getRSVPsByEvent = (eventId) => {
  return getEventRSVPs().filter((r) => r.eventId === eventId)
}

export const getRSVPsByUser = (userId) => {
  return getEventRSVPs().filter((r) => r.userId === userId)
}

export const getAnnouncements = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("announcements") || "[]")
}

export const saveAnnouncement = (announcement) => {
  const announcements = getAnnouncements()
  const existing = announcements.find((a) => a.id === announcement.id)
  if (existing) {
    Object.assign(existing, announcement)
  } else {
    announcements.push(announcement)
  }
  localStorage.setItem("announcements", JSON.stringify(announcements))
  return announcement
}

export const deleteAnnouncement = (announcementId) => {
  const announcements = getAnnouncements()
  const filtered = announcements.filter((a) => a.id !== announcementId)
  localStorage.setItem("announcements", JSON.stringify(filtered))
}

export const getAnnouncementsByClub = (clubId) => {
  return getAnnouncements()
    .filter((a) => a.clubId === clubId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const getReviews = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("reviews") || "[]")
}

export const saveReview = (review) => {
  const reviews = getReviews()
  const existing = reviews.find((r) => r.id === review.id)
  if (existing) {
    Object.assign(existing, review)
  } else {
    reviews.push(review)
  }
  localStorage.setItem("reviews", JSON.stringify(reviews))
  return review
}

export const deleteReview = (reviewId) => {
  const reviews = getReviews()
  const filtered = reviews.filter((r) => r.id !== reviewId)
  localStorage.setItem("reviews", JSON.stringify(filtered))
}

export const getReviewsByClub = (clubId) => {
  if (!clubId) return getReviews().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  return getReviews()
    .filter((r) => r.clubId === clubId)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export const getAverageRating = (clubId) => {
  const reviews = getReviewsByClub(clubId)
  if (reviews.length === 0) return 0
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
  return (sum / reviews.length).toFixed(1)
}

export const getMessages = () => {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem("messages") || "[]")
}

export const saveMessage = (message) => {
  const messages = getMessages()
  messages.push(message)
  localStorage.setItem("messages", JSON.stringify(messages))
  return message
}

export const getMessagesBetweenUsers = (userId1, userId2) => {
  return getMessages()
    .filter(
      (m) =>
        (m.senderId === userId1 && m.receiverId === userId2) ||
        (m.senderId === userId2 && m.receiverId === userId1)
    )
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
}

export const getConversations = (userId) => {
  const messages = getMessages()
  const conversations = new Map()
  
  messages.forEach((msg) => {
    if (msg.senderId === userId || msg.receiverId === userId) {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const otherUserName = msg.senderId === userId ? msg.receiverName : msg.senderName
      
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, {
          userId: otherUserId,
          userName: otherUserName,
          lastMessage: msg,
          unreadCount: messages.filter(
            (m) => m.receiverId === userId && m.senderId === otherUserId && !m.read
          ).length,
        })
      } else {
        const conv = conversations.get(otherUserId)
        if (new Date(msg.createdAt) > new Date(conv.lastMessage.createdAt)) {
          conv.lastMessage = msg
        }
        conv.unreadCount = messages.filter(
          (m) => m.receiverId === userId && m.senderId === otherUserId && !m.read
        ).length
      }
    }
  })
  
  return Array.from(conversations.values()).sort(
    (a, b) => new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt)
  )
}

export const markMessagesAsRead = (senderId, receiverId) => {
  const messages = getMessages()
  messages.forEach((msg) => {
    if (msg.senderId === senderId && msg.receiverId === receiverId && !msg.read) {
      msg.read = true
    }
  })
  localStorage.setItem("messages", JSON.stringify(messages))
}

export const getClubs = () => {
  if (typeof window === "undefined") return []
  const customClubs = JSON.parse(localStorage.getItem("customClubs") || "[]")
  return customClubs
}

export const saveClub = (club) => {
  const clubs = getClubs()
  const existing = clubs.find((c) => c.id === club.id)
  if (existing) {
    Object.assign(existing, club)
  } else {
    clubs.push(club)
  }
  localStorage.setItem("customClubs", JSON.stringify(clubs))
  return club
}

export const getAllClubs = () => {
  // This will be used to combine default clubs with custom clubs
  // For now, we'll handle this in the components
  return []
}

