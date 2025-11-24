import express from "express"
import Message from "../models/Message.js"
import asyncHandler from "../utils/asyncHandler.js"

const router = express.Router()

router.get(
  "/conversations/:userId",
  asyncHandler(async (req, res) => {
    const userId = req.params.userId
    const messages = await Message.find({
      $or: [{ senderId: userId }, { receiverId: userId }],
    })
      .sort({ createdAt: -1 })
      .lean()

    const conversations = new Map()

    messages.forEach((msg) => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId
      const otherUserName = msg.senderId === userId ? msg.receiverName : msg.senderName
      const convo = conversations.get(otherUserId) || {
        userId: otherUserId,
        userName: otherUserName,
        lastMessage: null,
        unreadCount: 0,
      }

      if (!convo.lastMessage) {
        convo.lastMessage = msg
      }

      if (msg.receiverId === userId && !msg.read) {
        convo.unreadCount += 1
      }

      conversations.set(otherUserId, convo)
    })

    res.json({ conversations: Array.from(conversations.values()) })
  })
)

router.get(
  "/thread",
  asyncHandler(async (req, res) => {
    const { user1, user2 } = req.query
    if (!user1 || !user2) {
      return res.status(400).json({ message: "user1 and user2 query params are required." })
    }

    const messages = await Message.find({
      $or: [
        { senderId: user1, receiverId: user2 },
        { senderId: user2, receiverId: user1 },
      ],
    }).sort({ createdAt: 1 })

    res.json({ messages })
  })
)

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { senderId, receiverId, senderName, receiverName, content } = req.body
    if (!senderId || !receiverId || !senderName || !receiverName || !content) {
      return res.status(400).json({ message: "Missing required message fields." })
    }

    const message = await Message.create({ senderId, receiverId, senderName, receiverName, content })
    res.status(201).json({ message: message.toJSON() })
  })
)

router.patch(
  "/read",
  asyncHandler(async (req, res) => {
    const { senderId, receiverId } = req.body
    if (!senderId || !receiverId) {
      return res.status(400).json({ message: "senderId and receiverId are required." })
    }

    await Message.updateMany({ senderId, receiverId, read: false }, { read: true })
    res.status(204).end()
  })
)

export default router

