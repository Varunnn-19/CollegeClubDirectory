import express from "express"
import Review from "../models/Review.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/club/:clubId",
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({ clubId: req.params.clubId }).sort({ createdAt: -1 })
    res.json({ reviews })
  })
)

router.get(
  "/user/:userId",
  asyncHandler(async (req, res) => {
    const reviews = await Review.find({ userId: req.params.userId }).sort({ createdAt: -1 })
    res.json({ reviews })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { clubId, userId, userName, rating, comment } = req.body
    if (!clubId || !userId || !rating) {
      return res.status(400).json({ message: "Missing required review fields." })
    }
    const review = await Review.create({ clubId, userId, userName, rating, comment })
    res.status(201).json({ review })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    if (!review) return res.status(404).json({ message: "Review not found." })
    res.json({ review })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const review = await Review.findByIdAndDelete(req.params.id)
    if (!review) return res.status(404).json({ message: "Review not found." })
    res.json({ message: "Review deleted successfully." })
  })
)

export default router
