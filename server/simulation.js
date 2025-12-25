import express from "express"
import crypto from "crypto"
import { clubs as staticClubs } from "../lib/clubs.js"

function normalizeClubFromStatic(club) {
  const now = new Date().toISOString()
  return {
    id: String(club.id),
    _id: String(club.id),
    slug: club.slug,
    name: club.name,
    category: club.category,
    status: "approved",
    createdBy: "seed",
    createdAt: now,
    updatedAt: now,
    shortDescription: club.shortDescription || "",
    fullDescription: club.fullDescription || "",
    membershipType: club.membershipType || "Open",
    email: club.email || "",
    meetingTimes: club.meetingTimes || "",
    social: club.social || {},
    image: club.logoUrl || club.image || "",
  }
}

function normalizeEventFromStatic(clubId, event, index) {
  const now = new Date().toISOString()
  return {
    id: `${clubId}-evt-${index + 1}`,
    _id: `${clubId}-evt-${index + 1}`,
    clubId: String(clubId),
    title: event.title,
    description: event.description || "",
    date: event.date,
    time: event.time || "",
    location: event.location || "",
    rsvpCount: 0,
    createdBy: "seed",
    createdAt: now,
    updatedAt: now,
  }
}

function newId(prefix) {
  return `${prefix}_${crypto.randomUUID()}`
}

const state = {
  seeded: false,
  users: new Map(),
  clubs: new Map(),
  memberships: new Map(),
  events: new Map(),
  rsvps: new Map(),
  announcements: new Map(),
  reviews: new Map(),
}

function seedIfNeeded() {
  if (state.seeded) return
  state.seeded = true

  const now = new Date().toISOString()

  const pageAdmin = {
    id: "sim-page-admin",
    _id: "sim-page-admin",
    name: "Simulation Admin",
    email: "admin@bmsce.ac.in",
    usn: "1BM00AD000",
    yearOfStudy: "Faculty",
    phoneNumber: "9999999999",
    role: "pageAdmin",
    assignedClubId: "",
    passwordHash: "Admin@123",
    otpCode: null,
    otpExpiresAt: null,
    createdAt: now,
    updatedAt: now,
  }

  state.users.set(pageAdmin.id, pageAdmin)

  for (const club of staticClubs) {
    const normalized = normalizeClubFromStatic(club)
    state.clubs.set(normalized.id, normalized)

    const events = Array.isArray(club.events) ? club.events : []
    events.forEach((evt, idx) => {
      const eventRecord = normalizeEventFromStatic(normalized.id, evt, idx)
      state.events.set(eventRecord.id, eventRecord)
    })
  }
}

function sanitizeUser(user) {
  if (!user) return null
  const { passwordHash, otpCode, otpExpiresAt, ...rest } = user
  return { ...rest }
}

function enrichClub(rawClub) {
  const club = { ...rawClub }
  if (club.description && typeof club.description === "string") {
    try {
      const parsed = JSON.parse(club.description)
      if (parsed && typeof parsed === "object") {
        club.shortDescription = parsed.shortDescription || club.shortDescription
        club.fullDescription = parsed.fullDescription || club.fullDescription
        club.membershipType = parsed.membershipType || club.membershipType
        club.email = parsed.contactEmail || club.email
        club.meetingTimes = parsed.meetingTimes || club.meetingTimes
        club.social = parsed.social || club.social
      }
    } catch {
      // ignore
    }
  }
  return club
}

function computeClubStats(clubId) {
  const memberCount = Array.from(state.memberships.values()).filter(
    (m) => String(m.clubId) === String(clubId) && m.status === "joined"
  ).length

  const clubReviews = Array.from(state.reviews.values()).filter(
    (r) => String(r.clubId) === String(clubId)
  )

  const reviewCount = clubReviews.length
  const rating = reviewCount
    ? Number(
        (
          clubReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) /
          reviewCount
        ).toFixed(1)
      )
    : 0

  return { memberCount, rating, reviewCount }
}

