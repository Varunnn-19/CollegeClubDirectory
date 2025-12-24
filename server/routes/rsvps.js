import express from "express"
import RSVP from "../models/RSVP.js"
import Event from "../models/Event.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/event/:eventId",
  asyncHandler(async (req, res) => {
    const rsvps = await RSVP.find({ eventId: req.params.eventId })
    res.json({ rsvps })
  })
)

router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const rsvps = await RSVP.find({ userId: req.params.userId })
    res.json({ rsvps })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { userId, eventId } = req.body
    if (!userId || !eventId) {
      return res.status(400).json({ message: "Missing required RSVP fields." })
    }
    const status = req.body.status || "going"

    const rsvp = await RSVP.findOneAndUpdate(
      { userId, eventId },
      { ...req.body, status },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    )

    // If eventId looks like a Mongo ObjectId, update rsvpCount on Event
    if (/^[a-f0-9]{24}$/i.test(String(eventId))) {
      const goingCount = await RSVP.countDocuments({ eventId: String(eventId), status: "going" })
      await Event.findByIdAndUpdate(eventId, { rsvpCount: goingCount })
    }

    res.status(201).json({ rsvp })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const rsvp = await RSVP.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!rsvp) return res.status(404).json({ message: "RSVP not found." })
    res.json({ rsvp })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const rsvp = await RSVP.findByIdAndDelete(req.params.id)
    if (!rsvp) return res.status(404).json({ message: "RSVP not found." })
    res.json({ message: "RSVP deleted successfully." })
  })
)

export default router
