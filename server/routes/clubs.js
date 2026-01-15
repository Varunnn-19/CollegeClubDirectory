import express from "express"
import mongoose from "mongoose"
import Club from "../models/Club.js"
import Event from "../models/Event.js"
import Announcement from "../models/Announcement.js"
import Review from "../models/Review.js"
import RSVP from "../models/RSVP.js"
import Membership from "../models/Membership.js"
import User from "../models/User.js"
import asyncHandler from "../utils/asyncHandler.js"
import { buildClubStats } from "../utils/stats.js"
import { seedClubs } from "../utils/seedClubs.js"

const router = express.Router()

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

/**
 * Emails allowed to approve/reject clubs
 * Set in .env as:
 * APPROVER_EMAILS=admin1@gmail.com,admin2@gmail.com
 */
const APPROVER_EMAILS = (process.env.APPROVER_EMAILS || "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean)

/* =====================================================
   GET ALL CLUBS (OPTIONAL FILTER BY STATUS OR SLUG)
===================================================== */
router.get(
  "/",
  asyncHandler(async (req, res) => {
    // Fetch by slug
    if (req.query.slug) {
      const club = await Club.findOne({ slug: req.query.slug })
      if (!club) {
        return res.json({ clubs: [] })
      }

      const stats = await buildClubStats([club._id])
      return res.json({
        clubs: [
          {
            ...enrichClub(club.toObject()),
            id: club._id,
            stats: stats[club._id] || {
              memberCount: 0,
              rating: 0,
              reviewCount: 0,
            },
          },
        ],
      })
    }

    const statusFilter = req.query.status || "approved"
    const clubs = await Club.find(
      statusFilter === "all" ? {} : { status: statusFilter }
    )
      .sort({ name: 1 })
      .lean()

    const stats = await buildClubStats(clubs.map((c) => c._id))

    res.json({
      clubs: clubs.map((club) => ({
        ...enrichClub(club),
        id: club._id,
        stats: {
          memberCount: stats[club._id]?.memberCount || 0,
          rating: stats[club._id]?.rating || 0,
          reviewCount: stats[club._id]?.reviewCount || 0,
        },
      })),
    })
  })
)

/* =====================================================
   GET CLUB BY ID OR SLUG
===================================================== */
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const { id } = req.params
    let club = null

    if (mongoose.Types.ObjectId.isValid(id)) {
      club = await Club.findById(id)
    }

    if (!club) {
      club = await Club.findOne({ slug: id })
    }

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    const clubId = club._id.toString()
    const events = (await Event.find({ clubId }).lean()).map((e) => ({
      ...e,
      id: e._id,
    }))
    const announcements = (await Announcement.find({ clubId }).lean()).map((a) => ({
      ...a,
      id: a._id,
    }))
    const reviews = (await Review.find({ clubId }).lean()).map((r) => ({
      ...r,
      id: r._id,
    }))
    const stats = await buildClubStats([club._id])

    res.json({
      club: {
        ...enrichClub(club.toObject()),
        id: club._id,
        stats: stats[club._id] || {
          memberCount: 0,
          rating: 0,
          reviewCount: 0,
        },
      },
      events,
      announcements,
      reviews,
    })
  })
)

/* =====================================================
   CREATE CLUB (PENDING BY DEFAULT)
===================================================== */
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, description, category, image, slug, createdBy, status } = req.body

    if (!name || !description || !category) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const safeSlug = slug || String(name).toLowerCase().trim().replace(/\s+/g, "-").replace(/[^\w-]/g, "")

    const existingClub = await Club.findOne({
      $or: [{ slug: safeSlug }, { name }],
    })

    if (existingClub) {
      if (existingClub.status === "rejected") {
        existingClub.name = name
        existingClub.slug = safeSlug
        existingClub.description = description
        existingClub.category = category
        if (image !== undefined) existingClub.image = image
        if (createdBy !== undefined) existingClub.createdBy = createdBy
        existingClub.status = "pending"

        await existingClub.save()
        return res.status(200).json({ club: existingClub })
      }

      return res.status(409).json({
        message:
          existingClub.status === "pending"
            ? "This club request is already pending approval."
            : "This club already exists.",
      })
    }

    try {
      const club = await Club.create({
        name,
        slug: safeSlug,
        description,
        category,
        image,
        createdBy,
        status: status || "pending",
      })

      return res.status(201).json({ club })
    } catch (err) {
      if (err?.code === 11000) {
        return res.status(409).json({
          message: "A club with the same name/slug already exists. If it was rejected earlier, please try again.",
        })
      }
      throw err
    }
  })
)

/* =====================================================
   APPROVE / REJECT / UPDATE CLUB
===================================================== */
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status, approverEmail, ...rest } = req.body

    // Approval / rejection authorization
    if (status === "approved" || status === "rejected") {
      if (!approverEmail) {
        return res.status(401).json({ message: "Approver email required." })
      }

      const email = approverEmail.toLowerCase()
      if (APPROVER_EMAILS.length > 0 && !APPROVER_EMAILS.includes(email)) {
        return res
          .status(403)
          .json({ message: "You are not authorized to approve clubs." })
      }
    }

    const updateDoc = status ? { status, ...rest } : { ...rest }
    const club = await Club.findByIdAndUpdate(req.params.id, updateDoc, {
      new: true,
      runValidators: true,
    })

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    // If club is being approved, promote the creator to club admin
    if (status === "approved" && club.createdBy) {
      await User.findByIdAndUpdate(club.createdBy, {
        role: "clubAdmin",
        assignedClubId: club._id,
      })
    }

    res.json({ club })
  })
)

/* =====================================================
   DELETE CLUB
===================================================== */
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = req.header("x-user-id")
    if (!actorId) {
      return res.status(401).json({ message: "Missing user context." })
    }

    const actor = await User.findById(actorId)
    if (!actor) {
      return res.status(401).json({ message: "Invalid user context." })
    }

    const assignedClubId = actor.assignedClubId
    const hasAssignedClub =
      assignedClubId !== undefined &&
      assignedClubId !== null &&
      String(assignedClubId).trim() !== "" &&
      String(assignedClubId).trim().toLowerCase() !== "null" &&
      String(assignedClubId).trim().toLowerCase() !== "undefined"

    const isPageAdmin = actor.role === "pageAdmin" || (actor.role === "admin" && !hasAssignedClub)
    if (!isPageAdmin) {
      return res.status(403).json({ message: "Only page admins can delete clubs." })
    }

    const club = await Club.findByIdAndDelete(req.params.id)

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    const clubId = club._id.toString()
    const eventIds = (await Event.find({ clubId }).select("_id").lean()).map((e) => e._id.toString())

    await Promise.all([
      Membership.deleteMany({ clubId }),
      Announcement.deleteMany({ clubId }),
      Review.deleteMany({ clubId }),
      RSVP.deleteMany({ clubId }),
      RSVP.deleteMany(eventIds.length ? { eventId: { $in: eventIds } } : { eventId: "__none__" }),
      Event.deleteMany({ clubId }),
    ])

    res.json({ message: "Club deleted successfully." })
  })
)

/* =====================================================
   SEED CLUBS
===================================================== */
router.post(
  "/seed",
  asyncHandler(async (req, res) => {
    const result = await seedClubs()
    res.json(result)
  })
)

export default router
