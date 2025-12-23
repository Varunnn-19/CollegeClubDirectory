import express from "express"
import mongoose from "mongoose"
import Club from "../models/Club.js"
import Event from "../models/Event.js"
import Announcement from "../models/Announcement.js"
import Review from "../models/Review.js"
import RSVP from "../models/RSVP.js"
import asyncHandler from "../utils/asyncHandler.js"
import { buildClubStats } from "../utils/stats.js"

const router = express.Router()

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
            ...club.toObject(),
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
        ...club,
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

    const events = await Event.find({ clubId: club._id }).lean()
    const announcements = await Announcement.find({ clubId: club._id }).lean()
    const reviews = await Review.find({ clubId: club._id }).lean()
    const stats = await buildClubStats([club._id])

    res.json({
      club: {
        ...club.toObject(),
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
    const { name, description, category, image } = req.body

    if (!name || !description || !category) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    const club = await Club.create({
      name,
      description,
      category,
      image,
      status: "pending",
    })

    res.status(201).json({ club })
  })
)

/* =====================================================
   APPROVE / REJECT / UPDATE CLUB
===================================================== */
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const { status, approverEmail } = req.body

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

    const club = await Club.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
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
    const club = await Club.findByIdAndDelete(req.params.id)

    if (!club) {
      return res.status(404).json({ message: "Club not found." })
    }

    res.json({ message: "Club deleted successfully." })
  })
)

export default router
