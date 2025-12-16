import express from "express"
import Event from "../models/Event.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const events = await Event.find({ clubId: req.params.clubId }).sort({ date: 1 })
    res.json({ events })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { clubId, title, description, date, location } = req.body
    if (!clubId || !title || !date) {
      return res.status(400).json({ message: "Missing required event fields." })
    }
    const event = await Event.create({ clubId, title, description, date, location })
    res.status(201).json({ event })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!event) return res.status(404).json({ message: "Event not found." })
    res.json({ event })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndDelete(req.params.id)
    if (!event) return res.status(404).json({ message: "Event not found." })
    res.json({ message: "Event deleted successfully." })
  })
)

export default router
