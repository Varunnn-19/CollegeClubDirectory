import express from "express"
import Announcement from "../models/Announcement.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const announcements = await Announcement.find({ clubId: req.params.clubId }).sort({ createdAt: -1 })
    res.json({ announcements })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { clubId, title, content, priority = "medium", createdBy = "" } = req.body
    if (!clubId || !title || !content) {
      return res.status(400).json({ message: "Missing required announcement fields." })
    }
    const announcement = await Announcement.create({
      clubId,
      title,
      content,
      priority,
      createdBy,
    })
    res.status(201).json({ announcement })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updates = { ...req.body }
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." })
    }
    res.json({ announcement })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndDelete(req.params.id)
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." })
    }
    res.json({ message: "Announcement deleted successfully." })
  })
)

export default router
