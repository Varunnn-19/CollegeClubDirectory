import express from "express"
import Club from "../models/Club.js"
import Event from "../models/Event.js"
import Announcement from "../models/Announcement.js"
import Review from "../models/Review.js"
import RSVP from "../models/RSVP.js"
import asyncHandler from "../utils/asyncHandler.js"
import { buildClubStats } from "../utils/stats.js"

const router = express.Router()

const slugify = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")

router.get(
  "/",
  asyncHandler(async (_req, res) => {
    const clubs = await Club.find().sort({ name: 1 }).lean()
    const stats = await buildClubStats(clubs.map((club) => club._id))

    const payload = clubs.map((club) => ({
      ...club,
      id: club._id,
      stats: {
        memberCount: stats[club._id]?.memberCount || 0,
        rating: stats[club._id]?.rating || 0,
        reviewCount: stats[club._id]?.reviewCount || 0,
      },
    }))

    res.json({ clubs: payload })
  })
)

router.get(
  "/:slug",
  asyncHandler(async (req, res) => {
    const club = await Club.findOne({ slug: req.params.slug })
    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    const stats = await buildClubStats([club.id])

    const [events, announcements, reviews] = await Promise.all([
      Event.find({ clubId: club.id }).sort({ date: 1 }).lean(),
      Announcement.find({ clubId: club.id }).sort({ createdAt: -1 }).lean(),
      Review.find({ clubId: club.id }).sort({ createdAt: -1 }).lean(),
    ])

    const eventIds = events.map((event) => event._id.toString())
    const rsvpAgg = eventIds.length
      ? await RSVP.aggregate([
          { $match: { eventId: { $in: eventIds }, status: "going" } },
          { $group: { _id: "$eventId", count: { $sum: 1 } } },
        ])
      : []
    const rsvpMap = rsvpAgg.reduce((acc, cur) => {
      acc[cur._id] = cur.count
      return acc
    }, {})

    const eventsWithCounts = events.map((event) => ({
      ...event,
      id: event._id,
      rsvpCount: rsvpMap[event._id.toString()] || 0,
    }))

    res.json({
      club: club.toJSON(),
      stats: {
        memberCount: stats[club.id]?.memberCount || 0,
        rating: stats[club.id]?.rating || 0,
        reviewCount: stats[club.id]?.reviewCount || 0,
      },
      events: eventsWithCounts,
      announcements: announcements.map((announcement) => ({
        ...announcement,
        id: announcement._id,
      })),
      reviews: reviews.map((review) => ({
        ...review,
        id: review._id,
      })),
    })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const {
      name,
      shortDescription,
      fullDescription,
      category,
      membershipType = "Open",
      email,
      meetingTimes,
      social = {},
      images = [],
      createdBy = "",
    } = req.body

    if (!name || !shortDescription || !fullDescription || !category) {
      return res.status(400).json({ message: "Missing required club fields." })
    }

    const generatedSlug = slugify(req.body.slug || name)
    const slugExists = await Club.exists({ slug: generatedSlug })
    if (slugExists) {
      return res.status(400).json({ message: "A club with this name already exists." })
    }

    const clubId = req.body.id || Date.now().toString()

    const club = await Club.create({
      _id: clubId,
      slug: generatedSlug,
      name,
      shortDescription,
      fullDescription,
      category,
      membershipType,
      email,
      meetingTimes,
      social,
      images,
      createdBy,
      status: req.body.status || "pending",
    })

    res.status(201).json({ club: club.toJSON() })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updates = { ...req.body }
    if (updates.slug) {
      const slugExists = await Club.exists({ slug: updates.slug, _id: { $ne: req.params.id } })
      if (slugExists) {
        return res.status(400).json({ message: "Slug already in use." })
      }
    }

    const club = await Club.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    res.json({ club: club.toJSON() })
  })
)

export default router

