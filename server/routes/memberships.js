import express from "express"
import Membership from "../models/Membership.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

/* =========================
   USER ROUTES
========================= */

// Get memberships by user
router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const memberships = await Membership.find({ userId: req.params.userId })
      .sort({ createdAt: -1 })
    res.json({ memberships })
  })
)

// Get memberships by club
router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const memberships = await Membership.find({ clubId: req.params.clubId })
      .sort({ createdAt: -1 })
    res.json({ memberships })
  })
)

// Create membership (Join club)
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, clubId } = req.body

    if (!userId || !clubId) {
      return res.status(400).json({ message: "Missing required userId or clubId." })
    }

    const existingMembership = await Membership.findOne({ userId, clubId })
    if (existingMembership) {
      return res.status(409).json({
        message: "User is already a member or has a pending request."
      })
    }

    const membership = await Membership.create({
      ...req.body,
      role: req.body.role || "member",
      status: "pending", // 🔥 ALWAYS pending on join
    })

    res.status(201).json({ membership })
  })
)

/* =========================
   ADMIN ROUTES
========================= */

// 🔍 Admin – View pending join requests
router.get(
  "/admin",
  asyncHandler(async (req, res) => {
    const { status = "pending" } = req.query

    const memberships = await Membership.find({ status })
      .populate("userId", "name email")
      .populate("clubId", "name")

    res.json({ memberships })
  })
)

// ✅ Admin – Approve membership
router.patch(
  "/admin/:id/approve",
  asyncHandler(async (req, res) => {
    const membership = await Membership.findById(req.params.id)

    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }

    membership.status = "joined"
    await membership.save()

    res.json({
      membership,
      message: "Membership approved."
    })
  })
)

// ❌ Admin – Reject membership
router.patch(
  "/admin/:id/reject",
  asyncHandler(async (req, res) => {
    const membership = await Membership.findById(req.params.id)

    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }

    membership.status = "rejected"
    await membership.save()

    res.json({
      message: "Membership rejected."
    })
  })
)

// 🗑 Delete membership (leave club)
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const membership = await Membership.findByIdAndDelete(req.params.id)
    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }
    res.json({ message: "Membership deleted successfully." })
  })
)

export default router