function listClubs({ status, slug }) {
  let clubs = Array.from(state.clubs.values())

  const statusFilter = status || "approved"

  if (slug) {
    clubs = clubs.filter((c) => String(c.slug) === String(slug))
  } else if (statusFilter !== "all") {
    clubs = clubs.filter((c) => c.status === statusFilter)
  }

  clubs.sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")))

  return clubs.map((c) => ({
    ...enrichClub(c),
    stats: computeClubStats(c.id),
  }))
}

function getClubByIdOrSlug(idOrSlug) {
  const clubById = state.clubs.get(String(idOrSlug))
  if (clubById) return clubById
  return Array.from(state.clubs.values()).find((c) => String(c.slug) === String(idOrSlug)) || null
}

function parseActor(req) {
  const actorId = req.header("x-user-id")
  if (!actorId) return null
  return state.users.get(String(actorId)) || null
}

export function isSimulationMode() {
  if (process.env.SIMULATION_MODE === "true") return true
  const dev = process.env.NODE_ENV !== "production"
  const hasMongo = !!process.env.MONGODB_URI
  return dev && !hasMongo
}

export default function createSimulationRouter() {
  seedIfNeeded()

  const router = express.Router()

  router.get("/health", (_req, res) => {
    res.json({ status: "ok", simulation: true, timestamp: Date.now() })
  })

  router.post("/users/register", (req, res) => {
    const body = req.body || {}
    const { name, email, password, usn, yearOfStudy, phoneNumber, role = "user", assignedClubId = "", otp } = body

    if (!email || !password) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const normalizedEmail = String(email).toLowerCase()
    const existing = Array.from(state.users.values()).find((u) => String(u.email).toLowerCase() === normalizedEmail)

    if (otp) {
      if (!existing) return res.status(404).json({ message: "Registration session not found." })
      if (String(existing.otpCode || "") !== String(otp).trim()) {
        return res.status(400).json({ message: "Invalid or expired OTP." })
      }
      existing.otpCode = null
      existing.otpExpiresAt = null
      existing.updatedAt = new Date().toISOString()
      return res.status(201).json({ user: sanitizeUser(existing) })
    }

    const otpCode = "123456"
    const now = new Date().toISOString()

    if (existing) {
      existing.name = name || existing.name
      existing.passwordHash = password
      existing.usn = usn || existing.usn
      existing.yearOfStudy = yearOfStudy || existing.yearOfStudy
      existing.phoneNumber = phoneNumber || existing.phoneNumber
      existing.role = role
      existing.assignedClubId = assignedClubId || ""
      existing.otpCode = otpCode
      existing.otpExpiresAt = Date.now() + 10 * 60 * 1000
      existing.updatedAt = now
    } else {
      const id = newId("user")
      state.users.set(id, {
        id,
        _id: id,
        name: name || "User",
        email: normalizedEmail,
        usn: usn || "1BM00CS000",
        yearOfStudy: yearOfStudy || "1st",
        phoneNumber: phoneNumber || "9999999999",
        role,
        assignedClubId: assignedClubId || "",
        passwordHash: password,
        otpCode,
        otpExpiresAt: Date.now() + 10 * 60 * 1000,
        createdAt: now,
        updatedAt: now,
      })
    }

    res.json({
      otpRequired: true,
      message: `OTP sent to your college email. (DEV OTP: ${otpCode})`,
      otp: otpCode,
    })
  })

  router.post("/users/login", (req, res) => {
    const body = req.body || {}
    const { email, password, otp } = body

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password." })
    }

    const normalizedEmail = String(email).toLowerCase()
    const user = Array.from(state.users.values()).find((u) => String(u.email).toLowerCase() === normalizedEmail)
    if (!user) return res.status(401).json({ message: "Invalid credentials." })

    if (String(user.passwordHash) !== String(password)) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    if (otp) {
      if (String(user.otpCode || "") !== String(otp).trim()) {
        return res.status(400).json({ message: "Invalid or expired OTP." })
      }
      user.otpCode = null
      user.otpExpiresAt = null
      user.updatedAt = new Date().toISOString()
      return res.json({ user: sanitizeUser(user) })
    }

    const otpCode = "123456"
    user.otpCode = otpCode
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000
    user.updatedAt = new Date().toISOString()

    res.json({
      otpRequired: true,
      message: `OTP sent to your college email. (DEV OTP: ${otpCode})`,
      otp: otpCode,
    })
  })

  router.get("/users/id/:id", (req, res) => {
    const user = state.users.get(String(req.params.id))
    if (!user) return res.status(404).json({ message: "User not found." })
    res.json({ user: sanitizeUser(user) })
  })

  router.patch("/users/id/:id", (req, res) => {
    const actor = parseActor(req)
    if (!actor) return res.status(401).json({ message: "Missing user context." })

    const target = state.users.get(String(req.params.id))
    if (!target) return res.status(404).json({ message: "User not found." })

    const isSelf = String(actor.id) === String(target.id)
    const isPageAdmin = actor.role === "pageAdmin" || (actor.role === "admin" && !actor.assignedClubId)
    if (!isSelf && !isPageAdmin) return res.status(403).json({ message: "Not authorized." })

    Object.assign(target, req.body || {})
    target.updatedAt = new Date().toISOString()
    res.json({ user: sanitizeUser(target) })
  })

  router.post("/users/forgot-password", (req, res) => {
    const { email } = req.body || {}
    if (!email) return res.status(400).json({ message: "Email is required." })

    const normalizedEmail = String(email).toLowerCase()
    const user = Array.from(state.users.values()).find((u) => String(u.email).toLowerCase() === normalizedEmail)

    const otpCode = "123456"
    if (user) {
      user.otpCode = otpCode
      user.otpExpiresAt = Date.now() + 10 * 60 * 1000
      user.updatedAt = new Date().toISOString()
    }

    res.json({
      message: `Password reset OTP sent to your college email. (DEV OTP: ${otpCode})`,
      otp: otpCode,
    })
  })

  router.post("/users/reset-password", (req, res) => {
    const { email, otp, newPassword } = req.body || {}
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const normalizedEmail = String(email).toLowerCase()
    const user = Array.from(state.users.values()).find((u) => String(u.email).toLowerCase() === normalizedEmail)
    if (!user) return res.status(404).json({ message: "User not found." })

    if (String(user.otpCode || "") !== String(otp).trim()) {
      return res.status(400).json({ message: "Invalid or expired OTP." })
    }

    user.passwordHash = newPassword
    user.otpCode = null
    user.otpExpiresAt = null
    user.updatedAt = new Date().toISOString()

    res.json({ message: "Password reset successfully." })
  })

  router.get("/clubs", (req, res) => {
    const status = req.query.status ? String(req.query.status) : undefined
    const slug = req.query.slug ? String(req.query.slug) : undefined
    const clubs = listClubs({ status, slug })
    res.json({ clubs })
  })

  router.get("/clubs/:id", (req, res) => {
    const club = getClubByIdOrSlug(req.params.id)
    if (!club) return res.status(404).json({ message: "Club not found." })

    const clubId = String(club.id)
    const events = Array.from(state.events.values()).filter((e) => String(e.clubId) === clubId)
    const announcements = Array.from(state.announcements.values()).filter((a) => String(a.clubId) === clubId)
    const reviews = Array.from(state.reviews.values()).filter((r) => String(r.clubId) === clubId)

    events.sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    announcements.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    reviews.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))

    res.json({
      club: { ...enrichClub(club), stats: computeClubStats(clubId) },
      events,
      announcements,
      reviews,
    })
  })

  router.post("/clubs", (req, res) => {
    const body = req.body || {}
    const { name, description, category } = body
    if (!name || !description || !category) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const id = newId("club")
    const now = new Date().toISOString()

    const club = {
      id,
      _id: id,
      slug: body.slug || String(name).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, ""),
      name,
      description,
      category,
      image: body.image || "",
      createdBy: body.createdBy || "",
      status: body.status || "pending",
      createdAt: now,
      updatedAt: now,
    }

    state.clubs.set(id, club)
    res.status(201).json({ club })
  })

  router.patch("/clubs/:id", (req, res) => {
    const club = state.clubs.get(String(req.params.id))
    if (!club) return res.status(404).json({ message: "Club not found." })

    Object.assign(club, req.body || {})
    club.updatedAt = new Date().toISOString()

    res.json({ club })
  })

  router.delete("/clubs/:id", (req, res) => {
    const clubId = String(req.params.id)
    const club = state.clubs.get(clubId)
    if (!club) return res.status(404).json({ message: "Club not found." })

    state.clubs.delete(clubId)

    for (const [id, e] of state.events.entries()) {
      if (String(e.clubId) === clubId) state.events.delete(id)
    }
    for (const [id, m] of state.memberships.entries()) {
      if (String(m.clubId) === clubId) state.memberships.delete(id)
    }
    for (const [id, a] of state.announcements.entries()) {
      if (String(a.clubId) === clubId) state.announcements.delete(id)
    }
    for (const [id, r] of state.reviews.entries()) {
      if (String(r.clubId) === clubId) state.reviews.delete(id)
    }
    for (const [id, rsvp] of state.rsvps.entries()) {
      if (String(rsvp.clubId) === clubId) state.rsvps.delete(id)
    }

    res.json({ message: "Club deleted successfully." })
  })

  router.get("/memberships/user/:userId", (req, res) => {
    const memberships = Array.from(state.memberships.values()).filter(
      (m) => String(m.userId) === String(req.params.userId)
    )
    memberships.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    res.json({ memberships })
  })

  router.get("/memberships/club/:clubId", (req, res) => {
    const memberships = Array.from(state.memberships.values()).filter(
      (m) => String(m.clubId) === String(req.params.clubId)
    )
    memberships.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    res.json({ memberships })
  })

  router.post("/memberships", (req, res) => {
    const body = req.body || {}
    const { userId, clubId } = body
    if (!userId || !clubId) {
      return res.status(400).json({ message: "Missing required userId or clubId." })
    }

    const existing = Array.from(state.memberships.values()).find(
      (m) => String(m.userId) === String(userId) && String(m.clubId) === String(clubId)
    )

    if (existing && existing.status !== "rejected") {
      return res.status(409).json({ message: "User is already a member or has a pending request." })
    }

    const id = existing ? existing.id : newId("membership")
    const now = new Date().toISOString()

    const membership = {
      id,
      _id: id,
      userId: String(userId),
      clubId: String(clubId),
      userName: body.userName || "",
      userEmail: body.userEmail || "",
      status: "pending",
      role: body.role || "member",
      joinedAt: body.joinedAt || now,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    state.memberships.set(id, membership)
    res.status(existing ? 200 : 201).json({ membership })
  })

  router.patch("/memberships/:id", (req, res) => {
    const membership = state.memberships.get(String(req.params.id))
    if (!membership) return res.status(404).json({ message: "Membership not found." })

    Object.assign(membership, req.body || {})
    membership.updatedAt = new Date().toISOString()

    res.json({ membership })
  })

  router.delete("/memberships/:id", (req, res) => {
    const existing = state.memberships.get(String(req.params.id))
    if (!existing) return res.status(404).json({ message: "Membership not found." })

    state.memberships.delete(String(req.params.id))
    res.json({ message: "Membership deleted successfully." })
  })

  router.get("/events/club/:clubId", (req, res) => {
    const events = Array.from(state.events.values()).filter((e) => String(e.clubId) === String(req.params.clubId))
    events.sort((a, b) => String(a.date || "").localeCompare(String(b.date || "")))
    res.json({ events })
  })

  router.post("/events", (req, res) => {
    const body = req.body || {}
    const { clubId, title, date } = body
    if (!clubId || !title || !date) {
      return res.status(400).json({ message: "Missing required event fields." })
    }

    const id = newId("event")
    const now = new Date().toISOString()
    const event = {
      id,
      _id: id,
      clubId: String(clubId),
      title,
      description: body.description || "",
      date,
      time: body.time || "",
      location: body.location || "",
      rsvpCount: 0,
      createdBy: body.createdBy || "",
      createdAt: now,
      updatedAt: now,
    }

    state.events.set(id, event)
    res.status(201).json({ event })
  })

  function updateEventRecord(id, updates) {
    const event = state.events.get(String(id))
    if (!event) return null
    Object.assign(event, updates || {})
    event.updatedAt = new Date().toISOString()
    state.events.set(String(id), event)
    return event
  }

  router.patch("/events/:id", (req, res) => {
    const event = updateEventRecord(req.params.id, req.body)
    if (!event) return res.status(404).json({ message: "Event not found." })
    res.json({ event })
  })

  router.put("/events/:id", (req, res) => {
    const event = updateEventRecord(req.params.id, req.body)
    if (!event) return res.status(404).json({ message: "Event not found." })
    res.json({ event })
  })

  router.delete("/events/:id", (req, res) => {
    const event = state.events.get(String(req.params.id))
    if (!event) return res.status(404).json({ message: "Event not found." })

    state.events.delete(String(req.params.id))

    for (const [id, rsvp] of state.rsvps.entries()) {
      if (String(rsvp.eventId) === String(req.params.id)) state.rsvps.delete(id)
    }

    res.json({ message: "Event deleted successfully." })
  })

  router.get("/rsvps/user/:userId", (req, res) => {
    const rsvps = Array.from(state.rsvps.values()).filter((r) => String(r.userId) === String(req.params.userId))
    res.json({ rsvps })
  })

  router.get("/rsvps/event/:eventId", (req, res) => {
    const rsvps = Array.from(state.rsvps.values()).filter((r) => String(r.eventId) === String(req.params.eventId))
    res.json({ rsvps })
  })

  router.post("/rsvps", (req, res) => {
    const body = req.body || {}
    const { userId, eventId } = body
    if (!userId || !eventId) {
      return res.status(400).json({ message: "Missing required RSVP fields." })
    }

    const existing = Array.from(state.rsvps.values()).find(
      (r) => String(r.userId) === String(userId) && String(r.eventId) === String(eventId)
    )

    const status = body.status || "going"

    const id = existing ? existing.id : newId("rsvp")
    const now = new Date().toISOString()

    const rsvp = {
      id,
      _id: id,
      userId: String(userId),
      eventId: String(eventId),
      status,
      clubId: body.clubId || "",
      clubName: body.clubName || "",
      eventTitle: body.eventTitle || "",
      eventDate: body.eventDate || "",
      eventTime: body.eventTime || "",
      eventLocation: body.eventLocation || "",
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    }

    state.rsvps.set(id, rsvp)

    const event = state.events.get(String(eventId))
    if (event) {
      const goingCount = Array.from(state.rsvps.values()).filter(
        (x) => String(x.eventId) === String(eventId) && x.status === "going"
      ).length
      event.rsvpCount = goingCount
      event.updatedAt = new Date().toISOString()
      state.events.set(String(eventId), event)
    }

    res.status(existing ? 200 : 201).json({ rsvp })
  })

  router.patch("/rsvps/:id", (req, res) => {
    const rsvp = state.rsvps.get(String(req.params.id))
    if (!rsvp) return res.status(404).json({ message: "RSVP not found." })

    Object.assign(rsvp, req.body || {})
    rsvp.updatedAt = new Date().toISOString()
    state.rsvps.set(String(req.params.id), rsvp)

    res.json({ rsvp })
  })

  router.delete("/rsvps/:id", (req, res) => {
    const rsvp = state.rsvps.get(String(req.params.id))
    if (!rsvp) return res.status(404).json({ message: "RSVP not found." })

    state.rsvps.delete(String(req.params.id))
    res.json({ message: "RSVP deleted successfully." })
  })

  router.get("/announcements/club/:clubId", (req, res) => {
    const announcements = Array.from(state.announcements.values()).filter(
      (a) => String(a.clubId) === String(req.params.clubId)
    )
    announcements.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    res.json({ announcements })
  })

  router.post("/announcements", (req, res) => {
    const body = req.body || {}
    const { clubId, title, content } = body
    if (!clubId || !title || !content) {
      return res.status(400).json({ message: "Missing required announcement fields." })
    }

    const id = newId("announcement")
    const now = new Date().toISOString()

    const announcement = {
      id,
      _id: id,
      clubId: String(clubId),
      title,
      content,
      priority: body.priority || "medium",
      createdBy: body.createdBy || "",
      createdAt: now,
      updatedAt: now,
    }

    state.announcements.set(id, announcement)
    res.status(201).json({ announcement })
  })

  function updateAnnouncementRecord(id, updates) {
    const announcement = state.announcements.get(String(id))
    if (!announcement) return null
    Object.assign(announcement, updates || {})
    announcement.updatedAt = new Date().toISOString()
    state.announcements.set(String(id), announcement)
    return announcement
  }

  router.patch("/announcements/:id", (req, res) => {
    const announcement = updateAnnouncementRecord(req.params.id, req.body)
    if (!announcement) return res.status(404).json({ message: "Announcement not found." })
    res.json({ announcement })
  })

  router.put("/announcements/:id", (req, res) => {
    const announcement = updateAnnouncementRecord(req.params.id, req.body)
    if (!announcement) return res.status(404).json({ message: "Announcement not found." })
    res.json({ announcement })
  })

  router.delete("/announcements/:id", (req, res) => {
    const announcement = state.announcements.get(String(req.params.id))
    if (!announcement) return res.status(404).json({ message: "Announcement not found." })

    state.announcements.delete(String(req.params.id))
    res.json({ message: "Announcement deleted successfully." })
  })

  router.get("/reviews/club/:clubId", (req, res) => {
    const reviews = Array.from(state.reviews.values()).filter((r) => String(r.clubId) === String(req.params.clubId))
    reviews.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    res.json({ reviews })
  })

  router.get("/reviews/user/:userId", (req, res) => {
    const reviews = Array.from(state.reviews.values()).filter((r) => String(r.userId) === String(req.params.userId))
    reviews.sort((a, b) => String(b.createdAt || "").localeCompare(String(a.createdAt || "")))
    res.json({ reviews })
  })

  router.post("/reviews", (req, res) => {
    const body = req.body || {}
    const { clubId, userId, rating, comment } = body
    if (!clubId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required review fields." })
    }

    const id = newId("review")
    const now = new Date().toISOString()

    const review = {
      id,
      _id: id,
      clubId: String(clubId),
      userId: String(userId),
      userName: body.userName || "Anonymous",
      rating: Number(rating),
      comment: comment || "",
      createdAt: now,
      updatedAt: now,
    }

    state.reviews.set(id, review)
    res.status(201).json({ review })
  })

  router.patch("/reviews/:id", (req, res) => {
    const review = state.reviews.get(String(req.params.id))
    if (!review) return res.status(404).json({ message: "Review not found." })

    Object.assign(review, req.body || {})
    review.updatedAt = new Date().toISOString()
    state.reviews.set(String(req.params.id), review)

    res.json({ review })
  })

  router.delete("/reviews/:id", (req, res) => {
    const review = state.reviews.get(String(req.params.id))
    if (!review) return res.status(404).json({ message: "Review not found." })

    state.reviews.delete(String(req.params.id))
    res.json({ message: "Review deleted successfully." })
  })

  return router
}
