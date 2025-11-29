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
    const { userId, clubId, status = "pending", role = "member", joinedAt = new Date().toISOString() } = req.body
    if (!userId || !clubId) {
      return res.status(400).json({ message: "userId and clubId are required." })
    }

    const membership = await Membership.findOneAndUpdate(
      { userId, clubId },
      { userId, clubId, status, role, joinedAt },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(201).json({ membership })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
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

router.delete(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, clubId } = req.body
    if (!userId || !clubId) {
      return res.status(400).json({ message: "userId and clubId are required." })
    }

    await Membership.findOneAndDelete({ userId, clubId })
    res.status(204).end()
  })
)

export default router

