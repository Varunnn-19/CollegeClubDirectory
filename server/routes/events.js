import express from "express"
import Event from "../models/Event.js"
import RSVP from "../models/RSVP.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

const attachRsvpCounts = async (events) => {
  const ids = events.map((event) => event._id.toString())
  if (!ids.length) return events.map((event) => ({ ...event.toJSON(), rsvpCount: 0 }))

  const rsvpAgg = await RSVP.aggregate([
    { $match: { eventId: { $in: ids }, status: "going" } },
    { $group: { _id: "$eventId", count: { $sum: 1 } } },
  ])

  const map = rsvpAgg.reduce((acc, cur) => {
    acc[cur._id] = cur.count
    return acc
  }, {})

  return events.map((event) => ({
    ...event.toJSON(),
    rsvpCount: map[event._id.toString()] || 0,
  }))
}

router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const events = await Event.find({ clubId: req.params.clubId }).sort({ date: 1 })
    const payload = await attachRsvpCounts(events)
    res.json({ events: payload })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { clubId, title, date, time = "", location = "", description = "", createdBy = "" } = req.body
    if (!clubId || !title || !date || !location) {
      return res.status(400).json({ message: "Missing required event fields." })
    }

    const event = await Event.create({ clubId, title, date, time, location, description, createdBy })
    res.status(201).json({ event: event.toJSON() })
  })
)

router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!event) {
      return res.status(404).json({ message: "Event not found." })
    }
    res.json({ event: event.toJSON() })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    await Event.findByIdAndDelete(req.params.id)
    await RSVP.deleteMany({ eventId: req.params.id })
    res.status(204).end()
  })
)

export default router

