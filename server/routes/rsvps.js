import express from "express"
import RSVP from "../models/RSVP.js"
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
    const { eventId, userId, status = "going" } = req.body
    if (!eventId || !userId) {
      return res.status(400).json({ message: "eventId and userId are required." })
    }

    const rsvp = await RSVP.findOneAndUpdate(
      { eventId, userId },
      { eventId, userId, status },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    )

    res.status(201).json({ rsvp })
  })
)

export default router

