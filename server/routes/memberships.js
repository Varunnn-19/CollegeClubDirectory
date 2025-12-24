import express from "express"
import Membership from "../models/Membership.js"
import User from "../models/User.js"
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

// Update membership (used by club-admin panel)
router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const actorId = req.header("x-user-id")
    if (!actorId) {
      return res.status(401).json({ message: "Missing user context." })
    }

    const [actor, current] = await Promise.all([
      User.findById(actorId),
      Membership.findById(req.params.id),
    ])

    if (!actor) {
      return res.status(401).json({ message: "Invalid user context." })
    }

    if (!current) {
      return res.status(404).json({ message: "Membership not found." })
    }

    const assignedClubId = actor.assignedClubId
    const hasAssignedClub =
      assignedClubId !== undefined &&
      assignedClubId !== null &&
      String(assignedClubId).trim() !== "" &&
      String(assignedClubId).trim().toLowerCase() !== "null" &&
      String(assignedClubId).trim().toLowerCase() !== "undefined"

    const isPageAdmin = actor.role === "pageAdmin" || (actor.role === "admin" && !hasAssignedClub)
    const isClubAdmin =
      (actor.role === "clubAdmin" || (actor.role === "admin" && hasAssignedClub)) &&
      String(actor.assignedClubId) === String(current.clubId)
    const isSelf = String(actor.id) === String(current.userId)

    if (!isPageAdmin && !isClubAdmin && !isSelf) {
      return res.status(403).json({ message: "Not authorized." })
    }

    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }

    res.json({ membership })
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

    const desiredStatus = "pending"

    const existingMembership = await Membership.findOne({ userId, clubId })
    if (existingMembership) {
      if (existingMembership.status === "rejected") {
        existingMembership.status = desiredStatus
        existingMembership.userName = req.body.userName || existingMembership.userName
        existingMembership.userEmail = req.body.userEmail || existingMembership.userEmail
        existingMembership.role = req.body.role || existingMembership.role || "member"
        existingMembership.joinedAt = req.body.joinedAt || new Date().toISOString()
        await existingMembership.save()
        return res.status(200).json({ membership: existingMembership })
      }

      return res.status(409).json({ message: "User is already a member or has a pending request." })
    }

    const membership = await Membership.create({
      ...req.body,
      role: req.body.role || "member",
      status: desiredStatus,
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
    const actorId = req.header("x-user-id")
    if (!actorId) {
      return res.status(401).json({ message: "Missing user context." })
    }

    const [actor, existing] = await Promise.all([
      User.findById(actorId),
      Membership.findById(req.params.id),
    ])

    if (!actor) {
      return res.status(401).json({ message: "Invalid user context." })
    }

    if (!existing) {
      return res.status(404).json({ message: "Membership not found." })
    }

    const assignedClubId = actor.assignedClubId
    const hasAssignedClub =
      assignedClubId !== undefined &&
      assignedClubId !== null &&
      String(assignedClubId).trim() !== "" &&
      String(assignedClubId).trim().toLowerCase() !== "null" &&
      String(assignedClubId).trim().toLowerCase() !== "undefined"

    const isPageAdmin = actor.role === "pageAdmin" || (actor.role === "admin" && !hasAssignedClub)
    const isClubAdmin =
      (actor.role === "clubAdmin" || (actor.role === "admin" && hasAssignedClub)) &&
      String(actor.assignedClubId) === String(existing.clubId)
    const isSelf = String(actor.id) === String(existing.userId)

    if (!isPageAdmin && !isClubAdmin && !isSelf) {
      return res.status(403).json({ message: "Not authorized." })
    }

    const membership = await Membership.findByIdAndDelete(req.params.id)
    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }
    res.json({ message: "Membership deleted successfully." })
  })
)

export default router
