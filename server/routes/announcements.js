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

    const announcement = await Announcement.create({ clubId, title, content, priority, createdBy })
    res.status(201).json({ announcement: announcement.toJSON() })
  })
)

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const announcement = await Announcement.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found." })
    }
    res.json({ announcement: announcement.toJSON() })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Announcement.findByIdAndDelete(req.params.id)
    res.status(204).end()
  })
)

export default router

