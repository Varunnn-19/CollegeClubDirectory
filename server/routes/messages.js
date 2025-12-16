import express from "express"
import Message from "../models/Message.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/conversation/:userId",
  asyncHandler(async (req, res) => {
    const messages = await Message.find({
      $or: [{ senderId: req.params.userId }, { receiverId: req.params.userId }],
    }).sort({ createdAt: -1 }).lean()

    const conversations = new Map()
    messages.forEach((msg) => {
      const otherUserId = msg.senderId === req.params.userId ? msg.receiverId : msg.senderId
      if (!conversations.has(otherUserId)) {
        conversations.set(otherUserId, msg)
      }
    })

    res.json({ conversations: Array.from(conversations.values()) })
  })
)

router.get(
  "/:senderId/:receiverId",
  asyncHandler(async (req, res) => {
    const messages = await Message.find({
      $or: [
        { senderId: req.params.senderId, receiverId: req.params.receiverId },
        { senderId: req.params.receiverId, receiverId: req.params.senderId },
      ],
    }).sort({ createdAt: 1 })
    res.json({ messages })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { senderId, receiverId, content } = req.body
    if (!senderId || !receiverId || !content) {
      return res.status(400).json({ message: "Missing required message fields." })
    }
    const message = await Message.create({ senderId, receiverId, content })
    res.status(201).json({ message })
  })
)

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const message = await Message.findByIdAndDelete(req.params.id)
    if (!message) return res.status(404).json({ message: "Message not found." })
    res.json({ message: "Message deleted successfully." })
  })
)

export default router
