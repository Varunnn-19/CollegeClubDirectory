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
    const { userId, eventId } = req.body
    if (!userId || !eventId) {
      return res.status(400).json({ message: "Missing required RSVP fields." })
    }
    const rsvp = await RSVP.create({
      ...req.body,
      status: req.body.status || "going"
    })
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
