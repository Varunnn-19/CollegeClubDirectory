import express from "express"
import Membership from "../models/Membership.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const memberships = await Membership.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json({ memberships })
  })
)

router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const memberships = await Membership.find({ clubId: req.params.clubId }).sort({ createdAt: -1 })
    res.json({ memberships })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, clubId } = req.body
    
    if (!userId || !clubId) {
      return res.status(400).json({ message: "Missing required userId or clubId." })
    }

    
    // Check if user is already a member
    const existingMembership = await Membership.findOne({
      userId: req.body.userId,
      clubId: req.body.clubId
    })
    if (existingMembership) {
      return res.status(409).json({ message: "User is already a member of this club." })
    }
    const membership = await Membership.create({
      ...req.body,
      role: req.body.role || "member",
      status: req.body.status || "pending"
    })
    
    res.status(201).json({ membership })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const membership = await Membership.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!membership) return res.status(404).json({ message: "Membership not found." })
    res.json({ membership })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const membership = await Membership.findByIdAndDelete(req.params.id)
    if (!membership) return res.status(404).json({ message: "Membership not found." })
    res.json({ message: "Membership deleted successfully." })
  })
)

// Approve or reject membership request
router.patch(
  "/:id/approve",
  asyncHandler(async (req, res) => {
    const { status } = req.body // 'active' to approve, 'rejected' to reject
    
    if (!status || !['active', 'rejected'].includes(status)) {
      return res.status(400).json({ message: "Invalid status. Use 'active' or 'rejected'." })
    }
    
    const membership = await Membership.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
    
    if (!membership) {
      return res.status(404).json({ message: "Membership not found." })
    }
    
    res.json({ membership, message: `Membership ${status === 'active' ? 'approved' : 'rejected'}.` })
  })
)


export default router
