import express from "express"
import bcrypt from "bcryptjs"
import User from "../models/User.js"
import asyncHandler from "../utils/asyncHandler.js"
import sanitizeUser from "../utils/sanitizeUser.js"
import { sendOtpEmail } from "../utils/email.js"

const router = express.Router()

const APPROVED_DOMAIN = "@bmsce.ac.in"
const OTP_EXPIRY_MINUTES = 10

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString()

router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, email, password, usn, yearOfStudy, phoneNumber, role = "user", assignedClubId = "" } = req.body

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Missing required fields." })
    }

    // Email domain validation
    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({ message: "Email must be from @bmsce.ac.in domain." })
    }

    // Password validation: at least one uppercase, one special character, and one number
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.\<>\/?])(?=.*[0-9]).{6,}$/
    if (!passwordRegex.test(password)) {
      return res.status(400).json({ message: "Password must contain at least one uppercase letter, one special character, and one number." })
    }

    const existing = await User.findOne({ email })
    if (existing) {
      return res.status(400).json({ message: "Email already registered." })
    }

    const passwordHash = await bcrypt.hash(password, 10)
    const user = await User.create({
      name,
      email,
      passwordHash,
      usn,
      yearOfStudy,
      phoneNumber,
      role,
      assignedClubId,
    })

    res.status(201).json({ user: sanitizeUser(user) })
  })
)

router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ message: "Missing email or password." })
    }

    // Email domain validation
    if (!email.endsWith(APPROVED_DOMAIN)) {
      return res.status(400).json({ message: "Email must be from @bmsce.ac.in domain." })
    }

    const user = await User.findOne({ email })

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    const isValid = await bcrypt.compare(password, user.passwordHash)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials." })
    }

    res.json({ user: sanitizeUser(user) })
  })
)

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    res.json({ user: sanitizeUser(user) })
  })
)

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    const updates = { ...req.body }
    if (updates.password) {
      updates.passwordHash = await bcrypt.hash(updates.password, 10)
      delete updates.password
    }
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
      runValidators: true,
    })
    if (!user) {
      return res.status(404).json({ message: "User not found." })
    }
    res.json({ user: sanitizeUser(user) })
  })
)

export default router
